import express, { Request, Response } from "express";
import { authenticateToken } from "../middlewares/auth.js";
import {
	createProfile,
	getProfileByUser,
	updateProfile,
} from "../services/profiles.service.js";

const router = express.Router();

router.use(express.json());

router.post("/", authenticateToken, (req: Request, res: Response) => {
	createProfile(req, res);
});

router.patch("/", authenticateToken, (req: Request, res: Response) => {
	updateProfile(req, res);
});

router.get("/", authenticateToken, (req: Request, res: Response) => {
	getProfileByUser(req, res);
});

export default router;
