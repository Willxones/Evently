import cors from 'cors';
import express, { Request, Response } from 'express';

import { authenticateToken } from '../../middlewares/shared/auth.js';
import { createTicketType } from '../../services/organiser/ticket-type/createTicketType.service.js';
import { deleteTicketType } from '../../services/organiser/ticket-type/deleteTicketType.service.js';
import { getTicketTypesByEventId } from '../../services/organiser/ticket-type/getTicketType.service.js';
import { updateTicketType } from '../../services/organiser/ticket-type/updateTicketType.service.js';

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
router.get('/get-ticket-types/:eventId', authenticateToken, async (req: Request, res: Response) => {
    await getTicketTypesByEventId(req, res);
});
router.put(
    '/update-ticket-type/:ticketId',
    authenticateToken,
    async (req: Request, res: Response) => {
        await updateTicketType(req, res);
    }
);
router.delete(
    '/delete-ticket-type/:ticketId',
    authenticateToken,
    async (req: Request, res: Response) => {
        await deleteTicketType(req, res);
    }
);

export default router;
