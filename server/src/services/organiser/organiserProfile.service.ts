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
        } = req.body;

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
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized 1' });
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
                socials: socials || null,
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

async function getOrganiserProfile(req: Request, res: Response) {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const organiserProfile = await prisma.organiserProfile.findUnique({
            where: { userId },
        });

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