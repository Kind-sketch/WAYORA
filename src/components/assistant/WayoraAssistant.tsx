import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Sparkles, Info, Loader2 } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  tip?: string;
}

const SYSTEM_PROMPT = `You are Wayora AI, a friendly and knowledgeable travel assistant specializing in Tamil Nadu, India. 

Your personality:
- Begin responses with "Vanakkam" when appropriate
- Be warm, helpful, and culturally respectful
- Use Tamil words occasionally (with translations)
- Include emojis to make responses engaging

Your expertise includes:
- Temple timings, rituals, dress codes, and darshan tips
- Best routes between Tamil Nadu destinations
- Local cuisine and restaurant recommendations
- Festival dates and celebrations
- Budget-friendly accommodations
- Cultural etiquette and local customs
- Historical information about dynasties (Chola, Pandya, Pallava, Nayak)
- UNESCO World Heritage Sites in Tamil Nadu

When giving advice:
- Always include practical timings
- Mention any dress code requirements for temples
- Suggest the best time of day/year to visit
- Include a "Cultural Tip" when relevant
- Format responses with bullet points and bold text for readability

Keep responses concise but informative (2-3 paragraphs max).`;

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";

interface WayoraAssistantProps {
  onBack: () => void;
}

export const WayoraAssistant = ({ onBack }: WayoraAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Vanakkam! 🙏 I'm Wayora AI, your personal Tamil Nadu travel companion. Ask me about temples, routes, local food, festivals, or anything about exploring Tamil Nadu!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "Wayora Travel App",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...conversationHistory,
            { role: "user", content: input },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantContent = data.choices?.[0]?.message?.content || "I apologize, I couldn't process that request. Please try again.";

      // Check if response contains a cultural tip
      const hasTip = assistantContent.toLowerCase().includes("cultural tip") ||
        assistantContent.toLowerCase().includes("💡") ||
        assistantContent.toLowerCase().includes("tip:");

      const assistantMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: assistantContent,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling OpenRouter:", error);

      const errorMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: "I'm having trouble connecting right now. Please check your internet connection and try again. 🙏",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    "Best time to visit Meenakshi Temple?",
    "Plan a 3-day Chennai to Madurai trip",
    "What to eat in Thanjavur?",
  ];

  return (
    <div className="min-h-full bg-background flex flex-col">
      {/* Header */}
      <motion.header
        className="flex items-center gap-3 px-5 py-4 bg-foreground text-background border-b border-primary/30 sticky top-0 z-50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <button
          onClick={onBack}
          className="p-2 rounded-xl border border-primary/50 hover:bg-primary/20 transition-colors"
        >
          <ArrowLeft size={20} strokeWidth={2} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Sparkles size={20} className="text-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Wayora AI</h1>
            <p className="text-[10px] font-tamil opacity-70">உங்கள் பயண உதவியாளர்</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1 text-xs opacity-70">
          <span className="w-2 h-2 rounded-full bg-green-400"></span>
          Online
        </div>
      </motion.header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-40">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 ${message.role === "user"
                  ? "bg-primary text-foreground"
                  : "glass-card border border-foreground/10"
                  }`}
              >
                <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="glass-card p-4 border border-foreground/10 rounded-2xl">
              <div className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Suggested questions (show only at start) */}
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <p className="text-xs text-muted-foreground">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="px-3 py-2 text-xs bg-secondary hover:bg-muted rounded-xl border border-foreground/10 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-4 bg-background/80 backdrop-blur-xl border-t border-foreground/10">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Tamil Nadu..."
            className="brutalist-input flex-1"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            className="brutalist-btn-primary p-3 rounded-xl disabled:opacity-50"
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
