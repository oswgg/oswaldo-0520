import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../types/User';

// Extender Request para incluir user
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

interface JWTPayload {
    userId: string;
    email: string;
    sessionCounter: number;
}

export const authMiddleware = (userRepo: IUserRepository) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Extraer token del header Authorization
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    success: false,
                    error: 'No token provided',
                });
            }

            const token = authHeader.substring(7); // Remover 'Bearer '

            // Verificar firma del JWT
            const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
            const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

            // Obtener usuario de la base de datos
            const user = await userRepo.findById(decoded.userId);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: 'User not found',
                });
            }

            // Validar contador de sesión (invalidación de sesiones anteriores)
            if (user.sessionCounter !== decoded.sessionCounter) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid session',
                });
            }

            // Adjuntar usuario al request
            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                error: 'Invalid token',
            });
        }
    };
};
