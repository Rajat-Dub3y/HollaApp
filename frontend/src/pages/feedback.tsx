import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Feedback() {
  const [email, setEmail] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const feedbackMutation = useMutation({
    mutationFn: async (data: { email: string; feedbackType: string; message: string }) => {
      const response = await apiRequest("POST", "/api/feedback", data);
      return response.json();
    },
    onSuccess: () => {
      setEmail("");
      setFeedbackType("");
      setMessage("");
      toast({
        title: "Feedback Submitted!",
        description: "Thanks for helping us improve Holla™. We'll review your feedback within 24 hours.",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Failed to submit feedback",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !feedbackType || !message) {
      toast({
        title: "All Fields Required",
        description: "Please fill in all fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    feedbackMutation.mutate({ email, feedbackType, message });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="text-center">
            <MessageCircle className="h-12 w-12 text-[#7C3AED] mx-auto mb-4" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#2563EB] bg-clip-text text-transparent mb-4">
              Share Your Feedback
            </h1>
            <p className="text-gray-600">
              Help us improve Holla™. Your feedback helps us build better features and fix issues quickly.
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
              />
            </div>

            <div>
              <Label htmlFor="feedbackType" className="block text-sm font-medium text-gray-700 mb-2">
                Feedback Type
              </Label>
              <Select value={feedbackType} onValueChange={setFeedbackType}>
                <SelectTrigger className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent">
                  <SelectValue placeholder="Select feedback type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai_replies_not_generating">AI replies not generating</SelectItem>
                  <SelectItem value="payment_billing_problem">Payment or billing problem</SelectItem>
                  <SelectItem value="login_auth_problem">Login/auth problem</SelectItem>
                  <SelectItem value="feature_not_working">Feature not working</SelectItem>
                  <SelectItem value="page_loading_error">Page loading error</SelectItem>
                  <SelectItem value="community_safety_report">Community safety report</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Your Feedback
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you think, what could be improved, or any issues you've encountered..."
                className="w-full h-32 bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={feedbackMutation.isPending}
              className="w-full bg-gradient-to-r from-[#7C3AED] to-[#2563EB] hover:from-[#6D28D9] hover:to-[#1D4ED8] py-4 rounded-xl font-semibold text-white transition-all duration-300"
            >
              {feedbackMutation.isPending ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Response time: We review all feedback within 24 hours and respond to actionable items.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}