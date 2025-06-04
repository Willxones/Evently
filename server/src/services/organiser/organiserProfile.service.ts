import { Request, Response } from 'express';
import { z } from 'zod';

import { prisma } from '../../utils/connections/prisma.js';
import { AuthError } from '../../utils/errors/authError.js';
import { parseZodWithAuth } from '../parseZodWithAuth.js';

const organiserProfileSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    location: z.string().nullable(),
    orgName: z.string(),
    logoImage: z.string(),
    bannerImage: z.string(),
    description: z.string(),
    displayEmail: z.string().email(),
    socials: z.record(z.string(), z.string()),
    website: z.string().nullable(),
    userId: z.string(),
});

async function createOrganiserProfile(req: Request, res: Response) {
    try {
        const receivedProfileData = parseZodWithAuth(
            organiserProfileSchema,
            req.body,
            req.user?.id
        );
        const newProfile = await prisma.organiserProfile.create({
            data: { ...receivedProfileData },
        });
        return res.status(201).json(newProfile);
    } catch (error) {
        if (error instanceof AuthError) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error('Error creating organiser profile:', error);
        return res.status(500).json({ error: 'Failed to create profile' });
    }
}

export { createOrganiserProfile };
