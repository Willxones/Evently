import cors from 'cors';
import express, { Request, Response } from 'express';

import { authenticateToken } from '../../middlewares/shared/auth.js';
import {
    createEvent,
    getEvents,
    getEventsByOrganiserId,
    deleteEvent,
    updateEvent,
    getEventByEventId,
} from '../../services/organiser/event.services.js';

const router = express.Router();

router.use(express.json());
router.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
        allowedHeaders: ['Content-Type', 'authorization'],
    })
);

router.post('/create-event', authenticateToken, async (req: Request, res: Response) => {
    await createEvent(req, res);
});

router.get('/get-event/:eventId', authenticateToken, async (req: Request, res: Response) => {
    await getEventByEventId(req, res);
});

router.get('/get-events', authenticateToken, async (req: Request, res: Response) => {
    await getEvents(req, res);
});

router.get('/get-events/:organiserId', authenticateToken, async (req: Request, res: Response) => {
    await getEventsByOrganiserId(req, res);
});
router.delete('/delete-event/:eventId', authenticateToken, async (req: Request, res: Response) => {
    await deleteEvent(req, res);
});
router.put('/update-event/:eventId', authenticateToken, async (req: Request, res: Response) => {
    await updateEvent(req, res);
});

export default router;