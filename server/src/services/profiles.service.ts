import { Profile } from "@prisma/client";
import { prisma } from "../utils/prisma.js";
import { Request, Response } from "express";

export async function createProfile(req: Request, res: Response) {
	try {
		const {
			firstName,
			lastName,
			location,
			bio,
			image,
			interests,
			linkedIn,
			github,
			twitter,
			website,
		} = req.body;
		const userId = req.user?.id;
		if (
			!firstName ||
			!lastName ||
			!location ||
			!bio ||
			!image ||
			!interests ||
			!userId
		) {
			return res
				.status(400)
				.json({ error: "All required fields have not been provided" });
		}

		const profile: Profile = await prisma.profile.create({
			data: {
				firstName,
				lastName,
				location,
				bio,
				image,
				interests,
				linkedIn,
				github,
				twitter,
				website,
				userId,
			},
		});
		return res.status(201).json(profile);
	} catch (error) {
		console.error("Error creating profile:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
}

export async function updateProfile(req: Request, res: Response) {
	try {
		const updatedProfile = await prisma.profile.update({
			where: {
				userId: req.user?.id,
			},
			data: {
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				location: req.body.location,
				bio: req.body.bio,
				image: req.body.image,
				interests: req.body.interests,
				linkedIn: req.body.linkedIn,
				github: req.body.github,
				twitter: req.body.twitter,
				website: req.body.website,
			},
		});

		if (!updatedProfile) {
			return res.status(404).json({ error: "Profile not found" });
		}

		return res.status(200).json(updatedProfile);
	} catch (error) {
		console.error("Error updating profile:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
}

export async function getProfileByUser(req: Request, res: Response) {
	try {
		const userId = req.user?.id;

		if (!userId) {
			return res.status(400).json({ error: "userId is required" });
		}

		const profile: Profile | null = await prisma.profile.findUnique({
			where: {
				userId: userId,
			},
		});

		if (!profile) {
			return res.status(404).json({ error: "Profile not found" });
		}

		return res.status(200).json(profile);
	} catch (error) {
		console.error("Error fetching profile:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
}
