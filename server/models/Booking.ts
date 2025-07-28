import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  preferredDate: { type: String },
  service: { type: String, required: true },
  additionalInfo: { type: String },
}, {
  timestamps: true,
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
