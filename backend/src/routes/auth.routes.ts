import { Router } from 'express';
import { RegisterRequest, LoginRequest } from '@oswaldo/dtos';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const body: RegisterRequest = req.body;
        // TODO: Implementar lógica de registro en controller
        res.status(501).json({ success: false, error: 'Not implemented yet' });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const body: LoginRequest = req.body;
        // TODO: Implementar lógica de login en controller
        res.status(501).json({ success: false, error: 'Not implemented yet' });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
    try {
        // TODO: Implementar lógica de logout en controller
        res.status(501).json({ success: false, error: 'Not implemented yet' });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
});

export default router;
