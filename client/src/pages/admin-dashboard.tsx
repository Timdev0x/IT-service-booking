import React from "react";
import AdminDashboard from "@/components/admin-dashboard";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function AdminDashboardPage() {
  const [, navigate] = useLocation();
  const { isAuthenticated, user, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const logoutMutation = useMutation({
    mutationFn: async () => await apiRequest("POST", "/api/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/check"] });
      navigate("/admin");
      toast({ title: "Logged Out", description: "Goodbye!" });
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (!isAuthenticated || user?.role !== "admin") {
    navigate("/admin");
    return null;
  }

  return (
    <div className="p-6 bg-gray-50">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <Button
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
          <LogOut className="ml-2" />
        </Button>
      </header>
      <AdminDashboard />
    </div>
  );
}
