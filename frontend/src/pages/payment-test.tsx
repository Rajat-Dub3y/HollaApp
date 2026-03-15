import React from 'react';
import PaymentTestComponent from "@/components/payment-test-component";

export default function PaymentTest() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-center mb-8">Payment System Test</h1>
        <PaymentTestComponent />
      </div>
    </div>
  );
}