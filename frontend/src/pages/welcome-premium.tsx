import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Star, Zap, Heart } from "lucide-react";
import { useLocation } from "wouter";

export default function WelcomePremium() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Mark user as premium in localStorage
    localStorage.setItem('userPremiumStatus', 'premium');
    
    // Get email from URL params if available
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    if (email) {
      localStorage.setItem('userEmail', email);
    }
  }, []);

  const handleContinue = () => {
    // Check if user came from specific flow
    const redirectTo = localStorage.getItem('postPaymentRedirect') || '/';
    localStorage.removeItem('postPaymentRedirect');
    setLocation(redirectTo);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Premium!
          </h1>
          <p className="text-gray-600">
            Your payment was successful and premium features are now active.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <Zap className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-700">20 AI-powered replies</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <Star className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-700">Advanced conversation insights</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
            <Heart className="w-5 h-5 text-pink-600" />
            <span className="text-sm text-gray-700">Personal dating coach access</span>
          </div>
        </div>

        <Button 
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          Start Using Premium Features
          <ArrowRight className="w-4 h-4" />
        </Button>

        <p className="text-xs text-gray-500 mt-4">
          You can manage your subscription anytime in your account settings.
        </p>
      </div>
    </div>
  );
}