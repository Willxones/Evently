import cors from 'cors';
import express, { Request, Response } from 'express';

import { authenticateToken } from '../../middlewares/shared/auth.js';
import {
    createOrganiserProfile,
    getOrganiserProfile,
} from '../../services/organiser/organiserProfile.service.js';

const router = express.Router();

router.use(express.json());
router.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
        allowedHeaders: ['Content-Type', 'authorization'],
    })
);

router.post('/', authenticateToken, async (req: Request, res: Response) => {
    await createOrganiserProfile(req, res);
});

router.get('/get-organiser-profile', authenticateToken, async (req: Request, res: Response) => {
    await getOrganiserProfile(req, res);
});

export default router;
