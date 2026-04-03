import { Button } from "@/components/ui/button";
import { Check, X, Crown, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";

export default function PremiumUpsell() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { isPremium, isPremiumPlus } = usePremiumAccess();
  
  // Check premium status from multiple sources for accurate display
  const hasActivePremium = isPremium || 
                          isPremiumPlus;
  // Don't show upsell if user already has premium subscription
  if (hasActivePremium) {
    return (
      <section id="pricing" className="py-8 bg-green-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Premium Active</h2>
            <p className="text-gray-600">You have full access to all premium features. Enjoy unlimited AI-powered replies and dating coach!</p>
          </div>
        </div>
      </section>
    );
  }

  const handleUpgrade = () => {
    setLocation("/subscribe");
  };

  const handleUpgradePremiumPlus = () => {
    toast({
      title: "Coming Soon!",
      description: "Premium Plus will be available soon. Stay tuned for the ultimate dating experience!",
    });
  };

  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            💬 Want <span className="text-purple-600">Stronger Replies</span> That Trigger Real Interest?
          </h2>
          <p className="text-xl text-gray-800 dark:text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Transform Your Online Conversations With AI-Powered Insights And Proven Response Strategies.
          </p>
        </div>
        
        {/* Comparison Cards */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12 justify-center items-stretch">
          
          {/* Free Plan */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 h-auto overflow-visible flex-1 min-w-0 max-w-sm">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Free (Basic)</h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">$0</div>
              <div className="text-gray-800 dark:text-gray-300">per month</div>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center space-x-3">
                <Check className="text-green-500 h-5 w-5" />
                <span className="text-gray-900 dark:text-white">2 Replies Per Day</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="text-green-500 h-5 w-5" />
                <span className="text-gray-900 dark:text-white">10 Saved Replies</span>
              </li>
              <li className="flex items-center space-x-3">
                <X className="text-red-500 h-5 w-5" />
                <span className="text-gray-800 dark:text-gray-300">No Vibe Check</span>
              </li>
              <li className="flex items-center space-x-3">
                <X className="text-red-500 h-5 w-5" />
                <span className="text-gray-800 dark:text-gray-300">Basic AI Responses</span>
              </li>
            </ul>
            
            <Button disabled className="w-full bg-gray-300 text-gray-600 cursor-not-allowed py-4 min-h-[60px] font-bold mb-4 whitespace-normal">
              You're on Basic
            </Button>
          </div>
          
          {/* Premium Plan */}
          <div className="bg-purple-50 border-2 border-[#7C3AED] rounded-2xl p-8 relative h-auto overflow-visible flex-1 min-w-0 max-w-sm">
            {/* Popular Badge */}
            <div className="absolute -top-3 right-4 bg-gradient-to-r from-[#7C3AED] to-[#2563EB] text-white text-xs font-bold px-3 py-1 rounded-full">
              RECOMMENDED
            </div>
            
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 text-[#7C3AED]">Premium</h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">$9.99</div>
              <div className="text-gray-800 dark:text-gray-300">per month</div>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center space-x-3">
                <Check className="text-green-500 h-5 w-5" />
                <span className="text-gray-900">Unlimited Replies</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="text-green-500 h-5 w-5" />
                <span className="text-gray-900">4 Advanced Tone Options</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="text-orange-500 h-5 w-5 flex items-center justify-center text-sm">🧠</div>
                <span className="text-gray-900 font-semibold">Creative Psychology-Backed Replies</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="text-green-500 h-5 w-5" />
                <span className="text-gray-900">Expert Dating Coach AI Training</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="text-green-500 h-5 w-5" />
                <span className="text-gray-900">Pattern Interrupt Techniques</span>
              </li>
            </ul>
            
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-[#7C3AED] to-[#2563EB] hover:from-[#6D28D9] hover:to-[#1D4ED8] text-white font-bold py-4 min-h-[60px] text-center transition-all duration-300 transform hover:scale-105 mb-4 whitespace-normal"
            >
              Upgrade to Premium
            </Button>
          </div>
          
          {/* Premium Plus */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-[#FACC15] rounded-2xl p-8 relative h-auto overflow-visible flex-1 min-w-0 max-w-sm">
            <div className="absolute -top-3 right-4 bg-[#FACC15] text-black text-xs font-bold px-3 py-1 rounded-full">
              COMING SOON
            </div>
            
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 text-[#FACC15]">Premium Plus</h3>
              <div className="text-4xl font-bold text-gray-900 mb-1">$24.99</div>
              <div className="text-gray-600">per month</div>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center space-x-3">
                <Check className="text-green-500 h-5 w-5" />
                <span className="text-gray-900 font-medium">🔓 Everything in Premium, plus:</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="text-green-500 h-5 w-5" />
                <span className="text-gray-900">🧠 Conversation Frameworks</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="text-green-500 h-5 w-5" />
                <span className="text-gray-900">🗣️ Expert Scripts</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="text-green-500 h-5 w-5" />
                <span className="text-gray-900">📚 Proven Techniques</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="text-green-500 h-5 w-5" />
                <span className="text-gray-900">💬 Conversation Frameworks</span>
              </li>

              <li className="flex items-center space-x-3">
                <Check className="text-green-500 h-5 w-5" />
                <span className="text-gray-900">🧠 Mastering the Psychology of Online Dating</span>
              </li>
            </ul>
            
            <Button 
              onClick={handleUpgradePremiumPlus}
              className="w-full bg-gradient-to-r from-[#FACC15] to-[#FBBF24] hover:from-[#F59E0B] hover:to-[#D97706] text-black font-bold py-4 min-h-[60px] text-center transition-all duration-300 transform hover:scale-105 mb-4 whitespace-normal"
            >
              Coming Soon
            </Button>
          </div>
        </div>
        
        {/* Feature Comparison */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-6 text-center text-gray-900">Basic Vs Premium: The Difference</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center mr-2">
                  🤖
                </div>
                Basic AI
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                Replies Generated From General Dating Insights And Common Conversation Patterns.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-purple-600 flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
                  🧠
                </div>
                Premium AI
              </h4>
              <p className="text-sm text-gray-900 leading-relaxed">
                Replies Based On <strong>Expert-Authored Texts</strong>, <strong>Analyzed Conversation Patterns</strong>, And <strong>Real Success Data</strong> From Top Dating Coaches, Psychology Books, And Proven Frameworks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
