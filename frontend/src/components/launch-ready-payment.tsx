import React, { useState, useEffect } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Smartphone, Shield, Zap } from "lucide-react";

// Debug Stripe configuration
console.log('Stripe public key configured:', !!import.meta.env.VITE_STRIPE_PUBLIC_KEY);
console.log('Stripe public key starts with pk_:', import.meta.env.VITE_STRIPE_PUBLIC_KEY?.startsWith('pk_'));

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

interface LaunchReadyPaymentProps {
  email: string;
  clientSecret: string;
}

const LaunchPaymentForm = ({ email, clientSecret }: { email: string; clientSecret: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGooglePayProcessing, setIsGooglePayProcessing] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [canMakeGooglePayment, setCanMakeGooglePayment] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
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

      pr.canMakePayment().then((result) => {
        if (result && (result.googlePay || result.applePay)) {
          setPaymentRequest(pr);
          setCanMakeGooglePayment(true);
        } else {
          setCanMakeGooglePayment(false);
        }
      }).catch(() => {
        setCanMakeGooglePayment(false);
      });

      pr.on('paymentmethod', async (ev) => {
        setIsGooglePayProcessing(true);
        try {
          const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: ev.paymentMethod.id,
          });

          if (error) {
            ev.complete('fail');
            toast({
              title: "Payment Failed",
              description: error.message || "Please try again",
              variant: "destructive",
            });
          } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            ev.complete('success');
            
            // Update backend with payment success
            try {
              const response = await fetch('/api/payment-success', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  payment_intent_id: paymentIntent.id,
                  email: email 
                }),
                credentials: 'include'
              });
              
              if (!response.ok) {
                console.error('Failed to update premium status on backend');
              }
            } catch (backendError) {
              console.error('Backend update error:', backendError);
            }
            
            localStorage.setItem('userPremiumStatus', 'premium');
            localStorage.setItem('userEmail', email);
            
            toast({
              title: "Payment Successful!",
              description: "Premium activated! Redirecting...",
            });
            
            setTimeout(() => {
              window.location.href = '/welcome-premium';
            }, 1500);
          }
        } catch (error: any) {
          ev.complete('fail');
          console.error('Google Pay error:', error);
          toast({
            title: "Payment Error",
            description: error.message?.includes('fetch') ? "Connection issue. Please try card payment below." : "Please try card payment below.",
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
        description: "Please use card payment below",
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
          description: "Please use card payment below",
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
        title: "Loading...",
        description: "Please wait for payment system to load",
      });
      return;
    }

    setIsProcessing(true);

    try {
      console.log('Starting payment confirmation...', { email, stripe: !!stripe, elements: !!elements });
      
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/welcome-premium`,
          receipt_email: email,
        },
        redirect: 'if_required'
      });
      
      console.log('Payment confirmation result:', { error, paymentIntent });

      // If payment succeeded, update user status on backend
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        try {
          const response = await fetch('/api/payment-success', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              payment_intent_id: paymentIntent.id,
              email: email 
            }),
            credentials: 'include'
          });
          
          if (!response.ok) {
            console.error('Failed to update premium status on backend');
          }
        } catch (backendError) {
          console.error('Backend update error:', backendError);
          // Continue with frontend success even if backend fails
        }
      }

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message || "Please check your card details",
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        localStorage.setItem('userPremiumStatus', 'premium');
        localStorage.setItem('userEmail', email);
        
        toast({
          title: "Payment Successful!",
          description: "Premium features activated!",
        });
        
        setTimeout(() => {
          window.location.href = '/welcome-premium';
        }, 1500);
      }
    } catch (error: any) {
      console.error('Card payment error details:', {
        message: error.message,
        type: error.type,
        code: error.code,
        decline_code: error.decline_code,
        payment_intent: error.payment_intent,
        full_error: error
      });
      
      let errorMessage = "Please check your card details and try again";
      
      if (error.message?.includes('test mode') || error.message?.includes('test card')) {
        errorMessage = "Test cards not accepted for live payments. Please use a real card.";
      } else if (error.message?.includes('fetch') || error.message?.includes('network') || error.message?.includes('timeout')) {
        errorMessage = "Connection timeout. Please check your internet connection and try again";
      } else if (error.message?.includes('declined') || error.code === 'card_declined') {
        errorMessage = "Card declined. Please try a different payment method";
      } else if (error.type === 'validation_error' || error.code === 'incomplete_number') {
        errorMessage = "Please check your card information";
      } else if (error.code === 'expired_card') {
        errorMessage = "Card expired. Please use a different card";
      } else if (error.code === 'insufficient_funds') {
        errorMessage = "Insufficient funds. Please try a different payment method";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
    }

    setIsProcessing(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Premium Subscription</h2>
        <p className="text-gray-600 mb-4">
          Unlock unlimited AI-powered replies and advanced dating insights
        </p>
        
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-1 text-green-600" />
            Secure
          </div>
          <div className="flex items-center">
            <Zap className="w-4 h-4 mr-1 text-blue-600" />
            Instant
          </div>
        </div>
        
        <p className="text-sm text-green-600">Signed in as: {email}</p>
      </div>

      {canMakeGooglePayment && (
        <>
          <div className="mb-6">
            <Button 
              onClick={handleGooglePay}
              disabled={isGooglePayProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
            >
              <Smartphone className="h-5 w-5" />
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

      <form onSubmit={handleCardSubmit} className="space-y-6">
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
              }
            }}
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={!stripe || !elements || isProcessing}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          <CreditCard className="w-4 h-4" />
          {isProcessing ? "Processing Payment..." : "Subscribe to Premium - $9.99/month"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Secure payment powered by Stripe. Cancel anytime.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Premium features activate immediately after payment
        </p>
      </div>
    </div>
  );
};

export default function LaunchReadyPayment({ email, clientSecret }: LaunchReadyPaymentProps) {
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
            colorDanger: '#ef4444',
            borderRadius: '12px',
          }
        }
      }}
    >
      <LaunchPaymentForm email={email} clientSecret={clientSecret} />
    </Elements>
  );
}