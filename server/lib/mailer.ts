// server/lib/mailer.ts
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingEmail(booking: {
  fullName: string;
  email: string;
  phone: string;
  preferredDate: string;
  service: string;
  additionalInfo?: string;
  bookingId: string;
}) {
  try {
    await resend.emails.send({
      from: "AIS Notifications <info@ais.co.ke>",
      to: ["info@ais.co.ke"],
      subject: `📥 Booking Received: ${booking.bookingId}`,
      html: `
        <h2>New Booking Received</h2>
        <p><strong>Name:</strong> ${booking.fullName}</p>
        <p><strong>Email:</strong> ${booking.email}</p>
        <p><strong>Phone:</strong> ${booking.phone}</p>
        <p><strong>Date:</strong> ${booking.preferredDate}</p>
        <p><strong>Service:</strong> ${booking.service}</p>
        <p><strong>Additional Info:</strong> ${booking.additionalInfo || "—"}</p>
        <hr />
        <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
      `,
    });

    console.log("✅ Booking email sent to info@ais.co.ke");
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
}
