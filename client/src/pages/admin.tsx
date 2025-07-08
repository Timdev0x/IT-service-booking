import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import AdminDashboard from "@/components/admin-dashboard";
import { ArrowLeft, Settings } from "lucide-react";

export default function Admin() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={() => navigate("/")}
          className="bg-primary text-white shadow-lg hover:bg-blue-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          View Booking Form
        </Button>
      </div>

      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Settings className="text-primary h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Manage service bookings and clients</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Welcome back,</p>
                <p className="font-medium text-gray-900">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminDashboard />
      </main>
    </div>
  );
}
