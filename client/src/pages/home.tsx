import React from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import BookingForm from "@/components/booking-form";
import { Calendar, Shield, Network, Gavel, Lightbulb } from "lucide-react";

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AIS - Services Booking 
            </h1>
            <p className="text-gray-600">
              Schedule your service appointment with our expert team
            </p>
          </div>
        </div>
      </header>

      {/* Main Booking Section */}
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BookingForm />

        {/* Services Overview */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Consultancy",
                icon: Lightbulb,
                description: "Strategic guidance and expert advice",
                color: "text-accent",
                bg: "bg-accent/10",
              },
              {
                title: "Networking",
                icon: Network,
                description: "Professional network setup and optimization services",
                color: "text-secondary",
                bg: "bg-secondary/10",
              },
              {
                title: "Computer Maintenance",
                icon: Gavel,
                description: "Comprehensive hardware and software maintenance solutions",
                color: "text-primary",
                bg: "bg-primary/10",
              },
              {
                title: "Cybersecurity",
                icon: Shield,
                description: "Advanced security assessment and protection services",
                color: "text-destructive",
                bg: "bg-destructive/10",
              },
            ].map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className={`flex items-center justify-center w-12 h-12 ${service.bg} rounded-lg mb-4`}>
                  <service.icon className={`h-6 w-6 ${service.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-white border-t border-gray-200 text-center py-4">
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()}{" "}
          <a
            href="https://www.ais.co.ke"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Advanced Infosec Solutions
          </a>. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
