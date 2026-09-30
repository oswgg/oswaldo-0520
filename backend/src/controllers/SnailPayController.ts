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
            // El usuario viene del middleware de autenticación
            const user = req.user;
            if (!user) {
                res.status(401).json({
                    success: false,
                    error: 'Unauthorized',
                });
                return;
            }

            const body: ChargeRequest = req.body;

            // Validaciones básicas
            if (
                !body.cardNumber ||
                !body.expiryDate ||
                !body.cvv ||
                !body.fullName ||
                !body.amount
            ) {
                res.status(400).json({
                    success: false,
                    error: 'All fields are required',
                });
                return;
            }

            // Procesar pago con SnailPay (userId y email vienen del token)
            const paymentResponse: ChargeResponse =
                await this.snailPayService.processPayment(
                    body,
                    user.id,
                    user.email,
                );

            // Devolver respuesta al frontend (frontend actualizará balance según status)
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
