import cuid from 'cuid';
import { Request, Response } from 'express';
import { z } from 'zod';

import { pool } from '../../../utils/connections/pg.js';
import snakeToCamel from '../../../utils/helpers/snakeToCamel.js';

const ticketTypeSchema = z.object({
    eventId: z.string(),
    name: z.string().min(2).max(100),
    price: z.number().min(0),
    quantity: z.number().min(1),
});

async function createTicketType(req: Request, res: Response) {
    try {
        console.log('Creating ticket type with data:', req.body);
        console.log('User:', req.user);

        const parsed = ticketTypeSchema.safeParse(req.body);
        if (!parsed.success) {
            console.error('Validation failed:', parsed.error);
            return res.status(400).json({
                error: 'Validation failed',
                details: parsed.error.errors,
            });
        }

        const receivedTicketData = parsed.data;

        const eventCheck = await pool.query(
            `
            SELECT event.id, event.organiser_id 
            FROM public.event event
            JOIN public.organiser_profile organiser_profile ON event.organiser_id = organiser_profile.id
            WHERE event.id = $1 AND organiser_profile.user_id = $2
        `,
            [receivedTicketData.eventId, req.user!.id]
        );

        if (eventCheck.rows.length === 0) {
            console.error('Event not found or not owned by user');
            return res.status(404).json({ error: 'Event not found or access denied' });
        }

        const id = cuid();

        const newTicketType = await pool.query(
            'INSERT INTO public.ticket_type (id, event_id, name, price, quantity) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [
                id,
                receivedTicketData.eventId,
                receivedTicketData.name,
                receivedTicketData.price,
                receivedTicketData.quantity,
            ]
        );

        console.log('Created new ticket type:', newTicketType.rows[0]);
        return res.status(201).json(snakeToCamel(newTicketType.rows[0]));
    } catch (error: any) {
        console.error('Error creating ticket type:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Ticket type already exists' });
        }
        if (error.code === '23503') {
            return res.status(400).json({ error: 'Invalid event ID' });
        }

        return res.status(500).json({ error: 'Failed to create ticket type' });
    }
}
export { createTicketType };
