import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useDirectAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['/api/direct-auth/user'],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/direct-auth/user");
        return await response.json();
      } catch (err) {
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error
  };
}