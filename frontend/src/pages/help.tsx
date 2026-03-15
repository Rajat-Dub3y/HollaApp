import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Crown, Settings, Mail } from "lucide-react";
import { useLocation } from "wouter";

export default function Help() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Help Center</h1>
          <p className="text-xl text-gray-600">
            Get help with Holla features and troubleshooting
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-50 rounded-xl p-6">
            <MessageCircle className="h-8 w-8 text-purple-600 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Getting Started</h3>
            <p className="text-gray-600 mb-4">
              Learn how to use Holla's AI reply generation and tone options
            </p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Paste the message she sent you</li>
              <li>• Choose your preferred tone (Confident, Funny, Flirty, or Creative)</li>
              <li>• Get 3 AI-generated reply options</li>
              <li>• Copy and send your chosen response</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <Crown className="h-8 w-8 text-orange-500 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Premium Features</h3>
            <p className="text-gray-600 mb-4">
              Unlock advanced AI capabilities with Premium subscription
            </p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Unlimited AI-generated replies</li>
              <li>• Creative psychology-backed responses</li>
              <li>• Expert dating coach AI training</li>
              <li>• Pattern interrupt techniques</li>
            </ul>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How does the AI generate replies?</h3>
                <p className="text-gray-700">
                  Our AI is trained on relationship psychology research, dating expertise, and proven communication principles. 
                  It analyzes the context and tone you select to generate authentic, engaging responses.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What makes Creative tone different?</h3>
                <p className="text-gray-700">
                  Creative tone uses advanced psychology principles to generate bold, unconventional responses that cut through 
                  small talk and create genuine intrigue. It's designed to move conversations beyond surface-level interactions.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I cancel my Premium subscription?</h3>
                <p className="text-gray-700">
                  Yes, you can cancel your Premium subscription at any time. Billing is handled through Stripe, 
                  and you'll continue to have access until the end of your current billing period.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Is my data secure?</h3>
                <p className="text-gray-700">
                  Yes, we use enterprise-grade security to protect your data. All payment processing is handled securely 
                  through Stripe, and we don't store credit card information.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl p-6 text-center">
            <Mail className="h-8 w-8 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Still Need Help?</h3>
            <p className="text-gray-600 mb-4">
              Chat with Romeo, our AI assistant, or contact our support team
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-700">Email: support@holla.com</p>
              <p className="text-sm text-gray-700">Response time: Usually within 24 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}