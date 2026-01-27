import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Sparkles, Info } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  tip?: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content: "Vanakkam! 🙏 I'm Wayora AI, your personal Tamil Nadu travel companion. How can I help you plan your journey today?",
  },
];

const sampleResponses: Record<string, { content: string; tip?: string }> = {
  "darshan": {
    content: "The best time for Darshan at Rameswaram Temple is:\n\n🌅 **Morning**: 5:00 AM - 12:00 PM (less crowded before 7 AM)\n\n🌙 **Evening**: 4:00 PM - 9:00 PM\n\nFor the famous 22 Theerthams (holy wells) bath, start early morning around 4:30 AM. The entire process takes 2-3 hours.",
    tip: "💡 Cultural Tip: Wear traditional attire (dhoti/saree) for temple entry. Remove footwear well before the main entrance."
  },
  "default": {
    content: "I can help you with:\n• Temple timings and rituals\n• Best routes between destinations\n• Local food recommendations\n• Festival dates and celebrations\n• Budget-friendly stays\n\nWhat would you like to know?",
  }
};

interface WayoraAssistantProps {
  onBack: () => void;
}

export const WayoraAssistant = ({ onBack }: WayoraAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("What is the best time for Darshan at Rameswaram?");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = input.toLowerCase().includes("darshan") || input.toLowerCase().includes("rameswaram")
        ? sampleResponses.darshan
        : sampleResponses.default;

      const assistantMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: response.content,
        tip: response.tip,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="min-h-full bg-background flex flex-col">
      <motion.header 
        className="flex items-center gap-3 px-5 py-4 bg-foreground text-background border-b-[1.5px] border-primary"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <button onClick={onBack} className="p-2 rounded-[7px] border-[1.5px] border-primary hover:bg-primary/20 transition-colors">
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[7px] bg-primary flex items-center justify-center">
            <Sparkles size={20} className="text-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Wayora AI</h1>
            <p className="text-[10px] font-tamil opacity-70">உங்கள் பயண உதவியாளர்</p>
          </div>
        </div>
      </motion.header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-32">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-[7px] border-[1.5px] border-foreground p-4 ${
                  message.role === "user"
                    ? "bg-foreground text-background"
                    : "bg-card"
                }`}
                style={{ boxShadow: "2px 2px 0px 0px hsl(var(--foreground))" }}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                {message.tip && (
                  <div className="mt-3 p-3 bg-primary/20 rounded-[7px] border-[1.5px] border-primary">
                    <div className="flex items-start gap-2">
                      <Info size={16} className="mt-0.5 text-primary" />
                      <p className="text-xs">{message.tip}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="brutalist-card p-4">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-4 bg-background border-t-[1.5px] border-foreground">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about Tamil Nadu..."
            className="brutalist-input flex-1"
          />
          <button
            onClick={handleSend}
            className="brutalist-btn-dark p-3"
            disabled={!input.trim()}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
