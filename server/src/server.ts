import express from "express";
import { PrismaClient } from "@prisma/client";
import type { Database } from "../src/database.types.ts"; // Adjust this based on where your file is

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

type Example = Database["public"]["Tables"]["Example"]["Row"];

async function main() {
	const postedExample = await prisma.example.create({
		data: {
			title: "Test",
		},
	});
	//change to reference a table in your schema
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

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
