import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Mail, CreditCard, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Refund Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We want you to be completely satisfied with Holla. Here's our simple refund process.
            </p>
          </div>

          {/* Main Policy Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-blue-600" />
                7-Day Refund Window
              </CardTitle>
              <CardDescription>
                Get a full refund within 7 days of your purchase, no questions asked.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Refund Eligibility</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Premium and Premium Plus subscriptions are eligible for refunds within 7 days of purchase</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Refunds apply to the most recent billing cycle only</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Your subscription will be cancelled upon refund approval</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How to Request */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-6 w-6 text-blue-600" />
                How to Request a Refund
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <span className="font-bold text-blue-600">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Send Email</h3>
                  <p className="text-gray-600">Email us at support@holla-ai.com with your refund request</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <span className="font-bold text-blue-600">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Auto-Confirmation</h3>
                  <p className="text-gray-600">You'll receive an automatic confirmation email within minutes</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <span className="font-bold text-blue-600">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Processing</h3>
                  <p className="text-gray-600">Refunds are processed within 3-5 business days</p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">What to Include in Your Email:</h4>
                <ul className="text-yellow-700 space-y-1">
                  <li>• Your email address used for the subscription</li>
                  <li>• Reason for refund (optional)</li>
                  <li>• Any feedback to help us improve</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Processing Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-blue-600" />
                Processing Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Timeline</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Immediate: Auto-confirmation email sent</li>
                    <li>• Within 24 hours: Manual review completed</li>
                    <li>• 3-5 business days: Refund processed to original payment method</li>
                    <li>• Immediate: Subscription cancelled upon approval</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Payment Methods</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Credit/Debit Cards: 3-5 business days</li>
                    <li>• PayPal: 3-5 business days</li>
                    <li>• Google Pay: 3-5 business days</li>
                    <li>• Bank transfers may take longer</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <div className="text-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <a href="mailto:support@holla-ai.com?subject=Refund Request">
                Request Refund via Email
              </a>
            </Button>
            <p className="text-gray-500 mt-4">
              Need help? Visit our <Link href="/help" className="text-blue-600 hover:underline">Help Center</Link> or 
              <Link href="/contact" className="text-blue-600 hover:underline ml-1">Contact Support</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}