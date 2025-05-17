import express, { Request, Response } from 'express';

import { authenticateToken } from '../../middlewares/shared/auth.js';
import {
    createProfile,
    getProfileByUser,
    updateProfile,
} from '../../services/attendee/profiles.service.js';

const router = express.Router();

router.use(express.json());

router.post('/', authenticateToken, async (req: Request, res: Response) => {
    await createProfile(req, res);
});

router.patch('/', authenticateToken, async (req: Request, res: Response) => {
    await updateProfile(req, res);
});

router.get('/', authenticateToken, async (req: Request, res: Response) => {
    await getProfileByUser(req, res);
});

export default router;
