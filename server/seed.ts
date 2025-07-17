import dotenv from "dotenv";
dotenv.config();

import { db } from "./db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

async function seed() {
  try {
    console.log("🌱 Seeding demo users...");

    const existingAdmin = await db.select().from(users).where(eq(users.username, "admin"));
    const existingDemo = await db.select().from(users).where(eq(users.username, "demo"));

    const hashedAdmin = await bcrypt.hash("admin123", 10);
    const hashedDemo = await bcrypt.hash("demo123", 10);

    if (existingAdmin.length === 0) {
      await db.insert(users).values({
        username: "admin",
        password: hashedAdmin,
      });
      console.log("✅ Admin user created");
    } else {
      console.log("ℹ️ Admin user already exists");
    }

    if (existingDemo.length === 0) {
      await db.insert(users).values({
        username: "demo",
        password: hashedDemo,
      });
      console.log("✅ Demo user created");
    } else {
      console.log("ℹ️ Demo user already exists");
    }
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();
