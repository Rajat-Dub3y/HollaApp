import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface ProductionMobileWalletsProps {
  email: string;
  onPaymentSuccess: () => void;
}

export default function ProductionMobileWallets({ email, onPaymentSuccess }: ProductionMobileWalletsProps) {
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [isApplePayAvailable, setIsApplePayAvailable] = useState(false);
  const [isGooglePayAvailable, setIsGooglePayAvailable] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    initializeMobileWallets();
  }, []);

  const initializeMobileWallets = async () => {
    const stripe = await stripePromise;
    if (!stripe) return;

    // Check if we're in a secure context (required for mobile wallets)
    const isSecure = window.isSecureContext && window.location.protocol === 'https:';
    
    if (!isSecure) {
      console.log('Mobile wallets require HTTPS - will be available after deployment');
      return;
    }

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Holla Premium - $9.99/month',
        amount: 999,
      },
      requestPayerEmail: true,
      requestPayerName: true,
    });

    // Set up payment method handler
    pr.on('paymentmethod', async (ev) => {
      setIsProcessing(true);
      
      try {
        const response = await fetch('/api/standalone-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, amount: 999 }),
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to create payment intent');
        }

        const { clientSecret } = await response.json();

        const { error } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: ev.paymentMethod.id,
        });

        if (error) {
          ev.complete('fail');
          toast({
            title: "Payment Failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          ev.complete('success');
          
          // Store premium status for immediate access
          localStorage.setItem('userPremiumStatus', 'premium');
          localStorage.setItem('userEmail', email);
          
          toast({
            title: "Welcome To Premium!",
            description: "Mobile wallet payment successful!",
          });
          
          setTimeout(() => onPaymentSuccess(), 1000);
        }
      } catch (error) {
        ev.complete('fail');
        toast({
          title: "Payment Error",
          description: "Mobile payment failed. Please try card payment.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    });

    // Check payment method availability
    try {
      const result = await pr.canMakePayment();
      
      if (result) {
        setPaymentRequest(pr);
        
        if (result.applePay) {
          setIsApplePayAvailable(true);
        }
        
        if (result.googlePay) {
          setIsGooglePayAvailable(true);
        }
      }
    } catch (error) {
      console.log('Mobile wallet check failed:', error);
    }
  };

  const handleMobileWalletPayment = () => {
    if (paymentRequest && !isProcessing) {
      paymentRequest.show();
    }
  };

  // Show mobile wallet options only if available and in secure context
  const isSecureContext = window.isSecureContext && window.location.protocol === 'https:';
  const hasWalletOptions = isApplePayAvailable || isGooglePayAvailable;

  if (!isSecureContext) {
    return (
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Mobile Wallet Payments</h3>
        <p className="text-sm text-blue-700 mb-2">
          Apple Pay and Google Pay will be available after deployment on HTTPS domain.
        </p>
        <p className="text-xs text-blue-600">
          Currently using development environment - mobile wallets require secure connections.
        </p>
      </div>
    );
  }

  if (!hasWalletOptions) {
    return null;
  }

  return (
    <div className="mb-6 space-y-4">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4">
          Pay securely with your mobile wallet
        </p>
        
        <Button
          onClick={handleMobileWalletPayment}
          disabled={isProcessing}
          className="w-full h-14 bg-black hover:bg-gray-800 text-white rounded-lg flex items-center justify-center space-x-3 disabled:opacity-50"
        >
          {isApplePayAvailable && (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          )}
          
          {isGooglePayAvailable && (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={isApplePayAvailable ? "ml-2" : ""}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          
          <span>
            {isProcessing ? 'Processing...' : 
             isApplePayAvailable && isGooglePayAvailable ? 'Pay with Apple Pay or Google Pay' : 
             isApplePayAvailable ? 'Pay with Apple Pay' : 
             'Pay with Google Pay'}
          </span>
        </Button>
        
        <p className="text-xs text-gray-500 mt-2">
          Secure payment with biometric authentication
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or pay with card</span>
        </div>
      </div>
    </div>
  );
}