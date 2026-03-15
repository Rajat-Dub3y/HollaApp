import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, AlertTriangle, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Report() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    issueType: "",
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.issueType || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to report the issue.",
        variant: "destructive",
      });
      return;
    }

    // In production, this would send to support system
    console.log("Issue reported:", formData);
    
    toast({
      title: "Issue Reported",
      description: "Thank you for reporting this issue. Our team will investigate within 24 hours.",
    });
    
    setFormData({ email: "", issueType: "", description: "" });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back To Home
          </Button>
        </div>

        <div className="text-center mb-12">
          <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Report An Issue</h1>
          <p className="text-xl text-gray-600">
            Found a bug or technical problem? Let us know so we can fix it quickly.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Your Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="your@email.com"
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500"
                required
              />
            </div>

            <div>
              <Label htmlFor="issueType" className="block text-sm font-medium text-gray-700 mb-2">
                Issue Type
              </Label>
              <select
                id="issueType"
                value={formData.issueType}
                onChange={(e) => setFormData({...formData, issueType: e.target.value})}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
                required
              >
                <option value="">Select issue type</option>
                <option value="ai-not-working">AI replies not generating</option>
                <option value="payment-issue">Payment or billing problem</option>
                <option value="login-issue">Login or authentication problem</option>
                <option value="broken-feature">Feature not working properly</option>
                <option value="page-error">Page loading error</option>
                <option value="other">Other technical issue</option>
              </select>
            </div>

            <div>
              <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Describe The Issue
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Please describe what happened, what you expected to happen, and any error messages you saw..."
                className="w-full h-32 bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 resize-none"
                required
              />
            </div>

            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-xl"
            >
              Submit Issue Report
            </Button>
          </form>

          <div className="mt-12 bg-blue-50 rounded-xl p-6 text-center">
            <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Need Immediate Help?</h3>
            <p className="text-gray-600 mb-4">
              For urgent issues, chat with Romeo AI support (bottom-right corner) or email us directly.
            </p>
            <div className="text-sm text-gray-700">
              <p><strong>Email:</strong> support@holla.com</p>
              <p><strong>Response Time:</strong> Usually within 4 hours for technical issues</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}