import { Request, Response } from "express";
import { Booking } from "../models/booking";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const newBooking = await Booking.create(req.body);
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ message: "Failed to create booking", error: err });
  }
};

export const getBookings = async (_req: Request, res: Response) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings", error: err });
  }
};
