import cors from 'cors';
import express, { Request, Response } from 'express';

import { authenticateToken } from '../../middlewares/shared/auth.js';
import { createOrganiserProfile, getOrganiserProfile } from '../../services/organiser/organiserProfile.service.js';
import { createEvent, getEvents, getEventsByOrganiserId } from '../../services/organiser/event.services.js';

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

router.post('/create-event', authenticateToken, async (req: Request, res: Response) => {
    await createEvent(req, res);
});

router.get('/get-events', authenticateToken, async (req: Request, res: Response) => {
    await getEvents(req, res);
});

router.get('/get-events/:organiserId', authenticateToken, async (req: Request, res: Response) => {
    await getEventsByOrganiserId(req, res);
});


export default router;
