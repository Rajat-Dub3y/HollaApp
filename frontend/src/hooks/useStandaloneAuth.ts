import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useStandaloneAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['/api/standalone-auth/user'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/standalone-auth/user', {
          credentials: 'include',
        });
        
        if (response.status === 401) {
          return null; // Not authenticated, but this is expected
        }
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const userData = await response.json();
        
        // TEMPORARY: Enable premium for testing
        if (userData) {
          userData.subscriptionStatus = "premium";
        }
        
        return userData;
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