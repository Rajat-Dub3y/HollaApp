import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const SubscribeForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      setTimeout(() => window.location.href = '/', 2000);
    } else {
      toast({
        title: "Payment Successful",
        description: "Welcome to Premium Plus!",
      });
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Premium Plus</h2>
        <p className="text-xl text-gray-600">Take your game to the next level with expert coaching and proven frameworks - $24.99/month</p>
      </div>

      <div className="mb-6 p-4 bg-orange-50 rounded-xl border border-orange-200">
        <h3 className="text-lg font-semibold text-orange-900 mb-2">Payment Methods Available</h3>
        <div className="flex flex-wrap gap-3 text-sm text-orange-700">
          <span className="flex items-center gap-1">💳 Credit/Debit Cards</span>
          <span className="flex items-center gap-1">📱 Google Pay</span>
          <span className="flex items-center gap-1">🍎 Apple Pay</span>
          <span className="flex items-center gap-1">🔗 Link</span>
        </div>
        <p className="text-xs text-orange-600 mt-2">Choose your preferred payment method below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <PaymentElement 
          options={{
            layout: "tabs",
            wallets: {
              applePay: 'auto',
              googlePay: 'auto'
            },
            fields: {
              billingDetails: 'auto'
            }
          }}
        />
        <button 
          type="submit"
          disabled={!stripe}
          className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold py-4 rounded-lg transition-all duration-300"
        >
          Subscribe To Premium Plus - $24.99/month
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Secure payment powered by Stripe. Cancel anytime from your account settings.
        </p>
      </div>
    </div>
  );
};

export default function SubscribePremiumPlus() {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    apiRequest("POST", "/api/get-or-create-premium-plus-subscription")
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret)
      });
  }, []);

  if (!clientSecret) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }
  // Make SURE to wrap the form in <Elements> which provides the stripe context.
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4">
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <SubscribeForm />
        </Elements>
      </div>
    </div>
  );
};