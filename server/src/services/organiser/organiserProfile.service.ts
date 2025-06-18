import cuid from 'cuid';
import { Request, Response } from 'express';
import { z } from 'zod';

import { pool } from '../../utils/connections/pg.js';
import { AuthError } from '../../utils/errors/AuthError.js';
import { parseZodWithAuth } from '../parseZodWithAuth.js';

const organiserProfileSchema = z.object({
    organiserName: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    description: z.string(),
    location: z.string().nullable(),
    logoImage: z.string(),
    bannerImage: z.string(),
    publicEmail: z.string().email().nullable(),
    socialLinks: z.record(z.string(), z.string()).nullable(),
    websiteUrl: z.string().nullable(),
    userId: z.string(),
});

async function createOrganiserProfile(req: Request, res: Response) {
    try {
        console.log('Creating organiser profile with data:', req.body);
        const receivedProfileData = parseZodWithAuth(
            organiserProfileSchema,
            req.body,
            req.user?.id
        );
        const id = cuid();
        const newProfile = await pool.query(
            'INSERT INTO public."organiser_profile" ("id", "organiser_name", "first_name", "last_name", "description", "location", "logo_image", "banner_image",  "public_email",  "website_url", "social_links", "user_id") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
            [
                id,
                receivedProfileData.organiserName,
                receivedProfileData.firstName,
                receivedProfileData.lastName,
                receivedProfileData.description,
                receivedProfileData.location,
                receivedProfileData.logoImage,
                receivedProfileData.bannerImage,
                receivedProfileData.publicEmail,
                receivedProfileData.websiteUrl,
                receivedProfileData.socialLinks
                    ? JSON.stringify(receivedProfileData.socialLinks)
                    : null,
                receivedProfileData.userId,
            ]
        );
        return res.status(201).json(newProfile);
    } catch (error) {
        if (error instanceof AuthError) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error('Error creating organiser profile:', error);
        return res.status(500).json({ error: 'Failed to create profile' });
    }
}

async function getOrganiserProfile(req: Request, res: Response) {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { rows } = await pool.query(
            'SELECT * FROM public."organiser_profile" WHERE "user_id" = $1 LIMIT 1',
            [userId]
        );
        const organiserProfile = rows[0];

        if (!organiserProfile) {
            return res.status(404).json({ error: 'Organiser profile not found' });
        }

        return res.status(200).json(organiserProfile);
    } catch (error) {
        console.error('Error fetching organiser profile:', error);
        return res.status(500).json({ error: 'Failed to fetch organiser profile' });
    }
}

export { createOrganiserProfile, getOrganiserProfile };
