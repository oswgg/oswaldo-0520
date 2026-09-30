import { Router } from 'express';
import { SnailPayController } from '../controllers/SnailPayController';
import { ISnailPayService } from '../interfaces/ISnailPayService';
import { IUserRepository } from '../interfaces/IUserRepository';
import { SnailPayService } from '../services/SnailPayService';
import { JsonUserRepository } from '../repositories/JsonUserRepository';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Setup dependencies (DI manual)
const snailPayService: ISnailPayService = new SnailPayService();
const userRepo: IUserRepository = new JsonUserRepository();
const snailPayController = new SnailPayController(snailPayService, userRepo);

// POST /api/snailpay/charge (requiere autenticación)
router.post('/charge', authMiddleware(userRepo), (req, res) =>
    snailPayController.charge(req, res),
);

export default router;
