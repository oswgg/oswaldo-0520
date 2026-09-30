import { authMiddleware } from '../../middleware/auth.middleware';
import { IUserRepository } from '../../interfaces/IUserRepository';
import { User } from '../../types/User';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Mock de IUserRepository
const mockUserRepo: IUserRepository = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    incrementSessionCounter: jest.fn(),
};

describe('authMiddleware', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;
    const jwtSecret = 'test-secret-key';

    beforeEach(() => {
        mockReq = {
            headers: {},
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        mockNext = jest.fn();
        jest.clearAllMocks();
        process.env.JWT_SECRET = jwtSecret;
    });

    it('should call next() with valid token and matching session counter', async () => {
        const mockUser: User = {
            id: 'user-123',
            name: 'Test User',
            email: 'test@example.com',
            passwordHash: 'hashedPassword',
            balance: 100,
            sessionCounter: 1,
        };

        const token = jwt.sign(
            {
                userId: 'user-123',
                email: 'test@example.com',
                sessionCounter: 1,
            },
            jwtSecret,
        );

        mockReq.headers = { authorization: `Bearer ${token}` };
        (mockUserRepo.findById as jest.Mock).mockResolvedValue(mockUser);

        const middleware = authMiddleware(mockUserRepo);
        await middleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(mockReq.user).toEqual(mockUser);
        expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should return 401 if no token provided', async () => {
        mockReq.headers = {};

        const middleware = authMiddleware(mockUserRepo);
        await middleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                error: 'No token provided',
            }),
        );
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', async () => {
        mockReq.headers = { authorization: 'Bearer invalid-token' };

        const middleware = authMiddleware(mockUserRepo);
        await middleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                error: 'Invalid token',
            }),
        );
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 if user not found', async () => {
        const token = jwt.sign(
            {
                userId: 'nonexistent',
                email: 'test@example.com',
                sessionCounter: 1,
            },
            jwtSecret,
        );

        mockReq.headers = { authorization: `Bearer ${token}` };
        (mockUserRepo.findById as jest.Mock).mockResolvedValue(null);

        const middleware = authMiddleware(mockUserRepo);
        await middleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                error: 'User not found',
            }),
        );
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 if session counter does not match (expired session)', async () => {
        const mockUser: User = {
            id: 'user-123',
            name: 'Test User',
            email: 'test@example.com',
            passwordHash: 'hashedPassword',
            balance: 100,
            sessionCounter: 5, // Current counter in DB
        };

        // Token has counter 1 (old session)
        const token = jwt.sign(
            {
                userId: 'user-123',
                email: 'test@example.com',
                sessionCounter: 1,
            },
            jwtSecret,
        );

        mockReq.headers = { authorization: `Bearer ${token}` };
        (mockUserRepo.findById as jest.Mock).mockResolvedValue(mockUser);

        const middleware = authMiddleware(mockUserRepo);
        await middleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                error: 'Invalid session',
            }),
        );
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 if token does not start with Bearer', async () => {
        mockReq.headers = { authorization: 'InvalidFormat token' };

        const middleware = authMiddleware(mockUserRepo);
        await middleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                error: 'No token provided',
            }),
        );
        expect(mockNext).not.toHaveBeenCalled();
    });
});
