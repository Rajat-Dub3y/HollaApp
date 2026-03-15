import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Heart, Send, Crown, MessageCircle, X } from "lucide-react";

interface ChatMessage {
  type: 'user' | 'romeo';
  message: string;
  timestamp: Date;
}

export default function RomeoDateingCoach() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      type: 'romeo',
      message: "Hey! I'm Romeo, your personal dating coach. I'm here to help you understand women better, build genuine connections, and master the psychology of attraction. What dating challenge can I help you with today?",
      timestamp: new Date(),
    }
  ]);
  const { toast } = useToast();

  const chatMutation = useMutation({
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
      setChatHistory(prev => [...prev, romeoMessage]);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      type: 'user',
      message: message.trim(),
      timestamp: new Date(),
    };

    setChatHistory(prev => [...prev, userMessage]);
    chatMutation.mutate(message.trim());
    setMessage("");
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-24 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all duration-300 premium-glow"
        >
          <div className="flex flex-col items-center">
            <Heart className="h-5 w-5" />
            <Crown className="h-3 w-3 -mt-1" />
          </div>
        </Button>
        <div className="absolute -top-12 right-0 bg-black text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
          Speak to Romeo - Dating Master
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 h-96 bg-white border border-red-200 rounded-2xl shadow-xl flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Heart className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold flex items-center">
              Romeo Dating Coach
              <Crown className="h-4 w-4 ml-2" />
            </h3>
            <p className="text-xs opacity-90">The Online Dating Master</p>
          </div>
        </div>
        <Button
          onClick={() => setIsOpen(false)}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 p-2"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((chat, index) => (
          <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              chat.type === 'user' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 text-gray-900 border border-red-100'
            }`}>
              <p className="text-sm">{chat.message}</p>
              <p className={`text-xs mt-1 ${
                chat.type === 'user' ? 'text-red-100' : 'text-gray-500'
              }`}>
                {chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {chatMutation.isPending && (
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
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask Romeo about dating psychology..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            disabled={chatMutation.isPending}
          />
          <Button
            type="submit"
            disabled={chatMutation.isPending || !message.trim()}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}