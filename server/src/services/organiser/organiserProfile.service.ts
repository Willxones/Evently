import { OrganiserProfile } from '@prisma/client';
import { Request, Response } from 'express';

import { prisma } from '../../utils/prisma.js';

async function createOrganiserProfile(req: Request, res: Response) {
    console.log(req.body);
    try {
        const {
            firstName,
            lastName,
            location,
            orgName,
            logoImage,
            bannerImage,
            description,
            displayEmail,
            socials,
            website,
            userId,
        }: OrganiserProfile = req.body;

        if (
            !firstName ||
            !lastName ||
            !orgName ||
            !logoImage ||
            !bannerImage ||
            !description ||
            !displayEmail
        ) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const actualUserId = req.user?.id;
        if (!actualUserId || actualUserId !== userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const newProfile: OrganiserProfile = await prisma.organiserProfile.create({
            data: {
                firstName: firstName,
                lastName: lastName,
                location: location || null,
                orgName: orgName,
                logoImage: logoImage,
                bannerImage: bannerImage,
                description: description || '',
                displayEmail: displayEmail,
                socials: socials || {},
                website: website || null,
                userId: userId,
            },
        });
        return res.status(201).json(newProfile);
    } catch (error) {
        console.error('Error creating organiser profile:', error);
        return res.status(500).json({ error: 'Failed to create profile' });
    }
}

export { createOrganiserProfile };
