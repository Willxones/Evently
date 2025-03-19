import express from "express";
import { PrismaClient } from "@prisma/client";
import type { Database } from "../src/database.types.ts";

import authenticateToken from './auth.js';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

import jwt from 'jsonwebtoken';

const users = [
	{
		id: 1,
		user: "Andrew",
		email: "supremeEngineer@Evently.com",
		role: "admin",
	},
	{
		id: 2,
		user: "Will",
		email: "grandWizard@Evently.com",
		role: "admin",
	},

]

type Example = Database["public"]["Tables"]["Example"]["Row"];


async function main() {

	const postedExample = await prisma.example.create({
		data: {
			title: "Test",
		},
	});
	const val: Example[] = await prisma.example.findMany({
		take: 10,
	});
	console.log(val);
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Welcome to Evently!");
});

app.get("/api/getToken", (req, res) => {
	const username = req.body.user;
	const user = {name: username};
	const secret = process.env.SUPABASE_JWT_SECRET || "default_secret";
	const accessToken = jwt.sign(user, secret);

	res.send({ accessToken: accessToken });
});

app.get("/api/secret", authenticateToken, (req, res) => {
	const message = "This is a secret route! Shhhh!";
	res.send(message);
});

app.get("/api/public", (req, res) => {
	const message = "This is a public route";
	res.send(message);
});


app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
