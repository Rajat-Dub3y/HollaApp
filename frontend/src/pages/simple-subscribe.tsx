import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {  useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import StandaloneLogin from "@/components/standalone-login";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Crown } from "lucide-react";
import { useLocation } from "wouter";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const SubscribeForm = ({ email }: { email: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/welcome-premium",
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome To Premium!",
        description: "You now have access to unlimited replies and advanced features.",
      });
      setLocation("/welcome-premium");
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8">
      <div className="text-center mb-8">
        <Crown className="h-12 w-12 text-purple-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Subscription</h2>
        <p className="text-gray-600">
          Get unlimited AI-powered replies and advanced conversation insights
        </p>
        <p className="text-sm text-green-600 mt-2">Signed in as: {email}</p>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Secure Payment Options</h3>
        <div className="flex flex-wrap gap-3 text-sm text-blue-700">
          <span className="flex items-center gap-1">💳 Cards</span>
          <span className="flex items-center gap-1">📱 Google Pay</span>
          <span className="flex items-center gap-1">🍎 Apple Pay</span>
          <span className="flex items-center gap-1">🔗 Link</span>
        </div>
        <p className="text-xs text-blue-600 mt-2">Select your preferred payment method below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <PaymentElement 
          options={{
            layout: "tabs",
            wallets: {
              googlePay: 'auto',
              applePay: 'auto'
            }
          }}
        />
        <Button 
          type="submit" 
          disabled={!stripe || !elements}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 rounded-xl transition-all duration-300"
        >
          Subscribe To Premium - $9.99/month
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Secure payment powered by Stripe. Cancel anytime from your account settings.
        </p>
      </div>
    </div>
  );
};

export default function SimpleSubscribe() {
  const [clientSecret, setClientSecret] = useState("");
  const [email, setEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLoginSuccess = (userEmail: string) => {
    setEmail(userEmail);
    setIsAuthenticated(true);
    
    // Create payment intent after login
    apiRequest("POST", "/api/standalone-payment-intent", { amount: 999, email: userEmail })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        }
      })
      .catch((error) => {
        console.error("Payment intent error:", error);
        toast({
          title: "Payment Setup Failed",
          description: "Please try again or contact support",
          variant: "destructive",
        });
      });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back To Home
            </Button>
          </div>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Subscribe to Premium</h1>
            <p className="text-lg text-gray-600">Quick email sign-in, no permissions required</p>
          </div>
          <StandaloneLogin onLoginSuccess={(email) => handleLoginSuccess(email)} />
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Setting up your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back To Home
          </Button>
        </div>
        
        <Elements 
          stripe={stripePromise} 
          options={{ 
            clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#7C3AED',
              }
            }
          }}
        >
          <SubscribeForm email={email} />
        </Elements>
      </div>
    </div>
  );
}