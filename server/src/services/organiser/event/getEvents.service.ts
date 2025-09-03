import { Request, Response } from 'express';

import { pool } from '../../../utils/connections/pg.js';

async function getAllEvents(req: Request, res: Response) {
    try {
        const events = await pool.query('SELECT * FROM public.event');
        return res.status(200).json(events.rows);
    } catch (error) {
        console.error('Error fetching events:', error);
        return res.status(500).json({ error: 'Failed to fetch events' });
    }
}

async function getEventById(req: Request, res: Response) {
    try {
        const { eventId } = req.params;
        const events = await pool.query('SELECT * FROM public.event WHERE id = $1', [eventId]);
        return res.status(200).json(events.rows);
    } catch (error) {
        console.error('Error fetching events:', error);
        return res.status(500).json({ error: 'Failed to fetch events' });
    }
}

async function getEventsByOrganiserId(req: Request, res: Response) {
    try {
        const { organiserId } = req.params;
        const events = await pool.query('SELECT * FROM public.event WHERE organiser_id = $1', [
            organiserId,
        ]);
        return res.status(200).json(events.rows);
    } catch (error) {
        console.error('Error fetching events by organiser ID:', error);
        return res.status(500).json({ error: 'Failed to fetch events by organiser ID' });
    }
}
export { getAllEvents, getEventById, getEventsByOrganiserId };
