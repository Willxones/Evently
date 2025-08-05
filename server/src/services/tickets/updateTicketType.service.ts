import { Request, Response } from 'express';
import { z } from 'zod';
import { pool } from '../../utils/connections/pg.js';
import snakeToCamel from '../../utils/helpers/snakeToCamel.js';

async function updateTicketType(req: Request, res: Response) {
    try {
        const { ticketId } = req.params;

        if (!req.user?.id) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const updateSchema = z.object({
            name: z.string().min(2).max(100),
            price: z.number().min(0),
            quantity: z.number().min(1),
        });

        const parsed = updateSchema.safeParse(req.body);
        if (!parsed.success) {
            console.error('Validation failed:', parsed.error);
            return res.status(400).json({
                error: 'Validation failed',
                details: parsed.error.errors,
            });
        }

        const updatedTicket = parsed.data;
        const ticketCheck = await pool.query(
            `
            SELECT ticket.id 
            FROM public.ticket_type ticket
            JOIN public.event event ON ticket.event_id = event.id
            JOIN public.organiser_profile organiser_profile ON event.organiser_id = organiser_profile.id
            WHERE ticket.id = $1 AND organiser_profile.user_id = $2
        `,
            [ticketId, req.user.id]
        );

        if (ticketCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Ticket type not found or access denied' });
        }

        const result = await pool.query(
            'UPDATE public.ticket_type SET name = $1, price = $2, quantity = $3 WHERE id = $4 RETURNING *',
            [updatedTicket.name, updatedTicket.price, updatedTicket.quantity, ticketId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ticket type not found' });
        }

        return res.status(200).json({
            message: 'Ticket type updated successfully',
            ticket: snakeToCamel(result.rows[0]),
        });
    } catch (error) {
        console.error('Error updating ticket:', error);
        return res.status(500).json({ error: 'Failed to update ticket type' });
    }
}
export { updateTicketType };