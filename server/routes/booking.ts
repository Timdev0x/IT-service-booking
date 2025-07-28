import express from "express";
import { sendBookingEmail } from "../lib/mailer";
import Booking from "../models/Booking";
import { nanoid } from "nanoid";

const router = express.Router();

router.post("/bookings", async (req, res) => {
  const { fullName, email, phone, preferredDate, service, additionalInfo } = req.body;

  if (!fullName || !email || !service) {
    return res.status(400).json({ message: "Missing required booking fields." });
  }

  const bookingId = nanoid();

  try {
    const newBooking = new Booking({
      fullName,
      email,
      phone,
      preferredDate,
      service,
      additionalInfo,
    });

    await newBooking.save();
    await sendBookingEmail({ fullName, email, phone, preferredDate, service, additionalInfo, bookingId });

    res.status(200).json({
      message: "Booking created successfully",
      booking: { bookingId },
    });
  } catch (error: any) {
    console.error("❌ Booking failed:", error.message);
    res.status(500).json({ message: "Failed to create booking", error: error.message });
  }
});

export default router;
