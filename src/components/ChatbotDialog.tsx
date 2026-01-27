import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { 
  Send, 
  Mic, 
  MicOff, 
  Globe, 
  MapPin, 
  Clock, 
  DollarSign, 
  Camera,
  Bot,
  User,
  Sparkles
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
}

interface ChatbotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatbotDialog({ open, onOpenChange }: ChatbotDialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 Hi! I'm Tavi, your AI travel assistant! I can help you with travel tips, recommendations, budget planning, and much more. What would you like to explore today?",
      sender: 'bot',
      timestamp: new Date(),
      suggestions: [
        "Plan a trip to Paris",
        "Find budget restaurants in Tokyo",
        "Emergency services near me",
        "Convert currency"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("English");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const languages = ["English", "Spanish", "French", "German", "Japanese", "Mandarin"];

  const quickResponses = [
    "What's the weather like?",
    "Find nearby restaurants",
    "Emergency contacts",
    "Currency exchange rates",
    "Local customs & etiquette",
    "Transportation options"
  ];

  const botResponses: { [key: string]: any } = {
    "plan a trip": {
      text: "🗺️ I'd love to help you plan an amazing trip! To create the perfect itinerary, I'll need a few details:\n\n• Destination\n• Travel dates\n• Budget range\n• Travel style (adventure, relaxation, cultural, etc.)\n• Group size\n\nOnce I have these, I can suggest personalized recommendations for stays, activities, and hidden gems!",
      suggestions: ["Paris for 5 days", "Budget trip to Thailand", "Family vacation ideas"]
    },
    "paris": {
      text: "🇫🇷 Paris is magical! Here's what I recommend:\n\n🏛️ **Must-see**: Eiffel Tower, Louvre, Notre-Dame\n🍷 **Hidden gem**: Montmartre vineyards\n🥐 **Food**: Try a croissant at Pierre Hermé\n💰 **Budget tip**: Many museums are free on first Sundays\n🚇 **Transport**: Get a weekly Navigo pass\n\nWould you like specific recommendations for any category?",
      suggestions: ["Best cafes in Paris", "Free activities in Paris", "Paris museum pass info"]
    },
    "budget": {
      text: "💰 Smart budgeting is key to great travel! Here are my top tips:\n\n• Set a daily spending limit\n• Use OCR receipt scanning for easy tracking\n• Book accommodations in advance\n• Eat where locals eat\n• Use public transport\n• Look for free walking tours\n\nI can help you create a detailed budget breakdown for your trip!",
      suggestions: ["Calculate trip budget", "Money-saving tips", "Track expenses"]
    },
    "emergency": {
      text: "🆘 For emergencies, I can quickly help you find:\n\n🏥 Nearby hospitals\n💊 24/7 pharmacies\n🏧 ATMs\n🚔 Police stations\n🚻 Restrooms\n📞 Embassy contacts\n\nJust share your location and I'll provide immediate assistance. Stay safe!",
      suggestions: ["Find nearest hospital", "Embassy contacts", "Emergency phrases"]
    },
    "weather": {
      text: "🌤️ Current weather in your location: 22°C, partly cloudy\n\n📅 **3-day forecast:**\n• Today: 22°C, light rain in evening\n• Tomorrow: 25°C, sunny\n• Day 3: 20°C, cloudy\n\n☂️ Don't forget an umbrella for today evening!",
      suggestions: ["7-day forecast", "What to pack", "Weather alerts"]
    },
    "restaurant": {
      text: "🍽️ Great! I found some fantastic dining options near you:\n\n⭐ **Local favorites:**\n• Mama's Kitchen - Authentic local cuisine ($15-25)\n• Harbor View Café - Fresh seafood ($20-35)\n• Street Food Corner - Quick bites ($5-12)\n\n🕒 All open now! Would you like directions or reviews?",
      suggestions: ["Get directions", "See reviews", "Dietary restrictions"]
    },
    "currency": {
      text: "💱 **Current Exchange Rates:**\n\n• 1 USD = 0.85 EUR\n• 1 USD = 110.50 JPY\n• 1 USD = 1.25 GBP\n• 1 USD = 1.35 CAD\n\n📊 Based on live rates. I can also help you set up spending alerts in local currency!",
      suggestions: ["Set currency alerts", "Best exchange places", "Card vs cash tips"]
    }
  };

  const generateBotResponse = (userMessage: string): any => {
    const message = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(botResponses)) {
      if (message.includes(key)) {
        return response;
      }
    }
    
    // Default response
    return {
      text: "I understand you're looking for travel assistance! I can help with:\n\n🗺️ Trip planning & itineraries\n💰 Budget management\n🏨 Accommodation recommendations\n🍽️ Restaurant suggestions\n🆘 Emergency assistance\n🌍 Local insights & tips\n\nWhat specific area would you like help with?",
      suggestions: ["Plan a trip", "Find restaurants", "Emergency help", "Budget advice"]
    };
  };

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse.text,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: botResponse.suggestions
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    // In a real app, this would start/stop speech recognition
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="flex items-center gap-2">
                  Tavi - AI Travel Assistant
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Online • Responds instantly
                </DialogDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {currentLanguage}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const currentIndex = languages.indexOf(currentLanguage);
                  const nextIndex = (currentIndex + 1) % languages.length;
                  setCurrentLanguage(languages[nextIndex]);
                }}
              >
                🌐
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' 
                      ? 'bg-orange-600' 
                      : 'bg-gradient-to-r from-orange-500 to-pink-500'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-orange-600 text-white ml-auto'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="whitespace-pre-line">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {message.suggestions && (
                  <div className="flex flex-wrap gap-2 ml-11">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 p-3 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t pt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {quickResponses.map((response, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(response)}
                className="text-xs"
              >
                {response}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Ask me anything about travel..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={toggleVoice}
              className={isListening ? 'bg-red-100 text-red-600' : ''}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Button onClick={sendMessage} size="sm">
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>AI-powered responses</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              <span>50+ languages supported</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>24/7 availability</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}