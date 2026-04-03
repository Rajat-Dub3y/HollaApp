import { useState } from "react";
import DisclaimerSection from "@/components/disclaimer-section";
import MessageInput from "@/components/message-input";
import ResultsSection from "@/components/results-section";
import SavedRepliesSection from "@/components/saved-replies-section";
import PremiumUpsell from "@/components/premium-upsell";
import FeaturesSection from "@/components/features-section";
import Footer from "@/components/footer";
import RomeoChat from "@/components/romeo-chat";
import PatternInterruptEngine from "@/components/pattern-interrupt-engine";
import { useAuth } from "@/contexts/AuthContext";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";
import { MessageSquare, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { analytics } from "@/lib/analytics";
import { Link } from "wouter";

interface GeneratedReply {
  reply: string;
  confidence: number;
}

export default function Home() {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [generatedReplies, setGeneratedReplies] = useState<GeneratedReply[]>([]);
  const [selectedTone, setSelectedTone] = useState<"confident" | "funny" | "flirty" | "creative">("confident");
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState<"replies" | "saved" | "pattern" | "coach">("replies");
  const { currentUser, logout } = useAuth();
  console.log(currentUser)
  
  const { isPremium, isPremiumPlus } = usePremiumAccess();
  console.log("authPremium:", isPremium);

  const handleDisclaimerAccept = () => {
    setDisclaimerAccepted(true);
  };

  const handleRepliesGenerated = (replies: GeneratedReply[], tone: string) => {
    setGeneratedReplies(replies);
    setSelectedTone(tone as "confident" | "funny" | "flirty" | "creative");
    setShowResults(true);
    analytics.trackReplyGenerated(tone, isPremium);
  };

  const handleToneRecommended = (tone: "confident" | "funny" | "flirty" | "creative") => {
    setSelectedTone(tone);
    setActiveTab("replies");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation */}
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#7C3AED] to-[#2563EB] rounded-xl flex items-center justify-center">
                <MessageSquare className="text-white text-lg" />
              </div>
              <span className="text-2xl font-bold gradient-text">Holla™</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-800 hover:text-gray-900 transition-colors font-medium"
              >
                Features
              </button>
              <button 
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-800 hover:text-gray-900 transition-colors font-medium"
              >
                Pricing
              </button>
              {currentUser ? (
                
                <div className="flex items-center space-x-3">
                  
                  <span className="text-sm text-gray-900 font-medium">
                    Welcome, {currentUser.displayName || currentUser.email?.split('@')[0]}!
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="text-gray-600 border-gray-300"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  
                  <Link href="/login">
                    <Button className="text-black" variant="outline" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <button className="bg-[#7C3AED] hover:bg-[#6D28D9] px-6 py-2 rounded-lg font-medium transition-colors text-white">
                      Get Started
                    </button>
                  </Link>
                </div>
              )}
              
            </div>
            <div  className="block md:hidden  "> {
          !currentUser ? <Link href="/login">
                    <Button className="text-black" variant="outline" size="sm">
                      Sign In
                    </Button>
                  </Link>:
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="text-gray-600 border-gray-300"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                    
                  } </div>
            
          </nav>

          {/* Hero Section */}
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="gradient-text">Holla™</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-800 dark:text-gray-200 mb-12 font-light">
              So You Always Get A HollaBack 😎
            </p>
            
            {!disclaimerAccepted && (
              <DisclaimerSection onAccept={handleDisclaimerAccept} />
            )}
          </div>
        </div>
      </header>

      {/* Main App */}
      {disclaimerAccepted && (
        <main className="animate-fade-in">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Navigation Tabs */}
            <div className="mb-8">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab("replies")}
                  className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                    activeTab === "replies"
                      ? "bg-white text-[#7C3AED] shadow-sm"
                      : "text-gray-800 hover:text-gray-900"
                  }`}
                >
                  Reply Generator
                </button>
                <button
                  onClick={() => setActiveTab("saved")}
                  className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                    activeTab === "saved"
                      ? "bg-white text-[#7C3AED] shadow-sm"
                      : "text-gray-800 hover:text-gray-900"
                  }`}
                >
                  Saved Replies
                </button>
                {isPremium && (
                  <>
                    <button
                      onClick={() => setActiveTab("pattern")}
                      className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                        activeTab === "pattern"
                          ? "bg-white text-[#2563EB] shadow-sm"
                          : "text-gray-800 hover:text-gray-900"
                      }`}
                    >
                      Pattern Interrupt™
                    </button>
                    <button
                      onClick={() => setActiveTab("coach")}
                      className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                        activeTab === "coach"
                          ? "bg-white text-[#FACC15] shadow-sm"
                          : "text-gray-800 hover:text-gray-900"
                      }`}
                    >
                      Dating Coach
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Content based on active tab */}
            {activeTab === "replies" && (
              <>
                <MessageInput onRepliesGenerated={handleRepliesGenerated} />
                
                {showResults && (
                  <ResultsSection 
                    replies={generatedReplies} 
                    tone={selectedTone}
                  />
                )}
              </>
            )}

            {activeTab === "saved" && (
              <SavedRepliesSection />
            )}

            {activeTab === "pattern" && isPremium && (
              <div className="mt-8">
                <PatternInterruptEngine onToneRecommended={handleToneRecommended} />
              </div>
            )}

            {activeTab === "coach" && isPremium && (
              <div className="mt-8">
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">R</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Chat With Romeo - The Online Dating Master</h3>
                      <p className="text-sm text-gray-600">Get expert insights on attraction, rapport building, and emotional connection</p>
                    </div>
                  </div>
                  
                  {/* Embedded Romeo Dating Coach Chat */}
                </div>
              </div>
            )}
          </div>
        </main>
      )}

      {/* Premium Upsell */}
      <PremiumUpsell />

      {/* Features */}
      <FeaturesSection />

      {/* Footer */}
      <Footer />
      
      {/* Romeo AI Chat*/} 
      <RomeoChat />
      
      {/*Romeo Dating Coach (Premium only) */}
      
      {/*<DevTestingPanel />*/}
    </div>
  );
}
