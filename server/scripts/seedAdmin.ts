// server/scripts/seedAdmin.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { User } from "../models/User";

dotenv.config();

async function seedAdmin() {
  await mongoose.connect(process.env.DATABASE_URL as string);
  console.log("🛢️ Connected to MongoDB");

  const existingAdmin = await User.findOne({ username: "admin" });
  if (existingAdmin) {
    console.log("✅ Admin already exists.");
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash("admin", 10);
  await User.create({
    username: "admin",
    password: hashedPassword,
    role: "admin",
  });

  console.log("🧪 Seeded admin: username=admin, password=admin");
  await mongoose.disconnect();
}
seedAdmin();
