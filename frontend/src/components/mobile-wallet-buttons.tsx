import { useState, useEffect } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Apple, Smartphone } from "lucide-react";

interface MobileWalletButtonsProps {
  email: string;
  onPaymentSuccess: () => void;
}

export default function MobileWalletButtons({ email, onPaymentSuccess }: MobileWalletButtonsProps) {
  const stripe = useStripe();
  const { toast } = useToast();
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [canMakeApplePayment, setCanMakeApplePayment] = useState(false);
  const [canMakeGooglePayment, setCanMakeGooglePayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Holla Premium - $9.99/month',
          amount: 999,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      // Check for payment method availability
      pr.canMakePayment().then((result) => {
        console.log('Payment request capabilities:', result);
        if (result) {
          setPaymentRequest(pr);
          setCanMakeApplePayment(!!result.applePay);
          setCanMakeGooglePayment(!!result.googlePay);
        }
      }).catch((err) => {
        console.log('Payment request error:', err);
      });

      pr.on('paymentmethod', async (ev) => {
        setIsProcessing(true);
        try {
          const response = await fetch('/api/standalone-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              email: email,
              amount: 999
            })
          });
          
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
            setTimeout(() => window.location.href = '/', 2000);
          } else {
            ev.complete('success');
            
            toast({
              title: "Welcome To Premium!",
              description: "You now have access to unlimited replies and advanced features.",
            });
            
            onPaymentSuccess();
          }
        } catch (error) {
          ev.complete('fail');
          toast({
            title: "Payment Error",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive",
          });
          setTimeout(() => window.location.href = '/', 2000);
        } finally {
          setIsProcessing(false);
        }
      });
    }
  }, [stripe, email, toast, onPaymentSuccess]);

  const handleApplePay = () => {
    if (paymentRequest && canMakeApplePayment) {
      paymentRequest.show();
    }
  };

  const handleGooglePay = () => {
    if (paymentRequest && canMakeGooglePayment) {
      paymentRequest.show();
    }
  };

  if (!canMakeApplePayment && !canMakeGooglePayment) {
    return null;
  }

  return (
    <div className="space-y-3 mb-6">
      <div className="text-center text-sm text-gray-600 mb-3">
        Quick Payment Options
      </div>
      
      <div className="flex gap-3">
        {canMakeApplePayment && (
          <Button
            onClick={handleApplePay}
            disabled={isProcessing}
            className="flex-1 bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Apple className="h-5 w-5" />
            {isProcessing ? 'Processing...' : 'Apple Pay'}
          </Button>
        )}
        
        {canMakeGooglePayment && (
          <Button
            onClick={handleGooglePay}
            disabled={isProcessing}
            className="flex-1 bg-[#4285f4] hover:bg-[#3367d6] text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Smartphone className="h-5 w-5" />
            {isProcessing ? 'Processing...' : 'Google Pay'}
          </Button>
        )}
      </div>
      
      <div className="text-center">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or pay with card</span>
          </div>
        </div>
      </div>
    </div>
  );
}