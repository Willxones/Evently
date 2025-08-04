import cors from 'cors';
import express, { Request, Response } from 'express';
import { createTicketType } from '../../services/organiser/ticketType.services.js';

import { authenticateToken } from '../../middlewares/shared/auth.js';

const router = express.Router();

router.use(express.json());
router.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
        allowedHeaders: ['Content-Type', 'authorization'],
    })
);
router.post('/create-ticket-type', authenticateToken, async (req: Request, res: Response) => {
    await createTicketType(req, res);
});