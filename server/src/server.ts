import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "./middlewares/auth.js";
import {limiter} from '../src/middlewares/rateLimiter.js'

const app = express(); 
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
	res.send("Welcome to Evently!");
});

app.get("/authed", authenticateToken, (req, res) => {
	res.send("Welcome to Authed Evently!");
});

app.get("/highRequestTest", limiter, (req, res) => {
	res.send("You are still within the request limit!");
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
