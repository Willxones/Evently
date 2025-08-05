import { Request, Response } from 'express';

import { pool } from '../../utils/connections/pg.js';
import snakeToCamel from '../../utils/helpers/snakeToCamel.js';


async function getOrganiserProfile(req: Request, res: Response) {
    try {
        const userId = req.user?.id;

        const { rows } = await pool.query(
            'SELECT * FROM public."organiser_profile" WHERE "user_id" = $1 LIMIT 1',
            [userId]
        );
        const organiserProfile = rows[0];

        if (!organiserProfile) {
            return res.status(404).json({ error: 'Organiser profile not found' });
        }
        const camelProfile = snakeToCamel(organiserProfile);

        return res.status(200).json(camelProfile);
    } catch (error) {
        console.error('Error fetching organiser profile:', error);
        return res.status(500).json({ error: 'Failed to fetch organiser profile' });
    }
}

export { getOrganiserProfile };