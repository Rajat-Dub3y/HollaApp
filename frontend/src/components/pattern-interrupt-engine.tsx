import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Brain, Zap, Target, Lightbulb, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

interface PatternAnalysis {
  hiddenMeaning: string;
  recommendedTone: "confident" | "funny" | "flirty" | "creative";
  expertTip: string;
  patternInterrupt: string;
}

interface PatternInterruptEngineProps {
  onToneRecommended: (tone: "confident" | "funny" | "flirty" | "creative") => void;
}

export default function PatternInterruptEngine({ onToneRecommended }: PatternInterruptEngineProps) {
  const [message, setMessage] = useState("");
  const [analysis, setAnalysis] = useState<PatternAnalysis | null>(null);
  const { toast } = useToast();
  const { isPremium } = useAuth();
  const [, setLocation] = useLocation();

  const analyzeMutation = useMutation({
    mutationFn: async (messageToAnalyze: string) => {
      const response = await apiRequest("POST", "/api/pattern-interrupt", {
        message: messageToAnalyze,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysis(data);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Premium Required",
          description: "Pattern Interrupt Engine is a Premium feature. Please upgrade to access.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze message",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for development mode testing or actual premium status
    const isTestMode = process.env.NODE_ENV === 'development';
    const canAccess = isPremium || isTestMode;
    
    if (!canAccess) {
      toast({
        title: "Premium Feature",
        description: "Pattern Interrupt Engine requires Premium subscription.",
        variant: "destructive",
      });
      setLocation("/subscribe");
      return;
    }
    
    if (!message.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter her message to analyze",
        variant: "destructive",
      });
      return;
    }
    
    analyzeMutation.mutate(message.trim());
  };

  const handleUseTone = () => {
    if (analysis) {
      onToneRecommended(analysis.recommendedTone);
      toast({
        title: "Tone Applied",
        description: `Switched to ${analysis.recommendedTone} tone for maximum impact`,
      });
    }
  };

  const isTestMode = process.env.NODE_ENV === 'development';
  const canAccess = isPremium || isTestMode;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200 relative">
      {!canAccess && (
        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-2xl flex items-center justify-center z-10">
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <Lock className="h-8 w-8 text-gray-600 mx-auto mb-3" />
            <h4 className="font-bold text-gray-900 mb-2">Premium Feature</h4>
            <p className="text-sm text-gray-600">Unlock Pattern Interrupt Engine with Premium</p>
          </div>
        </div>
      )}
      
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
          <Brain className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Pattern Interrupt™ Engine</h3>
          <p className="text-sm text-gray-600">Decode her message and get the perfect response strategy</p>
        </div>
        {!canAccess && (
          <div className="ml-auto">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold px-3 py-1 rounded-full">
              PREMIUM
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="patternMessage" className="block text-sm font-medium text-gray-700 mb-2">
            Paste Her Message
          </Label>
          <textarea
            id="patternMessage"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Hey! How's your day going? 😊"
            rows={3}
            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
          />
        </div>

        <Button
          type="submit"
          disabled={analyzeMutation.isPending}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300"
        >
          {analyzeMutation.isPending ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              <span>Analyzing...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Analyze & Get Strategy</span>
            </div>
          )}
        </Button>
      </form>

      {analysis && (
        <div className="mt-6 space-y-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-start space-x-3">
              <Target className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">What She's Really Saying</h4>
                <p className="text-gray-700 text-sm">{analysis.hiddenMeaning}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-start space-x-3">
              <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Expert Strategy</h4>
                <p className="text-gray-700 text-sm mb-3">{analysis.expertTip}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Recommended tone:</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium capitalize">
                      {analysis.recommendedTone}
                    </span>
                  </div>
                  <Button
                    onClick={handleUseTone}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Use This Tone
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-200">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <Zap className="h-4 w-4 text-orange-600 mr-2" />
              Pattern Interrupt Suggestion
            </h4>
            <p className="text-gray-700 text-sm italic">"{analysis.patternInterrupt}"</p>
          </div>
        </div>
      )}
    </div>
  );
}