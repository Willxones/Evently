import { Request, Response } from 'express';

import { pool } from '../../../utils/connections/pg.js';
import snakeToCamel from '../../../utils/helpers/snakeToCamel.js';

async function getTicketTypesByEventId(req: Request, res: Response) {
    try {
        const { eventId } = req.params;

        const eventCheck = await pool.query(
            `
            SELECT event.id 
            FROM public.event event
            JOIN public.organiser_profile organiser_profile ON event.organiser_id = organiser_profile.id
            WHERE event.id = $1 AND organiser_profile.user_id = $2
        `,
            [eventId, req.user!.id]
        );

        if (eventCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found or access denied' });
        }

        const ticketTypes = await pool.query(
            'SELECT * FROM public.ticket_type WHERE event_id = $1',
            [eventId]
        );

        return res.status(200).json(snakeToCamel(ticketTypes.rows));
    } catch (error) {
        console.error('Error fetching ticket types:', error);
        return res.status(500).json({ error: 'Failed to fetch ticket types' });
    }
}
export { getTicketTypesByEventId };
