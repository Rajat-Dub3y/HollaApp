import { useState } from "react";
import { AlertCircle} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
 
export default function Cancel() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  // Replace with actual session user email (e.g. from auth context / props)
  // if using Firebase auth
    const { currentUser } = useAuth();
    const ACCOUNT_EMAIL = currentUser?.email ?? "";
 
  const isMatch = email.trim().toLowerCase() === ACCOUNT_EMAIL.toLowerCase();
  const hasTyped = email.trim().length > 0;
 
  const handleCancel = async () => {
    if (!isMatch) return;
    setIsLoading(true);
    setError(null);
 
    try {
      const res = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
 
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to cancel subscription");
      }
 
      setIsCancelled(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
 
  if (isCancelled) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
 
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Subscription cancelled
            </h1>
            <p className="text-lg text-gray-600">
              Your premium access has been removed
            </p>
          </div>
 
          <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md mx-auto shadow-sm text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="h-8 w-8 text-green-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
 
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              All done
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Your subscription has been successfully cancelled. You can
              resubscribe any time from the pricing page.
            </p>
 
            <Button
              onClick={() => (window.location.href = "/")}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300"
            >
              Back to home
            </Button>
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
 
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Cancel subscription
          </h1>
          <p className="text-lg text-gray-600">
            We're sorry to see you go
          </p>
        </div>
 
        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md mx-auto shadow-sm">
 
          {/* Icon + Title */}
          <div className="text-center mb-6">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
 
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Cancelling your premium plan
            </h2>
 
            <p className="text-gray-600 text-sm">
              This action will immediately end your premium access
            </p>
          </div>
 
          {/* Warning box */}
          <div className="mb-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <p className="text-sm font-semibold text-yellow-800 mb-2">
              Once cancelled, you will lose access to:
            </p>
            <ul className="space-y-1">
              {[
                "20 AI-generated replies",
                "Creative tone & advanced tones",
                "Romeo dating coach",
                "Saved replies & conversation history",
              ].map((item) => (
                <li
                  key={item}
                  className="text-sm text-yellow-700 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
 
          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200" />
          </div>
 
          {/* Confirmation input */}
          <div className="mb-5">
            <label className="block text-sm text-gray-600 mb-2">
              To confirm, type your email address{" "}
              <code className="text-xs bg-gray-100 border border-gray-300 rounded px-1.5 py-0.5 text-gray-800">
                {ACCOUNT_EMAIL}
              </code>{" "}
              below
            </label>
 
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              autoComplete="off"
              spellCheck={false}
              className={`w-full px-4 py-3 border rounded-xl font-mono text-sm focus:ring-2 focus:border-transparent transition-all ${
                hasTyped && isMatch
                  ? "border-red-400 focus:ring-red-200"
                  : hasTyped && !isMatch
                  ? "border-red-300 focus:ring-red-100"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
 
            {hasTyped && (
              <p
                className={`text-xs mt-1.5 ${
                  isMatch ? "text-green-600" : "text-red-500"
                }`}
              >
                {isMatch
                  ? "Email confirmed"
                  : "Email does not match your account"}
              </p>
            )}
          </div>
 
          {/* API error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-xs text-red-700 text-center">{error}</p>
            </div>
          )}
 
          {/* Cancel button */}
          <Button
            type="button"
            onClick={handleCancel}
            disabled={!isMatch || isLoading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              "I understand, cancel my subscription"
            )}
          </Button>
 
          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-200" />
            <span className="px-3 text-sm text-gray-400">or</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>
 
          {/* Keep subscription button */}
          <Button
            type="button"
            onClick={() => window.history.back()}
            className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-xl transition-all duration-300"
          >
            Keep my subscription
          </Button>
 
          {/* Footer note */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Cancellation is immediate · No partial refunds · Resubscribe anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}