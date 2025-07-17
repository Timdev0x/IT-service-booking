import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

// ✅ Load .env before checking process.env
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is missing. Please set it in your .env file or deployment environment.");
}

export default defineConfig({
  out: "./migrations", // where migration SQL will be stored
  schema: "./shared/schema.ts", // your Drizzle schema file
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
