import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { IPasswordHasher } from '../interfaces/IPasswordHasher';
import { IUserRepository } from '../interfaces/IUserRepository';
import { BcryptHasher } from '../services/PasswordHasher/BcryptHasher';
import { JsonUserRepository } from '../repositories/JsonUserRepository';

const router = Router();

// Setup dependencies (DI manual)
const passwordHasher: IPasswordHasher = new BcryptHasher();
const userRepo: IUserRepository = new JsonUserRepository();
const authController = new AuthController(passwordHasher, userRepo);

// POST /api/auth/register
router.post('/register', (req, res) => authController.register(req, res));

// POST /api/auth/login
router.post('/login', (req, res) => authController.login(req, res));

export default router;
