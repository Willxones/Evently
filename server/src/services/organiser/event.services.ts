import cuid from 'cuid';
import { Request, Response } from 'express';
import { z } from 'zod';

import { pool } from '../../utils/connections/pg.js';
import { AuthError } from '../../utils/errors/AuthError.js';

const eventSchema = z.object({
    title: z.string(),
    description: z.string(),
    location: z.string(),
    date: z.string().datetime(),
    organiserId: z.string(),
});

async function createEvent(req: Request, res: Response) {
    try {
        console.log('Creating event', req.body);
        console.log('Authenticated user:', req.user);
        console.log('OrganiserId received:', JSON.stringify(req.body.organiserId));

        const parsed = eventSchema.safeParse(req.body);
        if (!parsed.success) {
            console.log('Schema validation failed:', parsed.error);
            return res.status(400).json({ error: 'Invalid request data', details: parsed.error });
        }

        const receivedEventData = parsed.data;
        console.log('Parsed organiserId:', JSON.stringify(receivedEventData.organiserId));

        if (!req.user?.id) {
            console.log('No authenticated user found');
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!receivedEventData.organiserId || receivedEventData.organiserId.trim() === '') {
            console.log('Empty organiserId provided');
            return res.status(400).json({ error: 'Organiser ID is required and cannot be empty' });
        }

        const organiserCheck = await pool.query(
            'SELECT id FROM public.organiser_profile WHERE id = $1 AND user_id = $2',
            [receivedEventData.organiserId, req.user.id]
        );

        if (organiserCheck.rows.length === 0) {
            console.log('Organiser profile not found or unauthorized');
            return res.status(403).json({ 
                error: 'Unauthorized: Invalid organiser ID or organiser profile does not belong to authenticated user' 
            });
        }

        const id = cuid();
        const newEvent = await pool.query(
            'INSERT INTO public.event (id, title, description, location, date, organiser_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [
                id,
                receivedEventData.title,
                receivedEventData.description,
                receivedEventData.location,
                receivedEventData.date,
                receivedEventData.organiserId,
            ]
        );

        console.log('Event created successfully:', newEvent.rows[0]);
        return res.status(201).json(newEvent.rows[0]);
    } catch (error) {
        console.error('Error creating event:', error);
        return res.status(500).json({ error: 'Failed to create event' });
    }
}

async function getEvents(req: Request, res: Response){
    try {
        const events = await pool.query('SELECT * FROM public.event');
        return res.status(200).json(events.rows);
    } catch (error) {
        console.error('Error fetching events:', error);
        return res.status(500).json({ error: 'Failed to fetch events' });
    }
}

async function getEventsByOrganiserId(req: Request, res: Response) {
    try {
        const { organiserId } = req.params;
        const events = await pool.query('SELECT * FROM public.event WHERE organiser_id = $1', [organiserId]);
        return res.status(200).json(events.rows);
    } catch (error) {
        console.error('Error fetching events by organiser ID:', error);
        return res.status(500).json({ error: 'Failed to fetch events by organiser ID' });
    }
}

async function deleteEvent(req: Request, res: Response) {
    try {
        const { eventId } = req.params;
        const result = await pool.query('DELETE FROM public.event WHERE id = $1 RETURNING *', [eventId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        return res.status(200).json({ message: 'Event deleted successfully', event: result.rows[0] });
    } catch (error) {
        console.error('Error deleting event:', error);
        return res.status(500).json({ error: 'Failed to delete event' });
    }
}

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

        return res.status(200).json({ message: 'Event updated successfully', event: result.rows[0] });
    } catch (error) {
        console.error('Error updating event:', error);
        return res.status(500).json({ error: 'Failed to update event' });
    }
}


export { createEvent, getEvents, getEventsByOrganiserId, deleteEvent, updateEvent };