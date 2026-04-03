import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
 
export default function Footer() {
  const [email, setEmail] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const { toast } = useToast();
 
  useEffect(() => {
    fetch("/api/session-user", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.subscriptionStatus === "premium" || data?.subscriptionStatus === "premium_plus") {
          setIsPremium(true);
        }
      })
      .catch(() => null);
  }, []);
 
  const newsletterMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest("POST", "/api/newsletter-signup", { email });
      return response.json();
    },
    onSuccess: () => {
      setEmail("");
      toast({
        title: "Thanks for subscribing!",
        description: "We'll keep you updated on new features and Premium Plus launch.",
      });
    },
    onError: (error) => {
      toast({
        title: "Subscription Failed",
        description: error instanceof Error ? error.message : "Failed to subscribe",
        variant: "destructive",
      });
    },
  });
 
  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
 
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address!",
        variant: "destructive",
      });
      return;
    }
 
    newsletterMutation.mutate(email);
  };
 
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
 
        {/* Newsletter Signup */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold mb-4 text-gray-900">
            Ready to level up your online dating game?
          </h3>
          <p className="text-gray-600 mb-6">
            🔔 Stay Updated: Get Dating Tips, Feature Drops & Premium Plus Early Access.
          </p>
 
          <form onSubmit={handleNewsletterSignup} className="max-w-lg mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
              />
              <Button
                type="submit"
                disabled={newsletterMutation.isPending}
                className="bg-gradient-to-r from-[#7C3AED] to-[#2563EB] hover:from-[#6D28D9] hover:to-[#1D4ED8] px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 whitespace-nowrap"
              >
                {newsletterMutation.isPending ? "..." : "🔥 Subscribe"}
              </Button>
            </div>
          </form>
        </div>
 
        {/* Footer Links */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
 
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="text-white text-sm" />
              </div>
              <span className="text-lg font-bold gradient-text">Holla™</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Helping You Build Meaningful Connections Through Respectful, AI-Powered Communication.
            </p>
          </div>
 
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Product</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><a href="#features" className="hover:text-gray-900 transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a></li>
              <li><a href="/how-it-works" className="hover:text-gray-900 transition-colors">How It Works</a></li>
              <li><a href="/success-stories" className="hover:text-gray-900 transition-colors">Success Stories</a></li>
            </ul>
          </div>
 
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Support</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><a href="/help" className="hover:text-gray-900 transition-colors">Help Center</a></li>
              <li><a href="/contact" className="hover:text-gray-900 transition-colors">Contact Us</a></li>
              <li><a href="/report" className="hover:text-gray-900 transition-colors">Report Issue</a></li>
              <li><a href="/feedback" className="hover:text-gray-900 transition-colors">Feedback</a></li>
              {isPremium && (
                <li>
                  <a href="/cancel" className="hover:text-gray-900 transition-colors">
                    Cancel Subscription
                  </a>
                </li>
              )}
            </ul>
          </div>
 
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Legal</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><a href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-gray-900 transition-colors">Terms Of Service</a></li>
              <li><a href="/refund-policy" className="hover:text-gray-900 transition-colors">Refund Policy</a></li>
              <li><a href="/about" className="hover:text-gray-900 transition-colors">About Holla™</a></li>
              <li><a href="/guidelines" className="hover:text-gray-900 transition-colors">Community Guidelines</a></li>
            </ul>
          </div>
        </div>
 
        {/* Bottom Bar */}
        <div className="border-t border-gray-300 pt-8 text-center">
          <p className="text-gray-600 text-sm">
            © 2025 Holla™. All rights reserved. Made with ❤️ for respectful connections.
          </p>
        </div>
      </div>
    </footer>
  );
}