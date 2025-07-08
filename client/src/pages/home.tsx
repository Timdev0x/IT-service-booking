import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import BookingForm from "@/components/booking-form";
import { ArrowRight, Calendar, Shield, Network, Gavel, Lightbulb } from "lucide-react";

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={() => navigate("/admin")}
          className="bg-primary text-white shadow-lg hover:bg-blue-600"
        >
          <ArrowRight className="mr-2 h-4 w-4" />
          View Admin Panel
        </Button>
      </div>

      {/* Header Section */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Professional Services Booking
            </h1>
            <p className="text-gray-600">
              Schedule your service appointment with our expert team
            </p>
          </div>
        </div>
      </header>

      {/* Main Booking Section */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BookingForm />

        {/* Services Overview */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mb-4">
                <Lightbulb className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Consultancy</h3>
              <p className="text-sm text-gray-600">
                Strategic guidance and expert advice for your business needs
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-lg mb-4">
                <Network className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Networking</h3>
              <p className="text-sm text-gray-600">
                Professional network setup and optimization services
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                <Gavel className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Computer Maintenance</h3>
              <p className="text-sm text-gray-600">
                Comprehensive hardware and software maintenance solutions
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-center w-12 h-12 bg-destructive/10 rounded-lg mb-4">
                <Shield className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Cybersecurity</h3>
              <p className="text-sm text-gray-600">
                Advanced security assessment and protection services
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
