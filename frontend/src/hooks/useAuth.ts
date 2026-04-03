import { auth } from "@/lib/firebase";
import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  email: string;
  subscriptionStatus?: string;
  subscriptionTier?: string;
}

export function useAuth() {
  const { data: user, isLoading } = useQuery<User>({
  queryKey: ["/api/auth/user"],
  queryFn: async () => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;

    const res = await fetch(`/api/auth/user?uid=${firebaseUser.uid}`);
    return res.json();
  },
  retry: false,
});
  // Check for testing tier override in development
  const testTier = typeof window !== 'undefined' ? localStorage.getItem('holla_test_tier') : null;
  const isTestMode = process.env.NODE_ENV === 'development' && testTier;

let isPremium = user?.subscriptionStatus === 'premium' || user?.subscriptionStatus === 'premium_plus';
let isPremiumPlus = user?.subscriptionStatus === 'premium_plus';

  // Override with test tier if in development
  if (isTestMode) {
    isPremium = testTier === 'premium' || testTier === 'premium_plus';
    isPremiumPlus = testTier === 'premium_plus';
  }
  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isPremium,
    isPremiumPlus,
  };
}