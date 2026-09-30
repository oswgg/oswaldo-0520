import { SnailPayService } from '../../services/SnailPayService';
import { ISnailPayService } from '../../interfaces/ISnailPayService';
import { ChargeRequest } from '@oswaldo/dtos';

describe('SnailPayService', () => {
    let snailPayService: ISnailPayService;

    beforeEach(() => {
        snailPayService = new SnailPayService();
    });

    describe('processPayment', () => {
        it('should approve payment with valid card details', async () => {
            const request: ChargeRequest = {
                cardNumber: '1234123412341234',
                expiryDate: '12/26',
                cvv: '543',
                fullName: 'John Doe',
                amount: 100,
            };

            const response = await snailPayService.processPayment(
                request,
                'user-123',
                'user@example.com',
            );

            expect(response.status).toBe('approved');
            expect(response.status_detail).toBe(
                'Payment processed successfully',
            );
            expect(response.transaction_amount).toBe(100);
            expect(response.authorization_code).toBeDefined();
        });

        it('should reject payment with invalid card number', async () => {
            const request: ChargeRequest = {
                cardNumber: '1111222233334444',
                expiryDate: '12/26',
                cvv: '543',
                fullName: 'John Doe',
                amount: 100,
            };

            const response = await snailPayService.processPayment(
                request,
                'user-123',
                'user@example.com',
            );

            expect(response.status).toBe('rejected');
            expect(response.status_detail).toBe('Invalid card details');
            expect(response.authorization_code).toBeUndefined();
        });

        it('should reject payment with invalid CVV', async () => {
            const request: ChargeRequest = {
                cardNumber: '1234123412341234',
                expiryDate: '12/26',
                cvv: '999',
                fullName: 'John Doe',
                amount: 100,
            };

            const response = await snailPayService.processPayment(
                request,
                'user-123',
                'user@example.com',
            );

            expect(response.status).toBe('rejected');
            expect(response.status_detail).toBe('Invalid card details');
        });

        it('should reject payment with invalid expiry date', async () => {
            const request: ChargeRequest = {
                cardNumber: '1234123412341234',
                expiryDate: '01/25',
                cvv: '543',
                fullName: 'John Doe',
                amount: 100,
            };

            const response = await snailPayService.processPayment(
                request,
                'user-123',
                'user@example.com',
            );

            expect(response.status).toBe('rejected');
            expect(response.status_detail).toBe('Invalid card details');
        });

        it('should reject payment with empty name', async () => {
            const request: ChargeRequest = {
                cardNumber: '1234123412341234',
                expiryDate: '12/26',
                cvv: '543',
                fullName: '',
                amount: 100,
            };

            const response = await snailPayService.processPayment(
                request,
                'user-123',
                'user@example.com',
            );

            expect(response.status).toBe('rejected');
            expect(response.status_detail).toBe('Invalid cardholder name');
        });

        it('should reject payment with amount <= 0', async () => {
            const request: ChargeRequest = {
                cardNumber: '1234123412341234',
                expiryDate: '12/26',
                cvv: '543',
                fullName: 'John Doe',
                amount: 0,
            };

            const response = await snailPayService.processPayment(
                request,
                'user-123',
                'user@example.com',
            );

            expect(response.status).toBe('rejected');
            expect(response.status_detail).toBe(
                'Invalid amount: must be greater than zero',
            );
        });

        it('should return system error when system error is enabled', async () => {
            const request: ChargeRequest = {
                cardNumber: '1234123412341234',
                expiryDate: '12/26',
                cvv: '543',
                fullName: 'John Doe',
                amount: 100,
            };

            (snailPayService as SnailPayService).setSystemError(true);

            const response = await snailPayService.processPayment(
                request,
                'user-123',
                'user@example.com',
            );

            expect(response.status).toBe('error');
            expect(response.status_detail).toBe(
                'System error: SnailPay service unavailable',
            );

            // Reset for other tests
            (snailPayService as SnailPayService).setSystemError(false);
        });
    });
});
