import React from 'react';
import { Button } from "@/components/ui/button";
import { Crown, CheckCircle, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

interface PremiumStatusCheckerProps {
  email: string;
  subscriptionStatus: string;
}

export default function PremiumStatusChecker({ email, subscriptionStatus }: PremiumStatusCheckerProps) {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    // Set premium status in localStorage for immediate access
    localStorage.setItem('userPremiumStatus', subscriptionStatus);
    localStorage.setItem('userEmail', email);
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Premium Already Active
          </h1>
          <p className="text-gray-600 mb-4">
            Great news! This email already has an active premium subscription.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center space-x-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">{email}</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Premium subscription status: {subscriptionStatus === 'premium_plus' ? 'Premium Plus' : 'Premium'}
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="text-left space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Unlimited AI-powered replies</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Advanced conversation insights</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Personal dating coach access</span>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleGoHome}
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          Access Premium Features
          <ArrowRight className="w-4 h-4" />
        </Button>

        <p className="text-xs text-gray-500 mt-4">
          All your premium features are ready to use immediately.
        </p>
      </div>
    </div>
  );
}