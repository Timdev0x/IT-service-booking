// server/routes/login.ts
import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User";

const router = express.Router();

router.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  res.status(200).json({ message: "Login successful", role: user.role });
});

export default router;
