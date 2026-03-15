import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Star, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareableCTAProps {
  generatedReply: string;
  onRatingSubmit: (rating: number) => void;
}

export default function ShareableCTA({ generatedReply, onRatingSubmit }: ShareableCTAProps) {
  const [rating, setRating] = useState(0);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const submitRatingMutation = useMutation({
    mutationFn: async (rating: number) => {
      const response = await apiRequest("POST", "/api/rate-reply", { rating, reply: generatedReply });
      return response.json();
    },
    onSuccess: () => {
      onRatingSubmit(rating);
      toast({
        title: "Rating Submitted!",
        description: "Thanks for helping us improve our AI responses.",
      });
    },
    onError: (error) => {
      toast({
        title: "Rating Failed",
        description: error instanceof Error ? error.message : "Failed to submit rating",
        variant: "destructive",
      });
    },
  });

  const handleRating = (newRating: number) => {
    setRating(newRating);
    submitRatingMutation.mutate(newRating);
  };

  const handleShare = async () => {
    const shareText = "Just got the perfect reply with Holla™ - AI that understands what she really wants to hear! 🔥";
    const shareUrl = `${window.location.origin}?ref=share`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Holla™ – Get Better Replies Instantly",
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // Fallback to clipboard
        handleCopyLink(shareUrl, shareText);
      }
    } else {
      handleCopyLink(shareUrl, shareText);
    }
  };

  const handleCopyLink = async (url: string, text: string) => {
    try {
      await navigator.clipboard.writeText(`${text}\n\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Link Copied!",
        description: "Share this with friends to help them get better replies too.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mt-6 border-2 border-[#7C3AED] bg-gradient-to-br from-purple-50 to-blue-50">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            How was this reply?
          </h3>
          <p className="text-gray-600 text-sm">
            Rate it to help train our AI for even better responses
          </p>
        </div>

        {/* Star Rating */}
        <div className="flex justify-center space-x-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRating(star)}
              disabled={submitRatingMutation.isPending}
              className={`transition-colors ${
                star <= rating 
                  ? "text-[#FACC15]" 
                  : "text-gray-400 hover:text-[#FACC15]"
              }`}
            >
              <Star 
                className="h-8 w-8" 
                fill={star <= rating ? "currentColor" : "none"}
              />
            </button>
          ))}
        </div>

        {/* Share Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="text-center mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              Get smarter replies like this
            </h4>
            <p className="text-gray-600 text-sm">
              Share Holla™ with friends and help them communicate with confidence too
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handleShare}
              className="flex-1 bg-gradient-to-r from-[#7C3AED] to-[#2563EB] hover:from-[#6D28D9] hover:to-[#1D4ED8] text-white"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share App
            </Button>
            
            <Button
              onClick={() => handleCopyLink(`${window.location.origin}?ref=share`, "Check out Holla™ - AI that helps you get better replies instantly!")}
              variant="outline"
              className="border-[#7C3AED] text-[#7C3AED] hover:bg-purple-50"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}