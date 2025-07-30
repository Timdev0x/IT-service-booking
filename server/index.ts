import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { sendBookingEmail } from "./lib/mailer"; // ✅ Corrected path

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.DATABASE_URL as string)
  .then(() => console.log("🛢️ STEP 0: Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ STEP 0: MongoDB Connection Error:", err));

// ✅ Booking Schema
const bookingSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  preferredDate: String,
  service: String,
  additionalInfo: String,
});

const Booking = mongoose.model("Booking", bookingSchema);

// ✅ Booking Endpoint
app.post("/api/bookings", async (req, res) => {
  console.log("📩 STEP 1: Incoming request to /api/bookings");

  try {
    console.log("📦 STEP 2: Payload received:", req.body);

    const newBooking = await Booking.create(req.body);
    console.log("🗂️ STEP 3: Booking saved to MongoDB:", newBooking);

    console.log("✉️ STEP 4: Triggering email via sendBookingEmail...");

    await sendBookingEmail({
      fullName: newBooking.fullName,
      email: newBooking.email,
      phone: newBooking.phone,
      preferredDate: newBooking.preferredDate,
      service: newBooking.service,
      additionalInfo: newBooking.additionalInfo,
      bookingId: newBooking._id.toString(),
    });

    console.log("✅ STEP 5: Email sent. Responding to client...");
    res.status(200).json({ booking: { bookingId: newBooking._id } });
  } catch (error: any) {
    console.error("❌ STEP X: Error during booking flow:", error);
    res.status(500).json({ message: "Booking failed", details: error.message });
  }
});

// ✅ Serve React Frontend
app.use(express.static(path.join(__dirname, "../dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});
