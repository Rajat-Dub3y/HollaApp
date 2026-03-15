import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2, Globe, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

interface GeneratedReply {
  reply: string;
  confidence: number;
}

interface MessageInputProps {
  onRepliesGenerated: (replies: GeneratedReply[], tone: string) => void;
}

export default function MessageInput({ onRepliesGenerated }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [selectedTone, setSelectedTone] = useState<"confident" | "funny" | "flirty" | "creative">("confident");
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "hi">("en");
  const { toast } = useToast();
  const { isPremium } = useAuth();
  const [, setLocation] = useLocation();

  // Load language preference from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as "en" | "hi" | null;
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage when changed
  const handleLanguageChange = (language: "en" | "hi") => {
    setSelectedLanguage(language);
    localStorage.setItem('language', language);
  };

  const generateRepliesMutation = useMutation({
    mutationFn: async (data: { message: string; tone: string; language: string }) => {
      const response = await apiRequest("POST", "/api/generate-replies", data);
      return response.json();
    },
    onSuccess: (data) => {
      onRepliesGenerated(data.replies, data.tone);
      toast({
        title: "Replies Generated!",
        description: "Your AI-powered replies are ready.",
      });
    },
    onError: (error) => {
      // Check if this is a daily limit error and show custom message
      const errorMessage = error instanceof Error ? error.message : "Failed to generate replies";
      
      if (errorMessage.includes("Daily Limit Reached") || errorMessage.includes("Forbidden") || errorMessage.includes("403")) {
        toast({
          title: "Daily Limit Reached! Upgrade to Premium Now To Get Unlimited Replies!",
          description: "",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Generation Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: "Message Required",
        description: "Please paste the message she sent you first!",
        variant: "destructive",
      });
      return;
    }

    // Block premium features for non-premium users
    if (selectedTone === "creative" && !isPremium) {
      toast({
        title: "Premium Feature",
        description: "Creative tone requires Premium. Upgrade to access psychology-backed replies.",
        variant: "destructive",
      });
      setLocation("/subscribe");
      return;
    }

    generateRepliesMutation.mutate({ 
      message: message.trim(), 
      tone: selectedTone,
      language: selectedLanguage
    });
  };

  const toneOptions = [
    { value: "confident", emoji: "😎", label: "Confident", description: "Direct & assertive", isPremium: false },
    { value: "funny", emoji: "😂", label: "Funny", description: "Witty & charming", isPremium: false },
    { value: "flirty", emoji: "👀", label: "Flirty", description: "Playful & teasing", isPremium: false },
    { value: "creative", emoji: "🧠", label: "Creative", description: "Out-of-the-box thinking", isPremium: true },
  ] as const;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
        <Wand2 className="inline text-purple-600 mr-3" />
        Generate Your Reply
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="messageInput" className="block text-sm font-medium text-gray-700 mb-3">
            Paste The Message She Sent You
          </Label>
          <Textarea 
            id="messageInput"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Hey! How's your day going? 😊"
            className="w-full h-32 bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent resize-none"
          />
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-3">
            <Globe className="inline mr-2 h-4 w-4" />
            Choose Your Language
          </Label>
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">Hindi (Latin Script)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-600 mt-2">
            Get smart, flirty, high-quality replies in your language — same quality, same charm, all backed by real dating data.
          </p>
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-3">Choose Your Tone</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {toneOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  if (option.isPremium && !isPremium) {
                    toast({
                      title: "Premium Feature",
                      description: "Creative tone requires Premium subscription.",
                      variant: "destructive",
                    });
                    setLocation("/subscribe");
                    return;
                  }
                  setSelectedTone(option.value);
                }}
                disabled={option.isPremium && !isPremium}
                className={`bg-white hover:bg-purple-50 border rounded-xl p-4 transition-all duration-300 group relative ${
                  selectedTone === option.value 
                    ? 'border-[#7C3AED] bg-purple-50' 
                    : 'border-gray-300 hover:border-[#7C3AED]'
                } ${option.isPremium ? 'border-[#FACC15] bg-gradient-to-br from-yellow-50 to-orange-50' : ''} ${
                  option.isPremium && !isPremium ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {option.isPremium && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#FACC15] to-[#FBBF24] text-black text-xs font-bold px-2 py-1 rounded-full">
                    PREMIUM
                  </div>
                )}
                {option.isPremium && !isPremium && (
                  <div className="absolute top-2 right-2">
                    <Lock className="text-gray-600 h-5 w-5" />
                  </div>
                )}
                <div className="text-3xl mb-2">{option.emoji}</div>
                <div className="font-semibold text-gray-900">{option.label}</div>
                <div className="text-xs text-gray-600 mt-1">{option.description}</div>
                {option.isPremium && (
                  <div className="text-xs text-orange-600 mt-2 font-medium">Psychology-backed</div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        <div className="text-center">
          <Button 
            type="submit" 
            disabled={generateRepliesMutation.isPending}
            className="bg-gradient-to-r from-[#7C3AED] to-[#2563EB] hover:from-[#6D28D9] hover:to-[#1D4ED8] px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {generateRepliesMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Replies
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
