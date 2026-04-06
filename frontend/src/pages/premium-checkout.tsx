import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useStandaloneAuth } from "@/hooks/useStandaloneAuth";
import { useAuth } from "@/hooks/useAuth";
import StandaloneLogin from "@/components/standalone-login";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Crown } from "lucide-react";
import { useLocation } from "wouter";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ standaloneUser, authUser }: { standaloneUser: any; authUser: any }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/premium-checkout",
      },
      redirect: "if_required"
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    } else if (paymentIntent?.status === "succeeded") {
      // Payment successful - activate premium
      try {
        const userEmail = standaloneUser?.email || authUser?.email;
        await apiRequest("POST", "/api/payment-success", {
          payment_intent_id: paymentIntent.id,
          email: userEmail
        });

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['/api/standalone-auth/user'] }),
          queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] }),
          queryClient.refetchQueries({ queryKey: ['/api/standalone-auth/user'] }),
          queryClient.refetchQueries({ queryKey: ['/api/auth/user'] }),
        ]);
        
        toast({
          title: "Payment Successful!",
          description: "Premium access activated! Redirecting...",
        });
        
        setTimeout(() => {
          setLocation("/");
        }, 2000);
      } catch (error) {
        console.error("Payment activation error:", error);
        toast({
          title: "Payment Processed",
          description: "Payment successful! Premium access will be activated shortly.",
        });
        setTimeout(() => {
          setLocation("/");
        }, 2000);
      }
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Crown className="h-8 w-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upgrade to Premium</h2>
        <p className="text-gray-600">Unlock all premium features and start getting better responses</p>
      </div>

      <div className="mb-6 p-4 bg-purple-50 rounded-lg">
        <h3 className="font-semibold text-purple-900 mb-2">Premium Features:</h3>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• Creative tone responses</li>
          <li>• Pattern Interrupt Engine</li>
          <li>• Romeo Dating Master coach</li>
          <li>• Unlimited message generation</li>
          <li>• Priority support</li>
        </ul>
      </div>

      <div className="mb-6 text-center">
        <div className="text-3xl font-bold text-gray-900">$9.99</div>
        <div className="text-gray-600">one-time payment</div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <PaymentElement />
        <Button 
          type="submit" 
          disabled={!stripe || isProcessing}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {isProcessing ? "Processing..." : "Upgrade to Premium"}
        </Button>
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Secure payment processed by Stripe. Cancel anytime.
      </div>
    </div>
  );
};

export default function PremiumCheckout() {
  const [clientSecret, setClientSecret] = useState("");
  const { isAuthenticated: isStandaloneAuthenticated, isLoading: isStandaloneLoading, user: standaloneUser } = useStandaloneAuth();
  const { user: authUser, isLoading: isAuthLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showStandaloneLogin, setShowStandaloneLogin] = useState(false);
  const isLoading = isStandaloneLoading || isAuthLoading;
  const isAuthenticated = isStandaloneAuthenticated || !!authUser;
  const currentUser = standaloneUser || authUser;

  // Check if user is already premium
  const isPremium = (currentUser as any)?.subscriptionStatus === "premium" || (currentUser as any)?.subscriptionStatus === "premium_plus";

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowStandaloneLogin(true);
      return;
    }

    if (isAuthenticated) {
      setShowStandaloneLogin(false);
      // Check if already premium
      if (isPremium) {
        toast({
          title: "Already Premium",
          description: "You already have premium access!",
        });
        setLocation("/");
        return;
      }
      const userEmail = currentUser?.email;

      // Create payment intent
      apiRequest("POST", "/api/create-payment-intent", { amount: 100, email: userEmail })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          console.error("Payment error:", error);
          toast({
            title: "Payment Setup Failed", 
            description: "Failed to setup payment. Please try again.",
            variant: "destructive",
          });
        });
    }
  }, [currentUser, isAuthenticated, isLoading, isPremium, setLocation, toast]);

  const handleLoginSuccess = () => {
    setShowStandaloneLogin(false);
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  if (showStandaloneLogin) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => setLocation("/subscribe")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back To Plans
            </Button>
          </div>
          <StandaloneLogin onLoginSuccess={handleLoginSuccess} />
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/subscribe")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back To Plans
          </Button>
        </div>

        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm standaloneUser={standaloneUser} authUser={authUser} />
        </Elements>
      </div>
    </div>
  );
}
