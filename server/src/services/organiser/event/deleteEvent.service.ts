import { Request, Response } from 'express';

import { pool } from '../../../utils/connections/pg.js';

async function deleteEvent(req: Request, res: Response) {
    try {
        const { eventId } = req.params;
        const result = await pool.query('DELETE FROM public.event WHERE id = $1 RETURNING *', [
            eventId,
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        return res
            .status(200)
            .json({ message: 'Event deleted successfully', event: result.rows[0] });
    } catch (error) {
        console.error('Error deleting event:', error);
        return res.status(500).json({ error: 'Failed to delete event' });
    }
}
export { deleteEvent };
