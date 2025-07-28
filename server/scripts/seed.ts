import mongoose from "mongoose";
import dotenv from "dotenv";
import Booking from "../models/Booking"; // Assuming you have a Booking model

dotenv.config();

mongoose
  .connect(process.env.DATABASE_URL!)
  .then(async () => {
    console.log("Connected to MongoDB");

    const demoBookings = [
      {
        fullName: "Jane Doe",
        email: "jane@example.com",
        phone: "0712345678",
        preferredDate: "2025-08-01",
        service: "Consultancy",
        additionalInfo: "Needs help with compliance tools",
      },
      {
        fullName: "John Mwangi",
        email: "john@ais.com",
        phone: "0789123456",
        preferredDate: "2025-08-04",
        service: "Cybersecurity",
        additionalInfo: "Requesting audit for fintech platform",
      },
    ];

    await Booking.insertMany(demoBookings);
    console.log("✅ Demo bookings seeded");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Seeding error:", err.message);
    process.exit(1);
  });
