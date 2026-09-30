import { Router } from 'express';
import { SnailPayController } from '../controllers/SnailPayController';
import { ISnailPayService } from '../interfaces/ISnailPayService';
import { IUserRepository } from '../interfaces/IUserRepository';
import { SnailPayService } from '../services/SnailPayService';
import { JsonUserRepository } from '../repositories/JsonUserRepository';

const router = Router();

// Setup dependencies (DI manual)
const snailPayService: ISnailPayService = new SnailPayService();
const userRepo: IUserRepository = new JsonUserRepository();
const snailPayController = new SnailPayController(snailPayService, userRepo);

// POST /api/snailpay/charge
router.post('/charge', (req, res) => snailPayController.charge(req, res));

export default router;
