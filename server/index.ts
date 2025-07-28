import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import mongoose from "mongoose";
import dotenv from "dotenv";
import MongoStore from "connect-mongo"; // ✅ Replaced memorystore for ESM compatibility
import { registerRoutes } from "./registerRoutes";

dotenv.config(); // 🌱 Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;
const mongoURI = process.env.DATABASE_URL;

// 🚨 Validate MongoDB URI format
if (!mongoURI || (!mongoURI.startsWith("mongodb://") && !mongoURI.startsWith("mongodb+srv://"))) {
  console.error("❌ Invalid DATABASE_URL format. It must start with 'mongodb://' or 'mongodb+srv://'");
  process.exit(1);
}

// ✅ Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// 🔐 Session setup using MongoDB store (ESM-safe)
app.use(session({
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: mongoURI,
    ttl: 86400 // 1 day in seconds
  }),
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
  }
}));

// 🔑 Auth endpoints
app.post("/api/login", (req, res) => {
  req.session.user = {
    name: "Admin",
    role: "admin",
    isAdmin: true
  };
  res.json({ message: "Login successful", user: req.session.user });
});

app.get("/api/auth/check", (req, res) => {
  res.json({
    isAuthenticated: !!req.session?.user?.isAdmin,
    user: req.session?.user || null
  });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logout successful" });
  });
});

// 📦 Load all custom routes
registerRoutes(app);

// 🛠️ Connect to MongoDB and launch server
mongoose.connect(mongoURI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
