import { Request, Response } from 'express';
import { ISnailPayService } from '../interfaces/ISnailPayService';
import { IUserRepository } from '../interfaces/IUserRepository';
import { ChargeRequest, ChargeResponse } from '@oswaldo/dtos';

export class SnailPayController {
    constructor(
        private snailPayService: ISnailPayService,
        private userRepo: IUserRepository,
    ) {}

    async charge(req: Request, res: Response): Promise<void> {
        try {
            const body: ChargeRequest = req.body;

            // Validaciones básicas
            if (
                !body.cardNumber ||
                !body.expiryDate ||
                !body.cvv ||
                !body.fullName ||
                !body.amount ||
                !body.userId ||
                !body.email
            ) {
                res.status(400).json({
                    success: false,
                    error: 'All fields are required',
                });
                return;
            }

            // Verificar que el usuario existe
            const user = await this.userRepo.findById(body.userId);
            if (!user) {
                res.status(404).json({
                    success: false,
                    error: 'User not found',
                });
                return;
            }

            // Verificar que el email coincida
            if (user.email !== body.email) {
                res.status(400).json({
                    success: false,
                    error: 'Email does not match user',
                });
                return;
            }

            // Procesar pago con SnailPay
            const paymentResponse: ChargeResponse =
                await this.snailPayService.processPayment(body);

            // Si el pago fue exitoso, actualizar el saldo del usuario
            if (paymentResponse.status === 'approved') {
                const newBalance =
                    user.balance + paymentResponse.transaction_amount;
                await this.userRepo.update(user.id, { balance: newBalance });
            }

            res.status(200).json(paymentResponse);
        } catch (error) {
            console.error('Charge error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
}
