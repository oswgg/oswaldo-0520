import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { IPasswordHasher } from '../interfaces/IPasswordHasher';
import { IUserRepository } from '../interfaces/IUserRepository';
import { Argon2Hasher } from '../services/PasswordHasher/Argon2Hasher';
import { JsonUserRepository } from '../repositories/JsonUserRepository';

const router = Router();

// Setup dependencies (DI manual)
const passwordHasher: IPasswordHasher = new Argon2Hasher();
const userRepo: IUserRepository = new JsonUserRepository();
const authController = new AuthController(passwordHasher, userRepo);

// POST /api/auth/register
router.post('/register', (req, res) => authController.register(req, res));

// POST /api/auth/login
router.post('/login', (req, res) => authController.login(req, res));

export default router;
