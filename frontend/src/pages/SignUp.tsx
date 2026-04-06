import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail, ArrowRight,Eye, EyeOff } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { signup, loginWithGoogle } = useAuth();

  const handleGoogleSignup = async () => {
  setIsLoading(true);

  try {
    await loginWithGoogle();

    toast({
      title: "Signed in with Google!",
      description: "Welcome 🎉",
    });

    setLocation("/"); // or "/subscribe"
  } catch (error: any) {
    console.error(error);

    toast({
      title: "Google Sign-in Failed",
      description: "Please try again",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (!password || password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await signup(email, password);

      toast({
        title: "Account Created!",
        description: "You are now signed in",
      });

      // 👉 redirect after signup
      setLocation("/"); // or "/subscribe"
    } catch (error: any) {
      console.error(error);

      let message = "Signup failed";

      if (error.code === "auth/email-already-in-use") {
        message = "Email already exists";
      } else if (error.code === "auth/weak-password") {
        message = "Password must be at least 6 characters";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email address";
      }

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Get Premium Access
          </h1>
          <p className="text-lg text-gray-600">
            Create your account to unlock all features
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md mx-auto shadow-sm">
          
          {/* Icon + Title */}
          <div className="text-center mb-6">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>

            <p className="text-gray-600 text-sm">
              Start your premium journey in seconds
            </p>
          </div>

          {/* Google Button */}
          <Button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-3 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <Input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <Button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  Create Account <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Footer Note */}
          <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-700 text-center">
              Secure signup • No spam • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}