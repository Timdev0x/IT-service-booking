import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertClientSchema, insertBookingSchema, updateBookingSchema } from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import bcrypt from "bcrypt";
import MemoryStore from "memorystore";

const bookingFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  preferredDate: z.string().min(1, "Preferred date is required"),
  service: z.string().min(1, "Service selection is required"),
  additionalInfo: z.string().optional(),
});

// Extend session type
declare module 'express-session' {
  interface SessionData {
    isAdmin: boolean;
    userId: number;
  }
}

// Middleware for checking admin authentication
const requireAuth = (req: any, res: any, next: any) => {
  if (req.session?.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  const MemoryStoreConstructor = MemoryStore(session);
  app.use(session({
    secret: process.env.SESSION_SECRET || "your-secret-key-here",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStoreConstructor({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Create default admin user if it doesn't exist
  const initializeAdmin = async () => {
    try {
      const existingAdmin = await storage.getUserByUsername("admin");
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash("admin", 10);
        await storage.createUser({
          username: "admin",
          password: hashedPassword,
        });
        console.log("Default admin user created (username: admin, password: admin)");
      }
    } catch (error) {
      console.error("Error initializing admin user:", error);
    }
  };
  
  await initializeAdmin();

  // Authentication routes
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      req.session.isAdmin = true;
      req.session.userId = user.id;
      res.json({ message: "Login successful", user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/check", (req, res) => {
    if (req.session?.isAdmin) {
      res.json({ isAuthenticated: true, userId: req.session.userId });
    } else {
      res.json({ isAuthenticated: false });
    }
  });
  // Create a new booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = bookingFormSchema.parse(req.body);
      
      // Check if client exists, if not create one
      let client = await storage.getClientByEmail(validatedData.email);
      if (!client) {
        client = await storage.createClient({
          fullName: validatedData.fullName,
          email: validatedData.email,
          phone: validatedData.phone,
        });
      }
      
      // Create booking
      const booking = await storage.createBooking({
        clientId: client.id,
        service: validatedData.service,
        preferredDate: validatedData.preferredDate,
        additionalInfo: validatedData.additionalInfo,
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

  // Get all bookings (admin only)
  app.get("/api/bookings", requireAuth, async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Get booking by ID
  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const booking = await storage.getBooking(id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch booking" });
    }
  });

  // Update booking status (admin only)
  app.patch("/api/bookings/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateBookingSchema.parse(req.body);
      
      const booking = await storage.updateBooking(id, validatedData);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update booking" });
      }
    }
  });

  // Delete booking (admin only)
  app.delete("/api/bookings/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBooking(id);
      if (!success) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json({ message: "Booking deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete booking" });
    }
  });

  // Get all clients (admin only)
  app.get("/api/clients", requireAuth, async (req, res) => {
    try {
      const clients = await storage.getAllClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  // Get analytics (admin only)
  app.get("/api/analytics", requireAuth, async (req, res) => {
    try {
      const analytics = await storage.getBookingAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
