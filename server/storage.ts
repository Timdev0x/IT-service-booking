import { users, clients, bookings, type User, type InsertUser, type Client, type InsertClient, type Booking, type InsertBooking, type UpdateBooking, type BookingWithClient } from "@shared/schema";
import { db } from "./db";
import { eq, desc, count } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Client methods
  getClient(id: number): Promise<Client | undefined>;
  getClientByEmail(email: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  getAllClients(): Promise<Client[]>;
  
  // Booking methods
  getBooking(id: number): Promise<BookingWithClient | undefined>;
  getBookingByBookingId(bookingId: string): Promise<BookingWithClient | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, updates: UpdateBooking): Promise<Booking | undefined>;
  deleteBooking(id: number): Promise<boolean>;
  getAllBookings(): Promise<BookingWithClient[]>;
  getBookingsByStatus(status: string): Promise<BookingWithClient[]>;
  
  // Analytics
  getBookingAnalytics(): Promise<{
    totalBookings: number;
    pendingBookings: number;
    completedBookings: number;
    activeClients: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.email, email));
    return client || undefined;
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const [client] = await db
      .insert(clients)
      .values(insertClient)
      .returning();
    return client;
  }

  async getAllClients(): Promise<Client[]> {
    return await db.select().from(clients).orderBy(desc(clients.createdAt));
  }

  async getBooking(id: number): Promise<BookingWithClient | undefined> {
    const [booking] = await db
      .select()
      .from(bookings)
      .leftJoin(clients, eq(bookings.clientId, clients.id))
      .where(eq(bookings.id, id));
    
    if (!booking || !booking.clients) return undefined;
    
    return {
      ...booking.bookings,
      client: booking.clients
    };
  }

  async getBookingByBookingId(bookingId: string): Promise<BookingWithClient | undefined> {
    const [booking] = await db
      .select()
      .from(bookings)
      .leftJoin(clients, eq(bookings.clientId, clients.id))
      .where(eq(bookings.bookingId, bookingId));
    
    if (!booking || !booking.clients) return undefined;
    
    return {
      ...booking.bookings,
      client: booking.clients
    };
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const bookingId = `BK-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    
    const [booking] = await db
      .insert(bookings)
      .values({
        ...insertBooking,
        bookingId,
      })
      .returning();
    return booking;
  }

  async updateBooking(id: number, updates: UpdateBooking): Promise<Booking | undefined> {
    const [booking] = await db
      .update(bookings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return booking || undefined;
  }

  async deleteBooking(id: number): Promise<boolean> {
    const result = await db.delete(bookings).where(eq(bookings.id, id));
    return result.rowCount > 0;
  }

  async getAllBookings(): Promise<BookingWithClient[]> {
    const results = await db
      .select()
      .from(bookings)
      .leftJoin(clients, eq(bookings.clientId, clients.id))
      .orderBy(desc(bookings.createdAt));
    
    return results.map(result => ({
      ...result.bookings,
      client: result.clients!
    }));
  }

  async getBookingsByStatus(status: string): Promise<BookingWithClient[]> {
    const results = await db
      .select()
      .from(bookings)
      .leftJoin(clients, eq(bookings.clientId, clients.id))
      .where(eq(bookings.status, status))
      .orderBy(desc(bookings.createdAt));
    
    return results.map(result => ({
      ...result.bookings,
      client: result.clients!
    }));
  }

  async getBookingAnalytics(): Promise<{
    totalBookings: number;
    pendingBookings: number;
    completedBookings: number;
    activeClients: number;
  }> {
    const [totalBookings] = await db.select({ count: count() }).from(bookings);
    const [pendingBookings] = await db.select({ count: count() }).from(bookings).where(eq(bookings.status, "pending"));
    const [completedBookings] = await db.select({ count: count() }).from(bookings).where(eq(bookings.status, "completed"));
    const [activeClients] = await db.select({ count: count() }).from(clients);

    return {
      totalBookings: totalBookings.count,
      pendingBookings: pendingBookings.count,
      completedBookings: completedBookings.count,
      activeClients: activeClients.count,
    };
  }
}

export const storage = new DatabaseStorage();
