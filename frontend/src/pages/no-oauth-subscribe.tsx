import { useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import SimplePaymentForm from "@/components/simple-payment-form";
import MobilePaymentDebug from "@/components/mobile-payment-debug";
import { auth } from '@/lib/firebase';

export default function NoOAuthSubscribe() {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const firebaseUser = auth.currentUser;

  const handleStartPayment = async () => {
    if (!firebaseUser || !firebaseUser.email) {
      toast({
        title: "Not logged in",
        description: "Please login first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/create-subscription", {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
      });

      const data = await response.json();

      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setIsAuthenticated(true);
      } else {
        throw new Error("Failed to create subscription");
      }

    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to start payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 FIRST SCREEN (same UI, no email input)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back To Home
            </Button>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Subscribe to Premium</h1>
            <p className="text-lg text-gray-600">
              Continue with your account
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Start</h2>
              
              {/* 👇 show user email instead of input */}
              <p className="text-gray-600">
                {firebaseUser?.email}
              </p>

              <p className="text-sm text-green-600 mt-2">
                No extra input required
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleStartPayment}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    Continue to Payment <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs text-green-700 text-center">
                Secure checkout with your account email
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🔹 LOADING STATE
  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Setting up your payment...</p>
        </div>
      </div>
    );
  }

  // 🔹 PAYMENT SCREEN
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back To Home
          </Button>
        </div>
        
        <SimplePaymentForm 
          email={firebaseUser?.email || ""} 
          clientSecret={clientSecret} 
        />
        
        <MobilePaymentDebug />
      </div>
    </div>
  );
}