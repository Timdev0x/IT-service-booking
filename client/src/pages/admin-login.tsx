import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import LoginForm from "@/components/login-form";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect } from "react";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { isAuthenticated, user, refetch, isLoading } = useAuth();

  const handleLoginSuccess = async () => {
    console.log("✅ Login triggered");
    await refetch();
    navigate("/dashboard"); // 👈 redirect after login
    toast({
      title: "Login Successful",
      description: "Welcome to the admin dashboard!",
    });
  };

  useEffect(() => {
    console.log("🔍 Auth state:", { isAuthenticated, role: user?.role });
    if (isAuthenticated && user?.role === "admin") {
      navigate("/dashboard");
    }
  }, [isAuthenticated, user]);

  if (isLoading) return <p>Loading...</p>;

  return <LoginForm onLoginSuccess={handleLoginSuccess} />;
}
