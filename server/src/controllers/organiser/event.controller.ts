import cors from 'cors';
import express, { Request, Response } from 'express';

import { authenticateToken } from '../../middlewares/shared/auth.js';
import { createEvent } from '../../services/organiser/event/createEvent.service.js';
import { deleteEvent } from '../../services/organiser/event/deleteEvent.service.js';
import {
    getAllEvents,
    getEventsByOrganiserId,
} from '../../services/organiser/event/getEvents.service.js';
import { updateEvent } from '../../services/organiser/event/updateEvent.service.js';

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

router.get('/get-events', authenticateToken, async (req: Request, res: Response) => {
    await getAllEvents(req, res);
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
