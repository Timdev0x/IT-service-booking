import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: authData, isLoading } = useQuery({
    queryKey: ["/api/auth/check"],
    retry: false,
  });

  return {
    isAuthenticated: authData?.isAuthenticated || false,
    userId: authData?.userId,
    isLoading,
  };
}