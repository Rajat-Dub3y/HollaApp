import { useQuery } from "@tanstack/react-query";

export function usePremiumAccess() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/session-user"],
    queryFn: async () => {
      const response = await fetch("/api/session-user", {
        credentials: "include",
      });

      if (response.status === 401 || response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    },
    retry: false,
    staleTime: 0,
  });

  const status = user?.subscriptionStatus;
  const isPremium = status === "premium" || status === "premium_plus";
  const isPremiumPlus = status === "premium_plus";

  return {
    user,
    loading: isLoading,
    isPremium,
    isPremiumPlus,
  };
}