import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Copy, Bookmark, Check, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GeneratedReply {
  reply: string;
  confidence: number;
}

interface ResultsSectionProps {
  replies: GeneratedReply[];
  tone: "confident" | "funny" | "flirty" | "creative";
}

export default function ResultsSection({ replies, tone }: ResultsSectionProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [savedReplies, setSavedReplies] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const toneEmojis = {
    confident: "😎",
    funny: "😂", 
    flirty: "👀",
    creative: "🧠"
  };

  const handleCopyReply = async (replyText: string, index: number) => {
    try {
      await navigator.clipboard.writeText(replyText);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      toast({
        title: "Copied!",
        description: "Reply copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy reply to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleSaveReply = (replyText: string, index: number) => {
    // Check free tier limitation
    const currentSaved = JSON.parse(localStorage.getItem('holla-saved-replies') || '[]');
    if (currentSaved.length >= 10) {
      toast({
        title: "Save Limit Reached",
        description: "Free plan allows only 10 saved replies. Upgrade to Premium for 20 saves!",
        variant: "destructive",
      });
      return;
    }

    const savedReply = {
      text: replyText,
      tone,
      timestamp: Date.now()
    };

    currentSaved.push(savedReply);
    localStorage.setItem('holla-saved-replies', JSON.stringify(currentSaved));
    
    setSavedReplies(prev => {
      const newSet = new Set<number>();
      prev.forEach(item => newSet.add(item));
      newSet.add(index);
      return newSet;
    });
    
    toast({
      title: "Reply Saved!",
      description: "Added to your saved replies collection",
    });
  };

  return (
    <div className="glass-card rounded-2xl p-8 mb-8">
      <h3 className="text-xl font-bold mb-6 flex items-center">
        <Sparkles className="text-yellow-400 mr-3" />
        Your AI-Generated Replies
      </h3>
      
      <div className="space-y-4">
        {replies.map((reply, index) => (
          <div key={index} className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-purple-600/50 transition-colors group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{toneEmojis[tone]}</span>
                <span className="font-medium text-gray-100 capitalize">{tone}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSaveReply(reply.reply, index)}
                className={`opacity-0 group-hover:opacity-100 transition-all ${
                  savedReplies.has(index) ? 'text-purple-400' : 'text-gray-200 hover:text-purple-400'
                }`}
              >
                {savedReplies.has(index) ? <Check className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-white leading-relaxed mb-4">{reply.reply}</p>
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopyReply(reply.reply, index)}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                {copiedIndex === index ? (
                  <>
                    <Check className="mr-1 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
              <div className="text-xs text-gray-500">
                AI Confidence: <span className="text-green-400">{reply.confidence}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 bg-purple-50 border border-purple-200 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <Bookmark className="text-purple-600 h-5 w-5" />
          <div>
            <p className="text-sm text-purple-800">
              <span className="font-medium">Save Feature:</span> Click the bookmark icon on any reply to save it to your collection.
            </p>
            <p className="text-xs text-purple-600 mt-1">
              View all your saved replies in the "Saved Replies" tab above. Free users get 10 saves, Premium gets 20.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
