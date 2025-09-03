import { Request, Response } from 'express';

import { pool } from '../../../utils/connections/pg.js';

async function updateEvent(req: Request, res: Response) {
    try {
        const { eventId } = req.params;
        const updatedData = req.body;

        const result = await pool.query(
            'UPDATE public.event SET title = $1, description = $2, location = $3, date = $4 WHERE id = $5 RETURNING *',
            [
                updatedData.title,
                updatedData.description,
                updatedData.location,
                updatedData.date,
                eventId,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        return res
            .status(200)
            .json({ message: 'Event updated successfully', event: result.rows[0] });
    } catch (error) {
        console.error('Error updating event:', error);
        return res.status(500).json({ error: 'Failed to update event' });
    }
}
export { updateEvent };
