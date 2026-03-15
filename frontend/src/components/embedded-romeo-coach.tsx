import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Send } from "lucide-react";

interface ChatMessage {
  type: 'user' | 'romeo';
  message: string;
  timestamp: Date;
}

export default function EmbeddedRomeoCoach() {
  const [coachMessages, setCoachMessages] = useState<ChatMessage[]>([
    {
      type: 'romeo',
      message: "Hey! I'm Romeo, your personal dating coach. I'm here to help you understand women better, build genuine connections, and master the psychology of attraction. What dating challenge can I help you with today?",
      timestamp: new Date(),
    }
  ]);
  const [coachInput, setCoachInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [coachMessages]);

  const coachMutation = useMutation({
    mutationFn: async (messageText: string) => {
      const response = await apiRequest("POST", "/api/romeo-dating-coach", {
        message: messageText,
      });
      return response.json();
    },
    onSuccess: (data) => {
      const romeoMessage: ChatMessage = {
        type: 'romeo',
        message: data.response,
        timestamp: new Date(),
      };
      setCoachMessages(prev => [...prev, romeoMessage]);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Premium Feature",
          description: "Romeo Dating Coach is exclusive to Premium members. Please upgrade to access expert dating insights.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Failed to reach Romeo",
        variant: "destructive",
      });
    },
  });

  const handleCoachSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachInput.trim()) return;

    const userMessage: ChatMessage = {
      type: 'user',
      message: coachInput.trim(),
      timestamp: new Date(),
    };

    setCoachMessages(prev => [...prev, userMessage]);
    coachMutation.mutate(coachInput.trim());
    setCoachInput("");
  };

  return (
    <div className="bg-white rounded-xl border border-red-200 h-96 flex flex-col">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">R</span>
          </div>
          <div>
            <h4 className="font-semibold">Romeo Dating Coach</h4>
            <p className="text-xs opacity-90">Expert dating psychology insights</p>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {coachMessages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl ${
              message.type === 'user' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 text-gray-900 border border-red-100'
            }`}>
              <p className="text-sm">{message.message}</p>
              <p className={`text-xs mt-1 ${
                message.type === 'user' ? 'text-red-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {coachMutation.isPending && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-2xl border border-red-100">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <form onSubmit={handleCoachSubmit} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={coachInput}
            onChange={(e) => setCoachInput(e.target.value)}
            placeholder="Ask Romeo about dating psychology, attraction, building connections..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            disabled={coachMutation.isPending}
          />
          <button
            type="submit"
            disabled={coachMutation.isPending || !coachInput.trim()}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Also available via the red heart chat button (bottom right) for a floating chat experience.
        </p>
      </form>
    </div>
  );
}