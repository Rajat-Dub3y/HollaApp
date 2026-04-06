import React, { useState, useEffect } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

const PaymentTestForm = ({ clientSecret }: { clientSecret: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [testResults, setTestResults] = useState<{
    stripeReady?: boolean;
    testing?: boolean;
    paymentError?: string;
    errorType?: string;
    errorCode?: string;
    paymentSuccess?: boolean;
    systemError?: string;
  }>({});

  const runPaymentTest = async () => {
    if (!stripe || !elements) {
      setTestResults(prev => ({ ...prev, stripeReady: false }));
      return;
    }

    setIsProcessing(true);
    setTestResults(prev => ({ ...prev, stripeReady: true, testing: true }));

    try {
      // Test payment submission without actual processing
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/welcome-premium`,
        },
        redirect: 'if_required'
      });

      if (error) {
        setTestResults(prev => ({ 
          ...prev, 
          paymentError: error.message,
          errorType: error.type,
          errorCode: error.code,
          testing: false
        }));
        
        toast({
          title: "Payment Test Result",
          description: `Error: ${error.message}`,
          variant: "destructive",
        });
      } else {
        setTestResults(prev => ({ 
          ...prev, 
          paymentSuccess: true,
          testing: false
        }));
        
        toast({
          title: "Payment Test Successful",
          description: "Payment system is working correctly",
        });
      }
    } catch (error: any) {
      setTestResults(prev => ({ 
        ...prev, 
        systemError: error.message,
        testing: false
      }));
      
      toast({
        title: "System Error",
        description: error.message,
        variant: "destructive",
      });
    }

    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Payment System Test</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <div>Stripe Ready: {testResults.stripeReady ? '✓' : '✗'}</div>
          <div>Client Secret: {clientSecret ? '✓' : '✗'}</div>
          <div>Testing: {testResults.testing ? 'In Progress...' : 'Ready'}</div>
          {testResults.paymentError && (
            <div className="text-red-600">
              Error: {testResults.paymentError} ({testResults.errorType})
            </div>
          )}
          {testResults.systemError && (
            <div className="text-red-600">
              System Error: {testResults.systemError}
            </div>
          )}
          {testResults.paymentSuccess && (
            <div className="text-green-600">✓ Payment test successful</div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <PaymentElement 
          options={{
            layout: {
              type: 'tabs',
              defaultCollapsed: false,
            }
          }}
        />
      </div>

      <Button 
        onClick={runPaymentTest}
        disabled={!stripe || !elements || isProcessing}
        className="w-full"
      >
        {isProcessing ? "Testing Payment System..." : "Test Payment System"}
      </Button>
    </div>
  );
};

export default function PaymentTestComponent() {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const createTestPaymentIntent = async () => {
      try {
        const response = await apiRequest("POST", "/api/standalone-payment-intent", {
          email: "test@example.com",
          amount: 100
        });
        
        const data = await response.json();
        
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          toast({
            title: "Setup Error",
            description: "Failed to create payment intent",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        toast({
          title: "API Error",
          description: error.message || "Failed to connect to payment API",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    createTestPaymentIntent();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Setting up payment test...</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Failed to initialize payment system</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Payment System Test</h2>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <PaymentTestForm clientSecret={clientSecret} />
      </Elements>
    </div>
  );
}