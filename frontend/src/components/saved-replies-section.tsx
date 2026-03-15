import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, Trash2, Copy, Check, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface SavedReply {
  text: string;
  tone: string;
  timestamp: number;
}

export default function SavedRepliesSection() {
  const [savedReplies, setSavedReplies] = useState<SavedReply[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const isPremium = (user as any)?.subscriptionStatus === "premium" || (user as any)?.subscriptionStatus === "premium_plus";
  const maxSavedReplies = isPremium ? "Unlimited" : "10";

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('holla-saved-replies') || '[]');
    setSavedReplies(saved);
  }, []);

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

  const handleDeleteReply = (index: number) => {
    const updated = savedReplies.filter((_, i) => i !== index);
    setSavedReplies(updated);
    localStorage.setItem('holla-saved-replies', JSON.stringify(updated));
    toast({
      title: "Reply Deleted",
      description: "Removed from your saved replies",
    });
  };

  const toneEmojis = {
    confident: "😎",
    funny: "😂",
    flirty: "👀",
    creative: "🧠"
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Bookmark className="text-purple-600 h-6 w-6" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">Your Saved Replies</h3>
            <p className="text-sm text-gray-600">
              {savedReplies.length}/{maxSavedReplies} Replies Saved
              {!isPremium && " (Basic Plan Limit)"}
            </p>
          </div>
        </div>
        
        {!isPremium && (
          <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-2 rounded-lg border border-purple-200">
            <Crown className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">
              Upgrade For Unlimited Saves
            </span>
          </div>
        )}
      </div>

      {savedReplies.length === 0 ? (
        <div className="text-center py-12">
          <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-500 mb-2">No Saved Replies Yet</h4>
          <p className="text-gray-400">
            Save Your Best Replies By Clicking The Bookmark Icon When Generating Responses
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedReplies.filter(reply => {
            // For Basic users, only show non-creative tone replies
            if (!isPremium && reply.tone === 'creative') {
              return false;
            }
            return true;
          }).map((reply, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-purple-300 transition-colors group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{toneEmojis[reply.tone as keyof typeof toneEmojis] || "💬"}</span>
                  <span className="font-medium text-gray-700 capitalize">{reply.tone}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(reply.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyReply(reply.text, index)}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    {copiedIndex === index ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteReply(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-gray-900 leading-relaxed">{reply.text}</p>
            </div>
          ))}
        </div>
      )}

      {!isPremium && savedReplies.length >= 8 && (
        <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <Crown className="text-purple-600 h-5 w-5" />
            <div>
              <p className="text-sm font-medium text-purple-800">
                You're close to your saved replies limit!
              </p>
              <p className="text-xs text-purple-600 mt-1">
                Upgrade to Premium to save unlimited replies and unlock advanced features.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}