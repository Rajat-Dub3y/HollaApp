import React, { useState, useEffect } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, CheckCircle, Smartphone } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

interface SimplePaymentFormProps {
  email: string;
  clientSecret: string;
  onSuccess?: () => void;
}

const PaymentForm = ({ email, clientSecret, onSuccess }: SimplePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [canMakeGooglePayment, setCanMakeGooglePayment] = useState(false);

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Holla Premium',
          amount: 999,
        },
      });

      pr.canMakePayment().then((result) => {
        if (result && (result.googlePay || result.applePay)) {
          setPaymentRequest(pr);
          setCanMakeGooglePayment(true);
        }
      }).catch(() => {
        setCanMakeGooglePayment(false);
      });

      pr.on('paymentmethod', async (ev) => {
        try {
          const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: ev.paymentMethod.id,
          });

          if (error) {
            ev.complete('fail');
            toast({
              title: "Payment Failed",
              description: error.message,
              variant: "destructive",
            });
            setTimeout(() => window.location.href = '/', 2000);
          } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            ev.complete('success');
            
            // Update backend
            try {
              await fetch('/api/payment-success', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  payment_intent_id: paymentIntent.id,
                  email: email 
                }),
                credentials: 'include'
              });
            } catch (backendError) {
              console.error('Backend update failed:', backendError);
            }

            localStorage.setItem('userPremiumStatus', 'premium');
            localStorage.setItem('userEmail', email);
            
            toast({
              title: "Payment Successful!",
              description: "Premium features activated!",
            });
            
            if (onSuccess) {
              onSuccess();
            } else {
              setTimeout(() => {
                window.location.href = '/';
              }, 1500);
            }
          }
        } catch (error: any) {
          ev.complete('fail');
          toast({
            title: "Payment Error",
            description: error.message || "Please try card payment below",
            variant: "destructive",
          });
          setTimeout(() => window.location.href = '/', 2000);
        }
      });
    }
  }, [stripe, clientSecret, email, toast, onSuccess]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast({
        title: "Loading",
        description: "Payment system loading, please wait...",
      });
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast({
        title: "Error",
        description: "Card element not found",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    console.log('Starting simple payment confirmation...');

    try {
      // First, create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          email: email,
        },
      });

      if (paymentMethodError) {
        console.error('Payment method error:', paymentMethodError);
        throw paymentMethodError;
      }

      console.log('Payment method created:', paymentMethod.id);

      // Then confirm payment intent
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        console.error('Payment confirmation error:', confirmError);
        throw confirmError;
      }

      console.log('Payment confirmed successfully:', paymentIntent);

      if (paymentIntent.status === 'succeeded') {
        // Update backend
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
          
          if (response.ok) {
            console.log('Backend updated successfully');
          }
        } catch (backendError) {
          console.error('Backend update failed:', backendError);
        }

        localStorage.setItem('userPremiumStatus', 'premium');
        localStorage.setItem('userEmail', email);
        
        toast({
          title: "Payment Successful!",
          description: "Premium features activated!",
        });
        
        if (onSuccess) {
          onSuccess();
        } else {
          setTimeout(() => {
            window.location.href = '/';
          }, 1500);
        }
      }
    } catch (error: any) {
      console.error('Simple payment error:', error);
      
      let errorMessage = "Payment failed. Please try again.";
      
      if (error.code === 'card_declined') {
        errorMessage = "Card declined. Please try a different card.";
      } else if (error.code === 'incorrect_cvc') {
        errorMessage = "Incorrect CVC. Please check your card security code.";
      } else if (error.code === 'expired_card') {
        errorMessage = "Card expired. Please use a different card.";
      } else if (error.code === 'insufficient_funds') {
        errorMessage = "Insufficient funds. Please try a different payment method.";
      } else if (error.code === 'processing_error') {
        errorMessage = "Processing error. Please try again in a moment.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
      setTimeout(() => window.location.href = '/', 2000);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
      <div className="text-center mb-6">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Payment</h2>
        <p className="text-gray-600">Enter your card details to activate premium</p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
          <div className="flex items-center justify-center space-x-2 text-green-700">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{email}</span>
          </div>
        </div>
      </div>

      {/* Google Pay Button */}
      {canMakeGooglePayment && paymentRequest && (
        <div className="mb-4">
          <Button
            onClick={() => paymentRequest.show()}
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Smartphone className="w-5 h-5" />
            Pay with Google Pay
          </Button>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or pay with card</span>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 border border-gray-300 rounded-lg bg-white">
          <CardElement
            options={{
              hidePostalCode: true,
              style: {
                base: {
                  fontSize: '14px',
                  color: '#424770',
                  fontFamily: 'system-ui, sans-serif',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#e53e3e',
                },
              },
            }}
          />
        </div>
        
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
              Processing Payment...
            </div>
          ) : (
            `Pay $9.99 USD`
          )}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Secure payment processed by Stripe
        </p>
      </div>
    </div>
  );
};

export default function SimplePaymentForm({ email, clientSecret, onSuccess }: SimplePaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm email={email} clientSecret={clientSecret} onSuccess={onSuccess} />
    </Elements>
  );
}