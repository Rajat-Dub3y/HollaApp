import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { useAuth } from "./hooks/useAuth";

interface GeneratedReply {
  reply: string;
  confidence: number;
}

function SimpleMessageInput() {
  const [message, setMessage] = useState("");
  const [selectedTone, setSelectedTone] = useState<"confident" | "funny" | "flirty" | "creative">("confident");
  const [replies, setReplies] = useState<GeneratedReply[]>([]);
  const [loading, setLoading] = useState(false);
  const [testMode, setTestMode] = useState<"basic" | "premium">("basic");
  const { isPremium } = useAuth();
  
  // Override isPremium for testing
  const effectiveIsPremium = testMode === "premium" || isPremium;

  const toneOptions = [
    { value: "confident", emoji: "😎", label: "Confident", isPremium: false },
    { value: "funny", emoji: "😂", label: "Funny", isPremium: false },
    { value: "flirty", emoji: "👀", label: "Flirty", isPremium: false },
    { value: "creative", emoji: "🧠", label: "Creative", isPremium: true },
  ] as const;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      alert("Please enter a message");
      return;
    }

    if (selectedTone === "creative" && !effectiveIsPremium) {
      alert("Creative tone requires Premium subscription");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/generate-replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim(), tone: selectedTone, language: "en" })
      });
      
      const data = await response.json();
      if (data.success) {
        setReplies(data.replies);
      } else {
        alert("Failed to generate replies");
      }
    } catch (error) {
      alert("Error generating replies");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Holla™ - AI Dating Coach</h1>
      
      {/* Test Mode Toggle */}
      <div style={{ 
        textAlign: "center", 
        marginBottom: "30px", 
        padding: "15px", 
        background: "#f0f9ff", 
        border: "1px solid #0ea5e9", 
        borderRadius: "8px" 
      }}>
        <div style={{ marginBottom: "10px", fontWeight: "bold" }}>Test Mode:</div>
        <button
          onClick={() => setTestMode(testMode === "basic" ? "premium" : "basic")}
          style={{
            padding: "8px 16px",
            background: testMode === "premium" ? "#10b981" : "#6b7280",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          {testMode === "premium" ? "Premium Account ✓" : "Basic Account"}
        </button>
        <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
          Click to toggle between basic and premium access
        </div>
      </div>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
            Paste Her Message:
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Hey! How's your day going? 😊"
            style={{
              width: "100%",
              height: "100px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "16px"
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
            Choose Your Tone:
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px" }}>
            {toneOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  if (option.isPremium && !effectiveIsPremium) {
                    alert("Premium feature - upgrade required");
                    return;
                  }
                  setSelectedTone(option.value);
                }}
                disabled={option.isPremium && !effectiveIsPremium}
                style={{
                  padding: "15px",
                  border: selectedTone === option.value ? "2px solid #7C3AED" : "1px solid #ccc",
                  borderRadius: "8px",
                  background: selectedTone === option.value ? "#f3f4f6" : "white",
                  cursor: option.isPremium && !effectiveIsPremium ? "not-allowed" : "pointer",
                  opacity: option.isPremium && !effectiveIsPremium ? 0.6 : 1,
                  position: "relative"
                }}
              >
                <div style={{ fontSize: "24px", marginBottom: "5px" }}>{option.emoji}</div>
                <div style={{ fontWeight: "bold" }}>{option.label}</div>
                {option.isPremium && (
                  <div style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                    background: "#FACC15",
                    color: "black",
                    fontSize: "10px",
                    padding: "2px 6px",
                    borderRadius: "10px",
                    fontWeight: "bold"
                  }}>
                    PREMIUM
                  </div>
                )}
                {option.isPremium && !effectiveIsPremium && (
                  <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "20px"
                  }}>
                    🔒
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px",
            background: "#7C3AED",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Generating..." : "Generate Replies"}
        </button>
      </form>

      {replies.length > 0 && (
        <div>
          <h3 style={{ marginBottom: "20px" }}>Your AI-Generated Replies:</h3>
          {replies.map((reply, index) => (
            <div
              key={index}
              style={{
                background: "#f8f9fa",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "8px",
                border: "1px solid #e9ecef"
              }}
            >
              <p style={{ margin: "0 0 10px 0", lineHeight: "1.5" }}>{reply.reply}</p>
              <div style={{ fontSize: "12px", color: "#666" }}>
                Confidence: {reply.confidence}%
              </div>
            </div>
          ))}
        </div>
      )}

      {!effectiveIsPremium && (
        <div style={{
          background: "#fff3cd",
          border: "1px solid #ffeaa7",
          padding: "15px",
          borderRadius: "8px",
          marginTop: "20px",
          textAlign: "center"
        }}>
          <h4 style={{ margin: "0 0 10px 0" }}>Upgrade to Premium</h4>
          <p style={{ margin: "0 0 15px 0" }}>Unlock creative tone and Pattern Interrupt Engine</p>
          <a
            href="/subscribe"
            style={{
              background: "#FACC15",
              color: "black",
              padding: "10px 20px",
              textDecoration: "none",
              borderRadius: "6px",
              fontWeight: "bold"
            }}
          >
            Upgrade Now
          </a>
        </div>
      )}
    </div>
  );
}

export default function SimpleApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <SimpleMessageInput />
    </QueryClientProvider>
  );
}