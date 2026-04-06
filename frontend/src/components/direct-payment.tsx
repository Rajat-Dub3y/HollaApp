import React, { useState, useEffect } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

interface DirectPaymentProps {
  email: string;
  clientSecret: string;
}

const CheckoutForm = ({ email, clientSecret }: { email: string; clientSecret: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGooglePayProcessing, setIsGooglePayProcessing] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [canMakeGooglePayment, setCanMakeGooglePayment] = useState(false);

  useEffect(() => {
    if (stripe && clientSecret) {
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Holla Premium Subscription',
          amount: 10,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      pr.canMakePayment().then((result) => {
        if (result && result.googlePay) {
          setPaymentRequest(pr);
          setCanMakeGooglePayment(true);
          console.log('Google Pay available: true');
        }
      }).catch((error) => {
        console.log('Google Pay not available:', error);
        setCanMakeGooglePayment(false);
      });

      pr.on('paymentmethod', async (ev) => {
        setIsGooglePayProcessing(true);
        try {
          const { error: confirmError } = await stripe.confirmCardPayment(
            clientSecret,
            { payment_method: ev.paymentMethod.id }
          );

          if (confirmError) {
            ev.complete('fail');
            toast({
              title: "Payment Failed",
              description: confirmError.message,
              variant: "destructive",
            });
          } else {
            ev.complete('success');
            
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
        } catch (error) {
          ev.complete('fail');
          toast({
            title: "Payment Error",
            description: "Payment processing failed",
            variant: "destructive",
          });
        } finally {
          setIsGooglePayProcessing(false);
        }
      });
    }
  }, [stripe, clientSecret, email, toast]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/welcome-premium`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      // Set premium status immediately on successful payment
      localStorage.setItem('userPremiumStatus', 'premium');
      localStorage.setItem('userEmail', email);
      
      toast({
        title: "Payment Successful!",
        description: "Premium features activated!",
      });
    }

    setIsProcessing(false);
  };

  const handleGooglePay = async () => {
    setIsGooglePayProcessing(true);
    try {
      if (paymentRequest && canMakeGooglePayment) {
        await paymentRequest.show();
      } else {
        toast({
          title: "Google Pay Not Available", 
          description: "Google Pay requires HTTPS and Chrome on Android device",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      if (error.type !== 'AbortError') {
        toast({
          title: "Google Pay Error",
          description: error.message || "Unable to process Google Pay",
          variant: "destructive",
        });
      }
    } finally {
      setIsGooglePayProcessing(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Subscription</h2>
        <p className="text-gray-600 mb-2">
          Get unlimited AI-powered replies and advanced conversation insights
        </p>
        <p className="text-sm text-green-600">Signed in as: {email}</p>
      </div>

      {/* Google Pay button - works on mobile and desktop */}
      {canMakeGooglePayment && (
        <>
          <div className="mb-6">
            <Button 
              onClick={handleGooglePay}
              disabled={isGooglePayProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
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
            <span className="text-gray-500 text-sm">or pay with card</span>
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <PaymentElement />
        <Button 
          type="submit" 
          disabled={!stripe || !elements || isProcessing}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 rounded-xl transition-all duration-300"
        >
          {isProcessing ? "Processing..." : "Subscribe To Premium - $9.99/month"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Secure payment powered by Stripe. Cancel anytime.
        </p>
      </div>
    </div>
  );
};

export default function DirectPayment({ email, clientSecret }: DirectPaymentProps) {
  return (
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
      <CheckoutForm email={email} clientSecret={clientSecret} />
    </Elements>
  );
}