import { useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import LaunchReadyPayment from "@/components/launch-ready-payment";
import SimplePaymentForm from "@/components/simple-payment-form";
import MobilePaymentDebug from "@/components/mobile-payment-debug";



export default function NoOAuthSubscribe() {
  const [clientSecret, setClientSecret] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // First login with standalone auth to establish session
      const loginResponse = await apiRequest("POST", "/api/standalone-login", { email });
      const loginData = await loginResponse.json();
      
      if (!loginData.success) {
        throw new Error("Login failed");
      }

      // Create payment intent with established session
      const response = await apiRequest("POST", "/api/standalone-payment-intent", { 
        amount: 999, 
        email: email 
      });
      
      const data = await response.json();
      
      // Handle existing premium subscription
      if (response.status === 409 && data.error === 'already_premium') {
        toast({
          title: "Premium Already Active",
          description: "This email already has an active premium subscription. Please sign in to access your premium features.",
          variant: "default",
        });
        
        // Redirect to home page after showing message
        setTimeout(() => {
          setLocation("/");
        }, 3000);
        return;
      }
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setIsAuthenticated(true);
        toast({
          title: "Ready to Subscribe!",
          description: "Choose your payment method below",
        });
      } else {
        throw new Error(`Payment intent failed: ${JSON.stringify(data)}`);
      }
    } catch (error: any) {
      console.error("Payment setup error:", error);
      
      // Handle errors that occur during fetch or JSON parsing
      let errorMessage = "Please try again or contact support";
      if (error?.message?.includes("Failed to fetch")) {
        errorMessage = "Network error - please check your connection";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Setup Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            <p className="text-lg text-gray-600">Simple email entry, no account permissions required</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Start</h2>
              <p className="text-gray-600">Enter your email to begin subscription</p>
              <p className="text-sm text-green-600 mt-2">No complex permissions or account setup</p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <Button
                type="submit"
                disabled={isLoading || !email}
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
            </form>

            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs text-green-700 text-center">
                Direct payment setup - no account verification or data access required
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        
        <SimplePaymentForm email={email} clientSecret={clientSecret} />
        
        {/* Debug panel for mobile payment testing */}
        <MobilePaymentDebug />
      </div>
    </div>
  );
}