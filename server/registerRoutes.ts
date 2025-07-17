import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import bcrypt from "bcrypt";
import MemoryStore from "memorystore";
import { z } from "zod";

import { storage } from "./storage";
import { sendBookingEmail } from "./lib/mailer";
import {
  insertClientSchema,
  insertBookingSchema,
  updateBookingSchema
} from "@shared/schema";

// Extend session type
declare module "express-session" {
  interface SessionData {
    isAdmin: boolean;
    userId: number;
  }
}

const bookingFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  preferredDate: z.string().min(1, "Preferred date is required"),
  service: z.string().min(1, "Service selection is required"),
  additionalInfo: z.string().optional(),
});

const requireAuth = (req: any, res: any, next: any) => {
  if (req.session?.isAdmin) next();
  else res.status(401).json({ message: "Unauthorized" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Session config
  const MemoryStoreConstructor = MemoryStore(session);
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "your-secret-key-here",
      resave: false,
      saveUninitialized: false,
      store: new MemoryStoreConstructor({
        checkPeriod: 86400000
      }),
      cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      }
    })
  );

  // Ensure admin user exists
  const initializeAdmin = async () => {
    try {
      const existingAdmin = await storage.getUserByUsername("admin");
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash("admin", 10);
        await storage.createUser({ username: "admin", password: hashedPassword });
        console.log("✅ Default admin created: admin/admin");
      }
    } catch (error) {
      console.error("❌ Admin init error:", error);
    }
  };

  await initializeAdmin();

  // Auth routes
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.isAdmin = true;
      req.session.userId = user.id;
      res.json({ message: "Login successful", user: { id: user.id, username } });
    } catch {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/check", (req, res) => {
    res.json({
      isAuthenticated: !!req.session?.isAdmin,
      userId: req.session?.userId || null
    });
  });

  // Booking creation
  app.post("/api/bookings", async (req, res) => {
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

  // Admin routes
  app.get("/api/bookings", requireAuth, async (_req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(parseInt(req.params.id));
      booking
        ? res.json(booking)
        : res.status(404).json({ message: "Booking not found" });
    } catch {
      res.status(500).json({ message: "Failed to fetch booking" });
    }
  });

  app.patch("/api/bookings/:id", requireAuth, async (req, res) => {
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

  app.delete("/api/bookings/:id", requireAuth, async (req, res) => {
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

  app.get("/api/clients", requireAuth, async (_req, res) => {
    try {
      const clients = await storage.getAllClients();
      res.json(clients);
    } catch {
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  app.get("/api/analytics", requireAuth, async (_req, res) => {
    try {
      const analytics = await storage.getBookingAnalytics();
      res.json(analytics);
    } catch {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
