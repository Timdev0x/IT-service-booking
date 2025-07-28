import express from "express";
import { z } from "zod";
import { sendBookingEmail } from "../lib/mailer";
import { storage } from "../storage";
import { updateBookingSchema } from "@shared/schema";

const bookRoutes = express.Router();

// 🔒 Middleware for protected routes
const requireAuth = (req: any, res: any, next: any) => {
  if (req.session?.isAdmin) next();
  else res.status(401).json({ message: "Unauthorized" });
};

// 📝 Zod schema for booking form validation
const bookingFormSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  preferredDate: z.string().min(1),
  service: z.string().min(1),
  additionalInfo: z.string().optional(),
});

// 📥 Create a new booking
bookRoutes.post("/bookings", async (req, res) => {
  try {
    const validatedData = bookingFormSchema.parse(req.body);

    let client = await storage.getClientByEmail(validatedData.email);
    if (!client) {
      client = await storage.createClient({
        fullName: validatedData.fullName,
        email: validatedData.email,
        phone: validatedData.phone
      });
    }

    const booking = await storage.createBooking({
      clientId: client.id,
      service: validatedData.service,
      preferredDate: validatedData.preferredDate,
      additionalInfo: validatedData.additionalInfo
    });

    await sendBookingEmail({
      fullName: validatedData.fullName,
      email: validatedData.email,
      phone: validatedData.phone,
      preferredDate: validatedData.preferredDate,
      service: validatedData.service,
      additionalInfo: validatedData.additionalInfo,
      bookingId: booking.bookingId
    });

    res.json({ booking, client });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Validation error", errors: error.errors });
    } else {
      res.status(500).json({ message: "Failed to create booking" });
    }
  }
});

// 🔍 Fetch all bookings (admin only)
bookRoutes.get("/bookings", requireAuth, async (_req, res) => {
  try {
    const bookings = await storage.getAllBookings();
    res.json(bookings);
  } catch {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

// 🔍 Fetch a single booking
bookRoutes.get("/bookings/:id", async (req, res) => {
  try {
    const booking = await storage.getBooking(parseInt(req.params.id));
    booking
      ? res.json(booking)
      : res.status(404).json({ message: "Booking not found" });
  } catch {
    res.status(500).json({ message: "Failed to fetch booking" });
  }
});

// ✏️ Update a booking
bookRoutes.patch("/bookings/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const validatedData = updateBookingSchema.parse(req.body);
    const booking = await storage.updateBooking(id, validatedData);
    booking
      ? res.json(booking)
      : res.status(404).json({ message: "Booking not found" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Validation error", errors: error.errors });
    } else {
      res.status(500).json({ message: "Failed to update booking" });
    }
  }
});

// 🗑️ Delete a booking
bookRoutes.delete("/bookings/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteBooking(id);
    success
      ? res.json({ message: "Booking deleted" })
      : res.status(404).json({ message: "Booking not found" });
  } catch {
    res.status(500).json({ message: "Failed to delete booking" });
  }
});

// 👥 Get all clients
bookRoutes.get("/clients", requireAuth, async (_req, res) => {
  try {
    const clients = await storage.getAllClients();
    res.json(clients);
  } catch {
    res.status(500).json({ message: "Failed to fetch clients" });
  }
});

// 📊 Get analytics
bookRoutes.get("/analytics", requireAuth, async (_req, res) => {
  try {
    const analytics = await storage.getBookingAnalytics();
    res.json(analytics);
  } catch {
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
});

export default bookRoutes;
