import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

export async function seedSuperAdmin() {
	try {
		
		const adminExists = await prisma.admin.findFirst();

		if (adminExists) {
			console.log("✅ Super Admin already exists, skipping...");
			return;
		}

		console.log("🚀 No admin found! Creating a Super Admin...");

		const name = process.env.SUPER_ADMIN_NAME || "Super Admin";
		const email = process.env.SUPER_ADMIN_EMAIL;
		const password = process.env.SUPER_ADMIN_PASSWORD;

		if (!email || !password) {
			console.error("❌ SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set in .env");
			return;
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		await prisma.admin.create({
			data: {
				name,
				email,
				password: hashedPassword,
				is_creator: true,
			},
		});

		console.log("✅ Super Admin created successfully!");
	} catch (error) {
		console.error("❌ Error creating Super Admin:", error);
	} finally {
		await prisma.$disconnect();
	}
}
