import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useAuth() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["/api/auth/check"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/auth/check");
      const json = await res.json();
      console.log("🔐 Auth check response:", json);
      return json;
    },
  });

  return {
    isAuthenticated: data?.isAuthenticated,
    user: data?.user,
    isLoading,
    refetch
  };
}
