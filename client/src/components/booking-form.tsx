import React from "react";
import { useState } from "react";
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Calendar, CheckCircle, Lightbulb, Network, Gavel, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const bookingSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  preferredDate: z.string().min(1, "Preferred date is required"),
  service: z.string().min(1, "Service selection is required"),
  additionalInfo: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const services = [
  {
    id: "consultancy",
    name: "Consultancy",
    description: "Strategic guidance and expert advice",
    icon: Lightbulb,
    color: "text-amber-600",
  },
  {
    id: "networking",
    name: "Networking",
    description: "Network setup and optimization",
    icon: Network,
    color: "text-emerald-600",
  },
  {
    id: "computer_maintenance",
    name: "Computer Maintenance",
    description: "Hardware and software maintenance",
    icon: Gavel,
    color: "text-blue-600",
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    description: "Security assessment and protection",
    icon: Shield,
    color: "text-red-600",
  },
];

export default function BookingForm() {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState<string>("");
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

  const createBookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const response = await apiRequest("POST", "/api/bookings", data);
      return response.json();
    },
    onSuccess: (data) => {
      setBookingId(data.booking.bookingId);
      setBookingConfirmed(true);
      form.reset();
      setSelectedService("");
      toast({
        title: "Booking Confirmed!",
        description: "Your service booking has been successfully submitted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: "There was an error submitting your booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingFormData) => {
    createBookingMutation.mutate(data);
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    form.setValue("service", serviceId);
    setIsServicesOpen(false);
  };

  const selectedServiceData = services.find(s => s.id === selectedService);

  return (
    <div className="space-y-8">
      {/* Booking Widget Container */}
      <Card className="overflow-hidden">
        {/* Widget Header */}
        <CardHeader className="bg-gradient-to-r from-primary to-blue-600 text-white">
          <CardTitle className="text-2xl">Book Your Service</CardTitle>
          <p className="text-blue-100">Fill out the form below to schedule your appointment</p>
        </CardHeader>

        {/* Booking Form */}
        <CardContent className="p-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  {...form.register("fullName")}
                />
                {form.formState.errors.fullName && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.fullName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="email">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="phone">
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  {...form.register("phone")}
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="preferredDate">
                  Preferred Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="preferredDate"
                  type="date"
                  {...form.register("preferredDate")}
                />
                {form.formState.errors.preferredDate && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.preferredDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Service Selection */}
            <div>
              <Label>
                Select Service <span className="text-destructive">*</span>
              </Label>
              <Collapsible open={isServicesOpen} onOpenChange={setIsServicesOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between mt-2"
                  >
                    {selectedServiceData ? (
                      <span className="flex items-center gap-2">
                        <selectedServiceData.icon className="h-4 w-4" />
                        {selectedServiceData.name}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Choose a service...</span>
                    )}
                    <ChevronDown className={`h-4 w-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="mt-2">
                  <div className="border rounded-lg p-4 bg-white shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {services.map((service) => (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => handleServiceSelect(service.id)}
                          className={`p-4 border rounded-lg text-left transition-colors hover:bg-gray-50 ${
                            selectedService === service.id
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <service.icon className={`h-5 w-5 ${service.color}`} />
                            <div>
                              <h3 className="font-medium text-gray-900">{service.name}</h3>
                              <p className="text-sm text-gray-500">{service.description}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              {form.formState.errors.service && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.service.message}
                </p>
              )}
            </div>

            {/* Additional Information */}
            <div>
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                placeholder="Please provide any additional details about your service requirements..."
                rows={4}
                {...form.register("additionalInfo")}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={createBookingMutation.isPending}
              >
                {createBookingMutation.isPending ? (
                  "Submitting..."
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Service
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Booking Confirmation */}
      {bookingConfirmed && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <h3 className="text-xl font-semibold text-green-800">Booking Confirmed!</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Your service booking has been successfully submitted. You will receive a confirmation email shortly.
            </p>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Booking ID:</p>
              <Badge variant="secondary" className="font-mono">
                {bookingId}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
