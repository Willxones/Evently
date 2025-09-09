import cors from 'cors';
import express, { Request, Response } from 'express';

import { login, logout, signup } from '../../services/shared/auth.service.js';

const router = express.Router();

router.use(express.json());
router.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
        allowedHeaders: ['Content-Type', 'authorization'],
    })
);

// Signup
router.post('/signup', async (req: Request, res: Response): Promise<void> => {
    await signup(req, res);
});

// Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    await login(req, res);
});

// Logout
router.post('/logout', async (req: Request, res: Response): Promise<void> => {
    await logout(req, res);
});

export default router;
