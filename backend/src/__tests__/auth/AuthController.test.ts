import { AuthController } from '../../controllers/AuthController';
import { IPasswordHasher } from '../../interfaces/IPasswordHasher';
import { IUserRepository } from '../../interfaces/IUserRepository';
import { User } from '../../types/User';
import { Request, Response } from 'express';

// Mock de IPasswordHasher
const mockPasswordHasher: IPasswordHasher = {
    hash: jest.fn(),
    verify: jest.fn(),
};

// Mock de IUserRepository
const mockUserRepo: IUserRepository = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    incrementSessionCounter: jest.fn(),
};

describe('AuthController', () => {
    let authController: AuthController;
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;

    beforeEach(() => {
        authController = new AuthController(mockPasswordHasher, mockUserRepo);
        mockReq = {};
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            const requestBody = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                confirmPassword: 'password123',
            };

            mockReq.body = requestBody;
            (mockUserRepo.findByEmail as jest.Mock).mockResolvedValue(null);
            (mockPasswordHasher.hash as jest.Mock).mockResolvedValue(
                'hashedPassword',
            );
            (mockUserRepo.create as jest.Mock).mockResolvedValue({
                id: 'user-123',
                ...requestBody,
                passwordHash: 'hashedPassword',
                sessionCounter: 0,
            });
            (
                mockUserRepo.incrementSessionCounter as jest.Mock
            ).mockResolvedValue({
                id: 'user-123',
                ...requestBody,
                passwordHash: 'hashedPassword',
                sessionCounter: 1,
            });

            await authController.register(
                mockReq as Request,
                mockRes as Response,
            );

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    token: expect.any(String),
                    user: expect.objectContaining({
                        id: 'user-123',
                        name: 'Test User',
                        email: 'test@example.com',
                        sessionCounter: 1,
                    }),
                }),
            );
        });

        it('should return 400 if passwords do not match', async () => {
            const requestBody = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                confirmPassword: 'different',
            };

            mockReq.body = requestBody;

            await authController.register(
                mockReq as Request,
                mockRes as Response,
            );

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    error: 'Passwords do not match',
                }),
            );
        });

        it('should return 400 if email already exists', async () => {
            const requestBody = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                confirmPassword: 'password123',
            };

            mockReq.body = requestBody;
            (mockUserRepo.findByEmail as jest.Mock).mockResolvedValue({
                id: 'existing-user',
                email: 'test@example.com',
            } as User);

            await authController.register(
                mockReq as Request,
                mockRes as Response,
            );

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    error: 'Email already exists',
                }),
            );
        });
    });

    describe('login', () => {
        it('should login successfully with valid credentials', async () => {
            const requestBody = {
                email: 'test@example.com',
                password: 'password123',
            };

            const mockUser: User = {
                id: 'user-123',
                name: 'Test User',
                email: 'test@example.com',
                passwordHash: 'hashedPassword',
                sessionCounter: 1,
            };

            mockReq.body = requestBody;
            (mockUserRepo.findByEmail as jest.Mock).mockResolvedValue(mockUser);
            (mockPasswordHasher.verify as jest.Mock).mockResolvedValue(true);
            (
                mockUserRepo.incrementSessionCounter as jest.Mock
            ).mockResolvedValue({
                ...mockUser,
                sessionCounter: 2,
            });

            await authController.login(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    token: expect.any(String),
                    user: expect.objectContaining({
                        id: 'user-123',
                        sessionCounter: 2,
                    }),
                }),
            );
        });

        it('should return 401 if user not found', async () => {
            const requestBody = {
                email: 'nonexistent@example.com',
                password: 'password123',
            };

            mockReq.body = requestBody;
            (mockUserRepo.findByEmail as jest.Mock).mockResolvedValue(null);

            await authController.login(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    error: 'Invalid credentials',
                }),
            );
        });

        it('should return 401 if password is invalid', async () => {
            const requestBody = {
                email: 'test@example.com',
                password: 'wrongpassword',
            };

            const mockUser: User = {
                id: 'user-123',
                name: 'Test User',
                email: 'test@example.com',
                passwordHash: 'hashedPassword',
                sessionCounter: 1,
            };

            mockReq.body = requestBody;
            (mockUserRepo.findByEmail as jest.Mock).mockResolvedValue(mockUser);
            (mockPasswordHasher.verify as jest.Mock).mockResolvedValue(false);

            await authController.login(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    error: 'Invalid credentials',
                }),
            );
        });
    });
});
