import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "./middlewares/auth.js";
import { limiter } from "./middlewares/rateLimiter.js";
import profiles from "./controllers/profiles.controller.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/profiles", profiles);

app.use(express.json());

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
