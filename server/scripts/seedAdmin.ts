import bcrypt from "bcrypt";
import { storage } from "../storage";

async function seedAdmin() {
  const existing = await storage.getUserByUsername("admin");
  if (existing) {
    console.log("✅ Admin already exists.");
    return;
  }

  const hashedPassword = await bcrypt.hash("admin", 10);
  await storage.createUser({
    username: "admin",
    password: hashedPassword,
  });

  console.log("🧪 Seeded admin: username=admin, password=admin");
}

seedAdmin().catch(console.error);
