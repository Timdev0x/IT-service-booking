import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  preferredDate: String,
  service: { type: String, required: true },
  additionalInfo: String,
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  assignedTo: { type: String, default: "" },
}, { timestamps: true });

export const Booking = mongoose.model("Booking", bookingSchema);
