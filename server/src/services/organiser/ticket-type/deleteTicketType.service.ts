import { Request, Response } from 'express';

import { pool } from '../../../utils/connections/pg.js';
import snakeToCamel from '../../../utils/helpers/snakeToCamel.js';

async function deleteTicketType(req: Request, res: Response) {
    try {
        const { ticketId } = req.params;

        const ticketCheck = await pool.query(
            `
            SELECT ticket_type.id 
            FROM public.ticket_type ticket_type
            JOIN public.event event ON ticket_type.event_id = event.id
            JOIN public.organiser_profile organiser_profile ON event.organiser_id = organiser_profile.id
            WHERE ticket_type.id = $1 AND organiser_profile.user_id = $2
        `,
            [ticketId, req.user!.id]
        );

        if (ticketCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Ticket type not found or access denied' });
        }

        const result = await pool.query(
            'DELETE FROM public.ticket_type WHERE id = $1 RETURNING *',
            [ticketId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ticket type not found' });
        }

        return res.status(200).json({
            message: 'Ticket type deleted successfully',
            ticket: snakeToCamel(result.rows[0]),
        });
    } catch (error) {
        console.error('Error deleting ticket type:', error);
        return res.status(500).json({ error: 'Failed to delete ticket type' });
    }
}
export { deleteTicketType };
