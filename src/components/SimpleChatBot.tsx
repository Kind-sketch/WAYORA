import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const COLORS = {
  primary: '#ea580c',
  secondary: '#f97316',
  white: '#ffffff',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray400: '#9ca3af',
  gray600: '#4b5563',
  gray900: '#111827',
  green600: '#16a34a',
};

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
}

interface SimpleChatBotProps {
  visible: boolean;
  onClose: () => void;
}

export default function SimpleChatBot({ visible, onClose }: SimpleChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 Hi! I'm Tavi, your AI travel assistant! I can help you with travel tips, recommendations, budget planning, and much more. What would you like to explore today?",
      sender: 'bot',
      timestamp: new Date(),
      suggestions: ["Plan a trip to Paris", "Find budget restaurants", "Emergency services help", "Convert currency"]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const quickResponses = [
    "What's the weather like?",
    "Find nearby restaurants",
    "Emergency contacts",
    "Currency exchange rates",
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
      text: "� For emergencies, I can quickly help you find:\n\n� Nearby hospitals\n💊 24/7 pharmacies\n🏧 ATMs\n🚔 Police stations\n🚻 Restrooms\n📞 Embassy contacts\n\nJust share your location and I'll provide immediate assistance. Stay safe!",
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
    },
    "hello": {
      text: "Hello! How can I assist you with your travel plans today?",
      suggestions: ["Plan a trip", "Find restaurants", "Emergency help", "Budget advice"]
    },
    "help": {
      text: "I can help you with:\n\n🗺️ Trip planning & itineraries\n💰 Budget management\n🏨 Accommodation recommendations\n🍽️ Restaurant suggestions\n🆘 Emergency assistance\n🌍 Local insights & tips\n\nWhat would you like to explore?",
      suggestions: ["Plan a trip", "Find restaurants", "Emergency help", "Budget advice"]
    },
    "default": {
      text: "I'm here to help with all your travel needs! Ask me about destinations, budgeting, or recommendations.",
      suggestions: ["Plan a trip", "Find restaurants", "Emergency help", "Budget advice"]
    }
  };

  const generateResponse = (userMessage: string): any => {
    const message = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(botResponses)) {
      if (message.includes(key)) {
        return response;
      }
    }
    
    return botResponses.default;
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
    const userInput = inputValue;
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const responseData = generateResponse(userInput);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseData.text,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: responseData.suggestions
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.secondary]}
              style={styles.avatar}
            >
              <MaterialIcons name="psychology" size={20} color={COLORS.white} />
            </LinearGradient>
            <Text style={styles.title}>Tavi - AI Assistant</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={COLORS.gray600} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <ScrollView style={styles.messagesContainer}>
          {messages.map((message) => (
            <View key={message.id} style={styles.messageWrapper}>
              <View style={[
                styles.messageRow,
                message.sender === 'user' ? styles.userRow : styles.botRow
              ]}>
                <View style={[
                  styles.messageBubble,
                  message.sender === 'user' ? styles.userBubble : styles.botBubble
                ]}>
                  <Text style={[
                    styles.messageText,
                    message.sender === 'user' ? styles.userText : styles.botText
                  ]}>
                    {message.text}
                  </Text>
                </View>
              </View>
              
              {message.suggestions && (
                <View style={styles.suggestionsContainer}>
                  {message.suggestions.map((suggestion, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.suggestionButton}
                      onPress={() => handleSuggestionClick(suggestion)}
                    >
                      <Text style={styles.suggestionText}>{suggestion}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}

          {isTyping && (
            <View style={styles.messageRow}>
              <View style={styles.botBubble}>
                <Text style={styles.botText}>Tavi is typing...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Responses */}
        <View style={styles.quickResponsesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.quickResponses}>
              {quickResponses.map((response, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickResponseButton}
                  onPress={() => handleSuggestionClick(response)}
                >
                  <Text style={styles.quickResponseText}>{response}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask me anything..."
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <MaterialIcons name="send" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  closeButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.gray50,
  },
  messageWrapper: {
    marginBottom: 15,
  },
  messageRow: {
    marginBottom: 8,
  },
  userRow: {
    alignItems: 'flex-end',
  },
  botRow: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
  },
  botBubble: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray100,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: COLORS.white,
  },
  botText: {
    color: COLORS.gray900,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.gray100,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: COLORS.gray50,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  suggestionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray100,
    borderRadius: 16,
  },
  suggestionText: {
    fontSize: 12,
    color: COLORS.gray600,
  },
  quickResponsesContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
  },
  quickResponses: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
  },
  quickResponseButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.gray50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray100,
  },
  quickResponseText: {
    fontSize: 12,
    color: COLORS.gray600,
  },
});