import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import { useAuth } from "../hooks/useAuth";

interface GeneratedReply {
  reply: string;
  confidence: number;
}

export default function SimpleHome() {
  const [message, setMessage] = useState("");
  const [selectedTone, setSelectedTone] = useState<"confident" | "funny" | "flirty" | "creative">("confident");
  const [replies, setReplies] = useState<GeneratedReply[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPatternEngine, setShowPatternEngine] = useState(false);
  const { isPremium } = useAuth();

  const toneOptions = [
    { value: "confident", emoji: "😎", label: "Confident", description: "Direct & assertive", isPremium: false },
    { value: "funny", emoji: "😂", label: "Funny", description: "Witty & charming", isPremium: false },
    { value: "flirty", emoji: "👀", label: "Flirty", description: "Playful & teasing", isPremium: false },
    { value: "creative", emoji: "🧠", label: "Creative", description: "Psychology-backed", isPremium: true },
  ] as const;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      alert("Please enter a message");
      return;
    }

    if (selectedTone === "creative" && !isPremium) {
      alert("Creative tone requires Premium subscription. Click subscribe to upgrade!");
      window.location.href = "/subscribe";
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`api/generate-replies`, {
        method: "POST",
        credentials: "include",
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

  const handlePatternAnalysis = () => {
    if (!isPremium) {
      alert("Pattern Interrupt Engine requires Premium subscription. Click subscribe to upgrade!");
      window.location.href = "/subscribe";
      return;
    }
    setShowPatternEngine(true);
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px"
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ 
            fontSize: "48px", 
            fontWeight: "bold", 
            color: "white", 
            marginBottom: "10px",
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
          }}>
            Holla
          </h1>
          <p style={{ 
            fontSize: "20px", 
            color: "rgba(255,255,255,0.9)", 
            marginBottom: "20px" 
          }}>
            So You Always Get A Holla Back
          </p>
          
          {/* Navigation */}
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            gap: "20px", 
            flexWrap: "wrap",
            marginBottom: "20px"
          }}>
            <a href="/subscribe" style={{ 
              color: "white", 
              textDecoration: "none", 
              padding: "8px 16px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "20px",
              fontWeight: "bold"
            }}>Subscribe</a>
            <a href="/about" style={{ 
              color: "white", 
              textDecoration: "none", 
              padding: "8px 16px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "20px"
            }}>About</a>
            <a href="/help" style={{ 
              color: "white", 
              textDecoration: "none", 
              padding: "8px 16px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "20px"
            }}>Help</a>
            <a href="/contact" style={{ 
              color: "white", 
              textDecoration: "none", 
              padding: "8px 16px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "20px"
            }}>Contact</a>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ 
          background: "white", 
          borderRadius: "20px", 
          padding: "40px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          marginBottom: "30px"
        }}>
          <h2 style={{ 
            textAlign: "center", 
            marginBottom: "30px", 
            fontSize: "24px",
            color: "#333"
          }}>
            Generate Your Perfect Reply
          </h2>
          
          <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
            <div style={{ marginBottom: "25px" }}>
              <label style={{ 
                display: "block", 
                marginBottom: "10px", 
                fontWeight: "bold",
                color: "#333"
              }}>
                Paste Her Message:
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hey! How's your day going? 😊"
                style={{
                  width: "100%",
                  height: "120px",
                  padding: "15px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontFamily: "inherit",
                  resize: "vertical"
                }}
              />
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label style={{ 
                display: "block", 
                marginBottom: "15px", 
                fontWeight: "bold",
                color: "#333"
              }}>
                Choose Your Tone:
              </label>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", 
                gap: "15px" 
              }}>
                {toneOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      if (option.isPremium && !isPremium) {
                        alert("Premium feature - upgrade required");
                        window.location.href = "/subscribe";
                        return;
                      }
                      setSelectedTone(option.value);
                    }}
                    disabled={option.isPremium && !isPremium}
                    style={{
                      padding: "20px",
                      border: selectedTone === option.value ? "3px solid #7C3AED" : "2px solid #e5e7eb",
                      borderRadius: "12px",
                      background: selectedTone === option.value ? "#f3f4f6" : "white",
                      cursor: option.isPremium && !isPremium ? "not-allowed" : "pointer",
                      opacity: option.isPremium && !isPremium ? 0.6 : 1,
                      position: "relative",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {option.isPremium && (
                      <div style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        background: "#FACC15",
                        color: "black",
                        fontSize: "11px",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontWeight: "bold"
                      }}>
                        PREMIUM
                      </div>
                    )}
                    {option.isPremium && !isPremium && (
                      <div style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "24px"
                      }}>
                        🔒
                      </div>
                    )}
                    <div style={{ fontSize: "28px", marginBottom: "8px" }}>{option.emoji}</div>
                    <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "4px" }}>{option.label}</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>{option.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "18px",
                background: loading ? "#9ca3af" : "linear-gradient(135deg, #7C3AED, #2563EB)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {loading ? "Generating Amazing Replies..." : "✨ Generate Replies"}
            </button>
          </form>

          {/* Pattern Interrupt Engine */}
          <div style={{ 
            background: "linear-gradient(135deg, #667eea, #764ba2)", 
            padding: "20px", 
            borderRadius: "12px",
            marginBottom: "30px",
            position: "relative"
          }}>
            {!isPremium && (
              <div style={{
                position: "absolute",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                background: "rgba(0,0,0,0.3)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1
              }}>
                <div style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "10px",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "32px", marginBottom: "10px" }}>🔒</div>
                  <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>Premium Feature</h4>
                  <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>Unlock Pattern Interrupt Engine</p>
                </div>
              </div>
            )}
            <h3 style={{ color: "white", marginBottom: "10px", fontSize: "20px" }}>
              🧠 Pattern Interrupt™ Engine
            </h3>
            <p style={{ color: "rgba(255,255,255,0.9)", marginBottom: "15px" }}>
              Advanced psychology-backed message analysis
            </p>
            <button
              onClick={handlePatternAnalysis}
              disabled={!isPremium}
              style={{
                background: isPremium ? "white" : "rgba(255,255,255,0.3)",
                color: isPremium ? "#667eea" : "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: isPremium ? "pointer" : "not-allowed"
              }}
            >
              Analyze Message Pattern
            </button>
          </div>

          {/* Generated Replies */}
          {replies.length > 0 && (
            <div style={{ marginTop: "30px" }}>
              <h3 style={{ marginBottom: "20px", color: "#333" }}>
                ✨ Your AI-Generated Replies:
              </h3>
              {replies.map((reply, index) => (
                <div
                  key={index}
                  style={{
                    background: "#f8f9fa",
                    padding: "20px",
                    marginBottom: "15px",
                    borderRadius: "12px",
                    border: "1px solid #e9ecef",
                    borderLeft: "4px solid #7C3AED"
                  }}
                >
                  <p style={{ 
                    margin: "0 0 12px 0", 
                    lineHeight: "1.6", 
                    fontSize: "16px",
                    color: "#333"
                  }}>
                    {reply.reply}
                  </p>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center" 
                  }}>
                    <div style={{ fontSize: "13px", color: "#666" }}>
                      Confidence: {reply.confidence}%
                    </div>
                    <button style={{
                      background: "#7C3AED",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      cursor: "pointer"
                    }}>
                      Copy Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Premium Upgrade CTA */}
        {!isPremium && (
          <div style={{
            background: "linear-gradient(135deg, #FACC15, #FFA500)",
            padding: "30px",
            borderRadius: "15px",
            textAlign: "center",
            color: "black"
          }}>
            <h3 style={{ margin: "0 0 15px 0", fontSize: "24px" }}>Upgrade to Premium</h3>
            <p style={{ margin: "0 0 20px 0", fontSize: "16px" }}>
              Unlock Creative tone, Pattern Interrupt Engine, and 20 replies
            </p>
            <a
              href="/subscribe"
              style={{
                background: "black",
                color: "white",
                padding: "15px 30px",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "16px",
                display: "inline-block"
              }}
            >
              Upgrade Now - $9.99/month
            </a>
          </div>
        )}
      </div>
    </div>
  );
}