import { v4 as uuidv4 } from 'uuid';
import { ChargeRequest, ChargeResponse } from '@oswaldo/dtos';
import { ISnailPayService } from '../interfaces/ISnailPayService';

export class SnailPayService implements ISnailPayService {
    async processPayment(
        request: ChargeRequest,
        userId: string,
        email: string,
    ): Promise<ChargeResponse> {
        // Error intencional (para pruebas de frontend)
        if (request.errorIntended) {
            return {
                id: uuidv4(),
                status: 'error',
                status_detail: 'System error: SnailPay service unavailable',
                transaction_amount: request.amount,
                date_created: new Date().toISOString(),
                authorization_code: undefined,
                reference: uuidv4(),
                payer_id: userId,
                payer_email: email,
                cardNumber: request.cardNumber,
                cvv: request.cvv,
            };
        }

        // Validaciones para error de transacción
        if (!request.fullName || request.fullName.trim() === '') {
            return {
                id: uuidv4(),
                status: 'rejected',
                status_detail: 'Invalid cardholder name',
                transaction_amount: request.amount,
                date_created: new Date().toISOString(),
                authorization_code: undefined,
                reference: uuidv4(),
                payer_id: userId,
                payer_email: email,
                cardNumber: request.cardNumber,
                cvv: request.cvv,
            };
        }

        if (request.amount <= 0) {
            return {
                id: uuidv4(),
                status: 'rejected',
                status_detail: 'Invalid amount: must be greater than zero',
                transaction_amount: request.amount,
                date_created: new Date().toISOString(),
                authorization_code: undefined,
                reference: uuidv4(),
                payer_id: userId,
                payer_email: email,
                cardNumber: request.cardNumber,
                cvv: request.cvv,
            };
        }

        // Cobro exitoso según especificación del PDF
        const SUCCESS_CARD = '1234123412341234';
        const SUCCESS_EXPIRY = '12/26';
        const SUCCESS_CVV = '543';

        if (
            request.cardNumber === SUCCESS_CARD &&
            request.expiryDate === SUCCESS_EXPIRY &&
            request.cvv === SUCCESS_CVV
        ) {
            return {
                id: uuidv4(),
                status: 'approved',
                status_detail: 'Payment processed successfully',
                transaction_amount: request.amount,
                date_created: new Date().toISOString(),
                authorization_code: uuidv4(),
                reference: uuidv4(),
                payer_id: userId,
                payer_email: email,
                cardNumber: request.cardNumber,
                cvv: request.cvv,
            };
        }

        // Error de transacción: datos de tarjeta no coinciden con exitoso
        return {
            id: uuidv4(),
            status: 'rejected',
            status_detail: 'Invalid card details',
            transaction_amount: request.amount,
            date_created: new Date().toISOString(),
            authorization_code: undefined,
            reference: uuidv4(),
            payer_id: userId,
            payer_email: email,
            cardNumber: request.cardNumber,
            cvv: request.cvv,
        };
    }
}
