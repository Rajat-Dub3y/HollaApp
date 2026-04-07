import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

export default function MobilePaymentDebug() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkMobileCapabilities = async () => {
      const stripe = await stripePromise;
      if (!stripe) return;

      const userAgent = navigator.userAgent;
      const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      const isSecure = window.isSecureContext;
      const protocol = window.location.protocol;
      const hostname = window.location.hostname;

      // Test Google Pay availability
      try {
        const pr = stripe.paymentRequest({
          country: 'US',
          currency: 'usd',
          total: { label: 'Test', amount: 999 }
        });

        const result = await pr.canMakePayment();
        
        setDebugInfo({
          userAgent,
          isMobile,
          isSecure,
          protocol,
          hostname,
          googlePayAvailable: !!result?.googlePay,
          applePayAvailable: !!result?.applePay,
          paymentRequestSupported: !!result,
          stripeLoaded: true,
          timestamp: new Date().toISOString()
        });
      } catch (error: any) {
        setDebugInfo({
          userAgent,
          isMobile,
          isSecure,
          protocol,
          hostname,
          googlePayAvailable: false,
          applePayAvailable: false,
          paymentRequestSupported: false,
          stripeLoaded: true,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    };

    checkMobileCapabilities();
  }, []);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-2"
        >
          Debug Mobile Pay
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-sm">Mobile Payment Debug</h3>
        <Button
          onClick={() => setIsVisible(false)}
          variant="ghost"
          className="text-xs p-1 h-6 w-6"
        >
          ×
        </Button>
      </div>
      
      <div className="space-y-2 text-xs">
        <div>
          <strong>Mobile Device:</strong> {debugInfo.isMobile ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Secure Context:</strong> {debugInfo.isSecure ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Protocol:</strong> {debugInfo.protocol}
        </div>
        <div>
          <strong>Google Pay:</strong> {debugInfo.googlePayAvailable ? 'Available' : 'Not Available'}
        </div>
        <div>
          <strong>Apple Pay:</strong> {debugInfo.applePayAvailable ? 'Available' : 'Not Available'}
        </div>
        <div>
          <strong>Payment Request:</strong> {debugInfo.paymentRequestSupported ? 'Supported' : 'Not Supported'}
        </div>
        {debugInfo.error && (
          <div className="text-red-600">
            <strong>Error:</strong> {debugInfo.error}
          </div>
        )}
        <div className="text-gray-500 text-xs mt-2">
          Updated: {debugInfo.timestamp?.slice(11, 19)}
        </div>
      </div>
      <Button
        onClick={async () => {
          const stripe = await stripePromise;

          if (!stripe) return;

          try {
            const paymentRequest = stripe.paymentRequest({
              country: "US",
              currency: "usd",
              total: {
                label: "Test Payment",
                amount: 999,
              },
              requestPayerName: true,
              requestPayerEmail: true,
            });

            const result = await paymentRequest.canMakePayment();

            if (result) {
              paymentRequest.show();
            } else {
              throw new Error("Payment Request not available (no Apple Pay / Google Pay)");
            }

            toast({
              title: "Payment UI Triggered",
              description: "Check your device for payment popup",
            });
          } catch (error: any) {
            toast({
              title: "Test Failed",
              description: error.message,
              variant: "destructive",
            });
          }
        }}
        className="w-full mt-3 text-xs py-1"
      >
        Test Payment Request
      </Button>
    </div>
  );
}