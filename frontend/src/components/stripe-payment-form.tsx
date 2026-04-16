import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import WalletPaymentSystem from "./wallet-payment-system";

interface StripePaymentFormProps {
  email: string;
}

export default function StripePaymentForm({ email }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/welcome-premium",
        },
        redirect: 'if_required'
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Immediately activate premium features
        await fetch('/api/payment-success', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            payment_intent_id: paymentIntent.id,
            email: email
          })
        });
        
        toast({
          title: "Welcome To Premium!",
          description: "You now have access to 20 replies and advanced features.",
        });
        
        // Force page reload to update user status
        window.location.href = "/welcome-premium";
      }
    } catch (err) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Subscription</h2>
        <p className="text-gray-600 mb-2">
          Get 20 AI-powered replies and advanced conversation insights
        </p>
        <p className="text-sm text-green-600">Signed in as: {email}</p>
      </div>

      <WalletPaymentSystem 
        email={email} 
        onPaymentSuccess={() => window.location.href = "/welcome-premium"}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <PaymentElement 
            options={{
              layout: "tabs",
              wallets: {
                applePay: "auto",
                googlePay: "auto"
              },
              defaultValues: {
                billingDetails: {
                  email: email
                }
              }
            }}
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={!stripe || !elements || isProcessing}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 rounded-xl transition-all duration-300"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              Processing...
            </div>
          ) : (
            "Subscribe To Premium - $9.99/month"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Secure payment powered by Stripe. Cancel anytime from your account settings.
        </p>
      </div>
    </div>
  );
}