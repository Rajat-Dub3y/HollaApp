import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface NativeMobilePaymentsProps {
  email: string;
  onPaymentSuccess: () => void;
}

export default function NativeMobilePayments({ email, onPaymentSuccess }: NativeMobilePaymentsProps) {
  const [isApplePayAvailable, setIsApplePayAvailable] = useState(false);
  const [isGooglePayAvailable, setIsGooglePayAvailable] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkMobilePaymentAvailability();
  }, []);

  const checkMobilePaymentAvailability = async () => {
    const stripe = await stripePromise;
    if (!stripe) return;

    const paymentRequest = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
          label: 'Holla Premium - $1.00/month',
          amount: 100,

    try {
      const canMakePayment = await paymentRequest.canMakePayment();
      console.log('Payment capabilities:', canMakePayment);
      
      if (canMakePayment) {
        if (canMakePayment.applePay) {
          setIsApplePayAvailable(true);
          console.log('Apple Pay available');
        }
        if (canMakePayment.googlePay) {
          setIsGooglePayAvailable(true);
          console.log('Google Pay available');
        }
      }
    } catch (error) {
      console.log('Payment request check failed:', error);
    }
  };

  const handleMobilePayment = async (paymentType: 'apple' | 'google') => {
    setIsProcessing(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe not loaded');

      const paymentRequest = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Holla Premium - $1.00/month',
          amount: 100,
        },
        requestPayerEmail: true,
        requestPayerName: true,
      });

      paymentRequest.on('paymentmethod', async (ev) => {
        try {
          const response = await fetch('/api/standalone-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, amount: 100 })
          });
          
          const { clientSecret } = await response.json();

          const { error } = await stripe.confirmPayment({
            elements: null,
            clientSecret,
            confirmParams: {
              payment_method: ev.paymentMethod.id,
              return_url: window.location.origin + '/welcome-premium'
            },
            redirect: 'if_required'
          } as any);

          if (error) {
            ev.complete('fail');
            toast({
              title: "Payment Failed",
              description: error.message,
              variant: "destructive",
            });
          } else {
            ev.complete('success');
            toast({
              title: "Welcome To Premium!",
              description: `${paymentType === 'apple' ? 'Apple' : 'Google'} Pay payment successful!`,
            });
            onPaymentSuccess();
          }
        } catch (error) {
          ev.complete('fail');
          toast({
            title: "Payment Error",
            description: "Payment processing failed. Please try again.",
            variant: "destructive",
          });
        }
      });

      paymentRequest.show();
    } catch (error) {
      toast({
        title: "Payment Error",
        description: `${paymentType === 'apple' ? 'Apple' : 'Google'} Pay not available.`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplePay = () => handleMobilePayment('apple');
  const handleGooglePay = () => handleMobilePayment('google');

  if (!isApplePayAvailable && !isGooglePayAvailable) {
    return null;
  }

  return (
    <div className="space-y-3 mb-6">
      <div className="text-center text-sm text-gray-600 mb-4">
        Pay with your mobile wallet
      </div>
      
      {isApplePayAvailable && (
        <Button
          onClick={handleApplePay}
          disabled={isProcessing}
          className="w-full bg-black hover:bg-gray-800 text-white h-12 rounded-lg flex items-center justify-center space-x-2"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          <span>Apple Pay</span>
        </Button>
      )}

      {isGooglePayAvailable && (
        <Button
          onClick={handleGooglePay}
          disabled={isProcessing}
          className="w-full bg-white hover:bg-gray-50 text-black border border-gray-300 h-12 rounded-lg flex items-center justify-center space-x-2"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Google Pay</span>
        </Button>
      )}

      <div className="text-center text-xs text-gray-500">
        Secure payment with Touch ID, Face ID, or PIN
      </div>
    </div>
  );
}