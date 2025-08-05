import cuid from 'cuid';
import { Request, Response } from 'express';
import { z } from 'zod';

import { pool } from '../../utils/connections/pg.js';
import { AuthError } from '../../utils/errors/AuthError.js';
import snakeToCamel from '../../utils/helpers/snakeToCamel.js';

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

        if (!req.user?.id) {
            console.error('User not authenticated');
            return res.status(401).json({ error: 'Authentication required' });
        }

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
            [receivedTicketData.eventId, req.user.id]
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
        //postgres error codes
        // 23505: unique violation
        // 23503: foreign key violation
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Ticket type already exists' });
        }
        if (error.code === '23503') {
            return res.status(400).json({ error: 'Invalid event ID' });
        }

        return res.status(500).json({ error: 'Failed to create ticket type' });
    }
}

async function getTicketTypesByEventId(req: Request, res: Response) {
    try {
        const { eventId } = req.params;

        if (!req.user?.id) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const eventCheck = await pool.query(
            `
            SELECT event.id 
            FROM public.event event
            JOIN public.organiser_profile organiser_profile ON event.organiser_id = organiser_profile.id
            WHERE event.id = $1 AND organiser_profile.user_id = $2
        `,
            [eventId, req.user.id]
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

async function deleteTicketType(req: Request, res: Response) {
    try {
        const { ticketId } = req.params;

        if (!req.user?.id) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const ticketCheck = await pool.query(
            `
            SELECT ticket_type.id 
            FROM public.ticket_type ticket_type
            JOIN public.event event ON ticket_type.event_id = event.id
            JOIN public.organiser_profile organiser_profile ON event.organiser_id = organiser_profile.id
            WHERE ticket_type.id = $1 AND organiser_profile.user_id = $2
        `,
            [ticketId, req.user.id]
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

export { createTicketType, getTicketTypesByEventId, deleteTicketType, updateTicketType };