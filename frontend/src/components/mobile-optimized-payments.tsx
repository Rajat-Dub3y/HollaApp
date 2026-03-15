import React, { useState, useEffect } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

interface MobileOptimizedPaymentsProps {
  email: string;
  clientSecret: string;
}

const MobilePaymentForm = ({ email, clientSecret }: { email: string; clientSecret: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGooglePayProcessing, setIsGooglePayProcessing] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [canMakeGooglePayment, setCanMakeGooglePayment] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const mobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (stripe && clientSecret) {
      // Google Pay works on any secure context (HTTPS or localhost)
      const isSecureContext = window.isSecureContext;
      
      if (!isSecureContext && window.location.hostname !== 'localhost') {
        console.log('Google Pay requires HTTPS');
        setCanMakeGooglePayment(false);
        return;
      }

      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Holla Premium',
          amount: 999,
        },
        displayItems: [{
          label: 'Monthly Subscription',
          amount: 999,
        }],
        requestPayerName: false,
        requestPayerEmail: false,
        requestPayerPhone: false,
        requestShipping: false,
      });

      // Check Google Pay availability with proper error handling
      pr.canMakePayment().then((result) => {
        console.log('Payment request result:', result);
        if (result && (result.googlePay || result.applePay)) {
          setPaymentRequest(pr);
          setCanMakeGooglePayment(true);
          console.log('Digital wallet available:', { googlePay: !!result.googlePay, applePay: !!result.applePay });
        } else {
          console.log('No digital wallets available on this device/browser');
          setCanMakeGooglePayment(false);
        }
      }).catch((error) => {
        console.log('Payment request check failed:', error.message);
        setCanMakeGooglePayment(false);
      });

      // Handle Google Pay payment
      pr.on('paymentmethod', async (ev) => {
        setIsGooglePayProcessing(true);
        try {
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
            
            // Set premium status
            localStorage.setItem('userPremiumStatus', 'premium');
            localStorage.setItem('userEmail', email);
            
            toast({
              title: "Payment Successful!",
              description: "Premium features activated! Redirecting...",
            });
            
            // Redirect after success
            setTimeout(() => {
              window.location.href = '/welcome-premium?source=google-pay';
            }, 1500);
          }
        } catch (error: any) {
          ev.complete('fail');
          toast({
            title: "Payment Error",
            description: error.message || "Payment processing failed",
            variant: "destructive",
          });
        } finally {
          setIsGooglePayProcessing(false);
        }
      });
    }
  }, [stripe, clientSecret, email, toast]);

  const handleGooglePay = async () => {
    if (!paymentRequest) {
      toast({
        title: "Google Pay Unavailable",
        description: "Google Pay is not available on this device",
        variant: "destructive",
      });
      return;
    }

    setIsGooglePayProcessing(true);
    try {
      await paymentRequest.show();
    } catch (error: any) {
      if (error.type !== 'AbortError') {
        toast({
          title: "Google Pay Error",
          description: error.message || "Unable to open Google Pay",
          variant: "destructive",
        });
      }
      setIsGooglePayProcessing(false);
    }
  };

  const handleCardSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast({
        title: "Payment Error",
        description: "Payment system not ready. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Submit the form and confirm payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/welcome-premium`,
          receipt_email: email,
        },
        redirect: 'if_required'
      });

      if (error) {
        console.error('Payment error:', error);
        toast({
          title: "Payment Failed",
          description: error.message || "Please check your card details and try again.",
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded
        localStorage.setItem('userPremiumStatus', 'premium');
        localStorage.setItem('userEmail', email);
        
        toast({
          title: "Payment Successful!",
          description: "Premium features activated! Redirecting...",
        });
        
        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = '/welcome-premium';
        }, 1500);
      } else {
        // Payment requires additional action or failed
        toast({
          title: "Payment Processing",
          description: "Your payment is being processed. Please wait...",
        });
      }
    } catch (error: any) {
      console.error('Payment submission error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Network error. Please check your connection and try again.",
        variant: "destructive",
      });
    }

    setIsProcessing(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Complete Your Subscription</h2>
        <p className="text-gray-600 mb-2 text-sm sm:text-base">
          Get unlimited AI-powered replies and advanced conversation insights
        </p>
        <p className="text-sm text-green-600">Signed in as: {email}</p>
        
        {/* Payment mode notification */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 font-medium">💳 Secure Payment</p>
          <p className="text-xs text-blue-700 mt-1">
            Use any valid credit/debit card or Google Pay for instant activation
          </p>
          <p className="text-xs text-blue-600">
            Your payment is processed securely by Stripe. Premium features activate immediately.
          </p>
        </div>
      </div>

      {/* Google Pay button - production ready */}
      {canMakeGooglePayment && (
        <>
          <div className="mb-6">
            <Button 
              onClick={handleGooglePay}
              disabled={isGooglePayProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 sm:py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isGooglePayProcessing ? "Processing..." : "Pay with Google Pay"}
            </Button>
          </div>

          <div className="text-center mb-4">
            <div className="flex items-center justify-center space-x-4">
              <div className="h-px bg-gray-300 flex-1"></div>
              <span className="text-gray-500 text-sm">or pay with card</span>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>
          </div>
        </>
      )}

      {/* Mobile-specific message when Google Pay unavailable */}
      {isMobile && !canMakeGooglePayment && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700 text-center">
            For faster checkout on mobile, use the card form below or enable Google Pay in your browser settings.
          </p>
        </div>
      )}

      {/* Card payment form */}
      <form onSubmit={handleCardSubmit} className="space-y-4 sm:space-y-6">
        <div className="space-y-4">
          <PaymentElement 
            options={{
              layout: isMobile ? {
                type: 'accordion',
                defaultCollapsed: false,
                radios: false,
                spacedAccordionItems: true
              } : {
                type: 'tabs',
                defaultCollapsed: false,
              },
              fields: {
                billingDetails: {
                  name: 'never',
                  email: 'never',
                  address: {
                    country: 'never',
                    postalCode: 'auto',
                  }
                }
              },
              wallets: {
                googlePay: canMakeGooglePayment ? 'auto' : 'never'
              }
            }}
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={!stripe || !elements || isProcessing}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 sm:py-4 rounded-xl transition-all duration-300"
        >
          {isProcessing ? "Processing..." : "Subscribe to Premium - $9.99/month"}
        </Button>
      </form>

      <div className="mt-4 sm:mt-6 text-center">
        <p className="text-xs text-gray-500">
          Secure payment powered by Stripe. Cancel anytime.
        </p>
        {isMobile && (
          <p className="text-xs text-gray-400 mt-1">
            Mobile-optimized checkout experience
          </p>
        )}
      </div>
    </div>
  );
};

export default function MobileOptimizedPayments({ email, clientSecret }: MobileOptimizedPaymentsProps) {
  return (
    <Elements 
      stripe={stripePromise} 
      options={{ 
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#7C3AED',
            colorBackground: '#ffffff',
            colorText: '#1f2937',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            spacingUnit: '6px',
            borderRadius: '12px',
          }
        },
        loader: 'auto'
      }}
    >
      <MobilePaymentForm email={email} clientSecret={clientSecret} />
    </Elements>
  );
}