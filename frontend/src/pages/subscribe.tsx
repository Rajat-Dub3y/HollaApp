import { useStripe,PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Crown } from "lucide-react";
import { useLocation } from "wouter";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const SubscribeForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/welcome-premium",
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      setTimeout(() => window.location.href = '/', 2000);
    } else {
      // Activate premium status after successful payment
      try {
        await apiRequest("POST", "/api/activate-premium");
        toast({
          title: "Welcome To Premium!",
          description: "You now have access to unlimited replies and advanced features.",
        });
        setLocation("/welcome-premium");
      } catch (activationError) {
        console.error("Premium activation error:", activationError);
        setLocation("/");
      }
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8">
      <div className="text-center mb-8">
        <Crown className="h-12 w-12 text-purple-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Subscription</h2>
        <p className="text-gray-600">
          Get unlimited AI-powered replies and advanced conversation insights
        </p>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Secure Payment Options</h3>
        <div className="flex flex-wrap gap-3 text-sm text-blue-700">
          <span className="flex items-center gap-1">💳 Cards</span>
          <span className="flex items-center gap-1">📱 Digital Wallets</span>
          <span className="flex items-center gap-1">🔗 Bank Transfer</span>
        </div>
        <p className="text-xs text-blue-600 mt-2">Available options will appear based on your device and location</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <PaymentElement 
          options={{
            layout: "tabs"
          }}
        />
        <Button 
          type="submit" 
          disabled={!stripe || !elements}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 rounded-xl transition-all duration-300"
        >
          Subscribe To Premium - $9.99/month
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Secure payment powered by Stripe. Cancel anytime from your account settings.
        </p>
      </div>
    </div>
  );
};

export default function Subscribe() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Response Strategies.</h1>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 relative">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free (Basic)</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">$0</div>
              <p className="text-gray-600 mb-8">per month</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-gray-700">2 Replies Per Day</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-gray-700">10 Saved Replies</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">✕</span>
                </div>
                <span className="text-gray-500">No Vibe Check</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">✕</span>
                </div>
                <span className="text-gray-500">Basic AI Responses</span>
              </div>
            </div>

            <div className="bg-gray-100 text-gray-600 text-center py-3 rounded-lg font-medium">
              You're on Basic
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-2xl p-8 border-2 border-purple-500 relative transform scale-105 shadow-xl">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                RECOMMENDED
              </span>
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-purple-600 mb-2">Premium</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">$9.99</div>
              <p className="text-gray-600 mb-8">per month</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-gray-700">Unlimited Replies</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-gray-700">4 Advanced Tone Options</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">🧠</span>
                </div>
                <span className="text-gray-700">Creative Psychology-Backed Replies</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-gray-700">Expert Dating Coach AI Training</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-gray-700">Pattern Interrupt Techniques</span>
              </div>
            </div>

            <button 
              onClick={() => setLocation("/premium-checkout")}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-colors"
            >
              Upgrade to Premium
            </button>
          </div>

          {/* Premium Plus Plan */}
          <div className="bg-white rounded-2xl p-8 border border-yellow-400 relative opacity-75">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-yellow-500 text-black px-6 py-2 rounded-full text-sm font-bold">
                COMING SOON
              </span>
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-yellow-600 mb-2">Premium Plus</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">$24.99</div>
              <p className="text-gray-600 mb-8">per month</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-gray-700">
                  <span className="inline-block w-4 h-4 text-xs mr-1">🔓</span>
                  Everything in Premium, plus:
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-gray-700">
                  <span className="inline-block w-4 h-4 text-xs mr-1">📖</span>
                  Conversation Frameworks
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-gray-700">
                  <span className="inline-block w-4 h-4 text-xs mr-1">🗣️</span>
                  Expert Scripts
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-gray-700">
                  <span className="inline-block w-4 h-4 text-xs mr-1">📚</span>
                  Proven Techniques
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-gray-700">
                  <span className="inline-block w-4 h-4 text-xs mr-1">📖</span>
                  Conversation Frameworks
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-gray-700">
                  <span className="inline-block w-4 h-4 text-xs mr-1">🧠</span>
                  Mastering the Psychology of Online Dating
                </span>
              </div>
            </div>

            <div className="bg-yellow-100 text-yellow-800 text-center py-3 rounded-lg font-bold">
              Coming Soon
            </div>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="text-center mt-12">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back To Home
          </Button>
        </div>
      </div>
    </div>
  );
}