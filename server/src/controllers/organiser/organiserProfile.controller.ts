import express, { Request, Response } from 'express';

import { authenticateToken } from '../../middlewares/shared/auth.js';
import {
    createOrganiserProfile,
    getOrganiserProfile,
} from '../../services/organiser/organiserProfile.service.js';

const router = express.Router();

router.use(express.json());

// POST route to create an organiser profile
router.post('/create-organiser-profile', authenticateToken, async (req: Request, res: Response) => {
    await createOrganiserProfile(req, res);
});

// GET route to fetch an organiser profile by user ID
router.get('/get-organiser-profile', authenticateToken, async (req: Request, res: Response) => {
    await getOrganiserProfile(req, res);
});

export default router;