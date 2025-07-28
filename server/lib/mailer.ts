import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface BookingDetails {
  fullName: string;
  email: string;
  phone: string;
  preferredDate: string;
  service: string;
  additionalInfo: string;
  bookingId: string;
}

export async function sendBookingEmail(details: BookingDetails) {
  console.log("📨 STEP A: Preparing email for booking:", details.bookingId);

  const msg = {
    to: process.env.ADMIN_EMAIL!,
    from: process.env.ADMIN_EMAIL!,
    subject: `🔔 New Booking from ${details.fullName} [${details.bookingId}]`,
    html: `
      <h2>New Booking Received</h2>
      <p><strong>Name:</strong> ${details.fullName}</p>
      <p><strong>Email:</strong> ${details.email}</p>
      <p><strong>Phone:</strong> ${details.phone}</p>
      <p><strong>Preferred Date:</strong> ${details.preferredDate}</p>
      <p><strong>Service:</strong> ${details.service}</p>
      <p><strong>Additional Info:</strong> ${details.additionalInfo || "None"}</p>
    `,
  };

  try {
    console.log("📤 STEP B: Sending email via SendGrid...");
    await sgMail.send(msg);
    console.log("✅ STEP C: Email sent successfully");
  } catch (error: any) {
    console.error("❌ STEP D: SendGrid error:", error.response?.body || error.message);
    throw error;
  }
}
