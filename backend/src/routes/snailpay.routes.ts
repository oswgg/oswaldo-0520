import { Router } from 'express';
import { SnailPayController } from '../controllers/SnailPayController';
import { ISnailPayService } from '../interfaces/ISnailPayService';
import { IUserRepository } from '../interfaces/IUserRepository';
import { ITransactionRepository } from '../interfaces/ITransactionRepository';
import { SnailPayService } from '../services/SnailPayService';
import { JsonUserRepository } from '../repositories/JsonUserRepository';
import { JsonTransactionRepository } from '../repositories/JsonTransactionRepository';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Setup dependencies (DI manual)
const snailPayService: ISnailPayService = new SnailPayService();
const userRepo: IUserRepository = new JsonUserRepository();
const transactionRepo: ITransactionRepository = new JsonTransactionRepository();
const snailPayController = new SnailPayController(
    snailPayService,
    userRepo,
    transactionRepo,
);

// POST /api/snailpay/charge (requiere autenticación)
router.post('/charge', authMiddleware(userRepo), (req, res) =>
    snailPayController.charge(req, res),
);

export default router;
