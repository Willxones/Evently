import express, { Request, Response } from 'express';

import { authenticateToken } from '../../middlewares/shared/auth.js';
import { createOrganiserProfile } from '../../services/organiser/organiserProfile.service.js';

const router = express.Router();

router.use(express.json());
router.post('/', authenticateToken, async (req: Request, res: Response) => {
    await createOrganiserProfile(req, res);
});

export default router;
