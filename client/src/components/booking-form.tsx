import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const bookingSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  preferredDate: z.string().min(1, "Preferred date is required"),
  service: z.string().min(1, "Please select a service"),
  additionalInfo: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function BookingForm() {
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const { toast } = useToast();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      preferredDate: "",
      service: "",
      additionalInfo: "",
    },
  });

  const createBooking = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const res = await apiRequest("POST", "/api/bookings", data);
      const result = await res.json();

      if (!res.ok || !result?.booking?.bookingId) {
        throw new Error(result?.message || "Booking failed");
      }

      return result;
    },
    onSuccess: (data) => {
      setBookingId(data.booking.bookingId);
      setBookingConfirmed(true);
      form.reset();
      toast({
        title: "Booking Confirmed!",
        description: "Your booking has been successfully submitted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error?.message || "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingFormData) => {
    createBooking.mutate(data);
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardTitle>Book a Service</CardTitle>
        <p className="text-sm text-blue-100">Fill out the form below to request your appointment</p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input {...form.register("fullName")} placeholder="Jane Doe" />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input {...form.register("email")} type="email" placeholder="jane@example.com" />
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input {...form.register("phone")} placeholder="+254..." />
          </div>

          {/* Preferred Date */}
          <div>
            <Label htmlFor="preferredDate">Preferred Date</Label>
            <Input {...form.register("preferredDate")} type="date" />
          </div>

          {/* Service */}
          <div>
  <Label htmlFor="service">Service</Label>
  <select {...form.register("service")} className="w-full border rounded-md p-2">
    <option value="">Select a service</option>
    <option value="Software Development">Software Development</option>
    <option value="Ecommerce Store Design">Ecommerce Store Design</option>
    <option value="IT Training">IT Training</option>
    <option value="Networking and Maintenance">Networking and Maintenance</option>
    <option value="IT Consultancy">IT Consultancy</option>
  </select>
</div>

          {/* Additional Info */}
          <div>
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea {...form.register("additionalInfo")} placeholder="Your notes or questions…" />
          </div>

          {/* Submit Button */}
          <Button disabled={createBooking.isPending} type="submit" className="w-full">
            {createBooking.isPending ? "Submitting..." : "Confirm Booking"}
          </Button>
        </form>

        {/* Confirmation Display */}
        {bookingConfirmed && (
          <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-md">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="text-green-600 h-5 w-5" />
              <span className="font-semibold text-green-700">Booking Successful</span>
            </div>
            <p className="text-sm text-gray-800">Your booking ID:</p>
            <Badge variant="secondary" className="mt-2 font-mono">{bookingId}</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );


}
