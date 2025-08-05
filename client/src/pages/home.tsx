import React from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import BookingForm from "@/components/booking-form";
import {
  Code,
  ShoppingCart,
  GraduationCap,
  Network,
  Lightbulb,
} from "lucide-react";

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
                title: "Software Development",
                icon: Code,
                description: "Custom applications tailored to your business needs",
                color: "text-blue-600",
                bg: "bg-blue-100",
              },
              {
                title: "Ecommerce Store Design",
                icon: ShoppingCart,
                description: "Sell online with conversion-optimized store setups",
                color: "text-pink-600",
                bg: "bg-pink-100",
              },
              {
                title: "IT Training",
                icon: GraduationCap,
                description: "Upskill your team with expert-led tech sessions",
                color: "text-teal-600",
                bg: "bg-teal-100",
              },
              {
                title: "Networking and Maintenance",
                icon: Network,
                description: "Reliable IT infrastructure with proactive support",
                color: "text-orange-600",
                bg: "bg-orange-100",
              },
              {
                title: "IT Consultancy",
                icon: Lightbulb,
                description: "Strategic advice for smarter digital decisions",
                color: "text-purple-600",
                bg: "bg-purple-100",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 ${service.bg} rounded-lg mb-4`}
                >
                  <service.icon className={`h-6 w-6 ${service.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
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
          </a>
          . All rights reserved.
        </p>
      </footer>
    </div>
  );
}
