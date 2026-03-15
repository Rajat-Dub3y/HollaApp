import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function Contact() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
          <p className="text-xl text-gray-600">
            We're here to help with any questions or feedback
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-purple-50 rounded-xl p-8 text-center">
            <MessageCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-4">Chat With Romeo AI</h3>
            <p className="text-gray-600 mb-6">
              Get instant help with Romeo, our AI support assistant. Available 24/7 to answer questions about Holla features and troubleshooting.
            </p>
            <p className="text-sm text-gray-700">
              Look for the chat bubble in the bottom-right corner of any page
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-8 text-center">
            <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-4">Email Support</h3>
            <p className="text-gray-600 mb-6">
              For detailed questions, billing issues, or feature requests, reach out to our support team directly.
            </p>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>General Support:</strong> support@holla.com</p>
              <p><strong>Billing:</strong> billing@holla.com</p>
              <p><strong>Feedback:</strong> feedback@holla.com</p>
              <p><strong>Response Time:</strong> Usually within 24 hours</p>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Topics</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Technical Issues</h3>
              <p className="text-sm text-gray-600">
                AI not working, login problems, payment errors
              </p>
            </div>
            
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Feature Requests</h3>
              <p className="text-sm text-gray-600">
                New tone options, integrations, mobile app updates
              </p>
            </div>
            
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Account Management</h3>
              <p className="text-sm text-gray-600">
                Subscription changes, account deletion, data export
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}