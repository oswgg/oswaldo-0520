import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IPasswordHasher } from '../interfaces/IPasswordHasher';
import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../types/User';
import { RegisterRequest, LoginRequest, AuthResponse } from '@oswaldo/dtos';

export class AuthController {
    constructor(
        private passwordHasher: IPasswordHasher,
        private userRepo: IUserRepository,
    ) {}

    async register(req: Request, res: Response): Promise<void> {
        try {
            const body: RegisterRequest = req.body;

            // Validaciones básicas
            if (
                !body.name ||
                !body.email ||
                !body.password ||
                !body.confirmPassword
            ) {
                res.status(400).json({
                    success: false,
                    error: 'All fields are required',
                });
                return;
            }

            if (body.password !== body.confirmPassword) {
                res.status(400).json({
                    success: false,
                    error: 'Passwords do not match',
                });
                return;
            }

            if (body.password.length < 6) {
                res.status(400).json({
                    success: false,
                    error: 'Password must be at least 6 characters',
                });
                return;
            }

            // Verificar que el email no exista
            const existingUser = await this.userRepo.findByEmail(body.email);
            if (existingUser) {
                res.status(400).json({
                    success: false,
                    error: 'Email already exists',
                });
                return;
            }

            // Hash de contraseña con Argon2
            const passwordHash = await this.passwordHasher.hash(body.password);

            // Crear usuario con contador de sesión inicial
            const newUser: Omit<User, 'id'> = {
                name: body.name,
                email: body.email,
                passwordHash,
                balance: 0,
                sessionCounter: 0,
            };

            const createdUser = await this.userRepo.create(newUser);

            // Generar JWT (contador = 1 para primera sesión)
            const token = this.generateToken(createdUser, 1);

            // Incrementar contador en el usuario
            await this.userRepo.incrementSessionCounter(createdUser.id);

            const response: AuthResponse = {
                success: true,
                token,
                user: {
                    id: createdUser.id,
                    name: createdUser.name,
                    email: createdUser.email,
                    balance: createdUser.balance,
                    sessionCounter: 1,
                },
            };

            res.status(201).json(response);
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const body: LoginRequest = req.body;

            // Validaciones básicas
            if (!body.email || !body.password) {
                res.status(400).json({
                    success: false,
                    error: 'Email and password are required',
                });
                return;
            }

            // Buscar usuario por email
            const user = await this.userRepo.findByEmail(body.email);
            if (!user) {
                res.status(401).json({
                    success: false,
                    error: 'Invalid credentials',
                });
                return;
            }

            // Verificar contraseña
            const isValidPassword = await this.passwordHasher.verify(
                user.passwordHash,
                body.password,
            );
            if (!isValidPassword) {
                res.status(401).json({
                    success: false,
                    error: 'Invalid credentials',
                });
                return;
            }

            // Incrementar contador de sesión (invalida sesiones anteriores)
            const updatedUser = await this.userRepo.incrementSessionCounter(
                user.id,
            );
            if (!updatedUser) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to update session',
                });
                return;
            }

            // Generar JWT con nuevo contador
            const token = this.generateToken(
                updatedUser,
                updatedUser.sessionCounter,
            );

            const response: AuthResponse = {
                success: true,
                token,
                user: {
                    id: updatedUser.id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    balance: updatedUser.balance,
                    sessionCounter: updatedUser.sessionCounter,
                },
            };

            res.status(200).json(response);
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }

    private generateToken(user: User, sessionCounter: number): string {
        const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
        const payload = {
            userId: user.id,
            email: user.email,
            sessionCounter,
        };

        return jwt.sign(payload, jwtSecret, { expiresIn: '24h' });
    }
}
