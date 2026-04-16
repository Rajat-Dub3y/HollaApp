import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Settings, Crown, User } from "lucide-react";

// Local storage key for testing tier
const TEST_TIER_KEY = 'holla_test_tier';

export default function DevTestingPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const getCurrentTestTier = () => {
    return localStorage.getItem(TEST_TIER_KEY) || 'free';
  };

  const setTestTier = (tier: 'free' | 'premium' | 'premium_plus') => {
    localStorage.setItem(TEST_TIER_KEY, tier);
    window.location.reload();
  };

  const activatePremium = () => {
    setTestTier('premium');
    toast({
      title: "Premium Activated",
      description: "You now have Premium access for testing",
    });
  };

  const activatePremiumPlus = () => {
    setTestTier('premium_plus');
    toast({
      title: "Premium Plus Activated", 
      description: "You now have Premium Plus access for testing",
    });
  };

  const deactivatePremium = () => {
    setTestTier('free');
    toast({
      title: "Premium Deactivated",
      description: "Premium access removed for testing",
    });
  };

  // Only show in development
  if (import.meta.env.DEV !== true) {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          size="lg"
          className="bg-red-500 border-red-600 text-white hover:bg-red-600 shadow-lg"
        >
          <Settings className="h-5 w-5 mr-2" />
          DEV TEST
        </Button>
      </div>

      {/* Testing Panel */}
      {isOpen && (
        <div className="fixed top-16 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Development Testing</h3>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
              className="text-gray-500"
            >
              ×
            </Button>
          </div>

          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <User className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">Current Status</span>
              </div>
              <p className="text-sm text-gray-600">
                Testing Tier: {getCurrentTestTier()}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <Crown className="h-4 w-4 mr-2 text-yellow-500" />
                Premium Testing
              </h4>
              
              <Button
                onClick={activatePremium}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                Activate Premium
              </Button>
              
              <Button
                onClick={activatePremiumPlus}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                size="sm"
              >
                Activate Premium Plus
              </Button>
              
              <Button
                onClick={deactivatePremium}
                variant="outline"
                className="w-full"
                size="sm"
              >
                Reset to Free
              </Button>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Test Cases</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Creative tone access control</li>
                <li>• 20 replies for Premium</li>
                <li>• Premium upsell messages</li>
                <li>• Subscription status display</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}