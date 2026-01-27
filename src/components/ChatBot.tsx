import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#ea580c',
  secondary: '#f97316',
  white: '#ffffff',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray400: '#9ca3af',
  gray600: '#4b5563',
  gray700: '#374151',
  gray900: '#111827',
  blue50: '#eff6ff',
  blue600: '#2563eb',
  green50: '#f0fdf4',
  green600: '#16a34a',
  orange50: '#fff7ed',
  orange600: '#ea580c',
  red50: '#fef2f2',
  red600: '#dc2626',
};

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
}

interface ChatBotProps {
  visible: boolean;
  onClose: () => void;
}

export default function ChatBot({ visible, onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 Hi! I'm Tavi, your AI travel assistant! I can help you with travel tips, recommendations, budget planning, and much more. What would you like to explore today?",
      sender: 'bot',
      timestamp: new Date(),
      suggestions: [
        "Plan a trip to Paris",
        "Find budget restaurants",
        "Emergency services help",
        "Convert currency"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

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
    },
    "transportation": {
      text: "🚗 Transportation options in your area:\n\n🚇 **Metro**: €1.90 per ride, day passes available\n🚕 **Taxi**: Starting at €3.50, €1.20/km\n🚲 **Bike Share**: €1/30min, stations everywhere\n🚌 **Bus**: €1.70 per ride, runs 6am-11pm\n🛵 **Scooter**: €0.25/min, download CityScoot app\n\nWhich option interests you most?",
      suggestions: ["Metro routes", "Book a taxi", "Bike rental spots"]
    },
    "food": {
      text: "🍴 Local food scene is amazing! Here's what to try:\n\n🥖 **Must-try local dishes:**\n• Coq au Vin - Traditional French chicken\n• Ratatouille - Vegetable stew\n• Crème Brûlée - Classic dessert\n\n👨‍🍳 **Best food areas:**\n• Le Marais - Traditional bistros\n• Latin Quarter - Student-friendly prices\n• Montmartre - Romantic dining\n\nAny dietary restrictions I should know about?",
      suggestions: ["Vegetarian options", "Budget meals", "Fine dining"]
    },
    "scan": {
      text: "📱 I see you're interested in receipt scanning! Our AI-powered scanner can:\n\n✨ **Smart Features:**\n• Auto-detect bill amounts\n• Categorize expenses automatically\n• Extract merchant details\n• Multi-currency support\n\n💡 Just go to Budget → Scan Receipt to try it! It's already built into your Wayora app.",
      suggestions: ["Budget tips", "Expense tracking", "Currency conversion"]
    },
    "wayora": {
      text: "🏠 Welcome to Wayora! I'm here to help you make the most of your travel experience:\n\n🔥 **Popular Features:**\n• AI Trip Planning\n• Smart Budget Tracking\n• Receipt Scanning\n• Emergency Services\n• Local Recommendations\n\n🎯 What would you like to explore first?",
      suggestions: ["Plan a new trip", "Track expenses", "Find restaurants", "Emergency help"]
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
    if (!isListening) {
      Alert.alert(
        '🎤 Voice Input',
        'Voice recognition activated! Speak your question and I\'ll help you with your travel needs.',
        [{ text: 'Stop Listening', onPress: () => setIsListening(false) }]
      );
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.botInfo}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                style={styles.botAvatar}
              >
                <MaterialIcons name="psychology" size={24} color={COLORS.white} />
              </LinearGradient>
              <View style={styles.botDetails}>
                <View style={styles.titleRow}>
                  <Text style={styles.botName}>Tavi - AI Travel Assistant</Text>
                  <View style={styles.onlineIndicator} />
                </View>
                <Text style={styles.botStatus}>Online • Responds instantly</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={COLORS.gray600} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.messagesContent}>
            {messages.map((message) => (
              <View key={message.id} style={styles.messageWrapper}>
                <View style={[
                  styles.messageContainer,
                  message.sender === 'user' ? styles.userMessageContainer : styles.botMessageContainer
                ]}>
                  <View style={[
                    styles.messageAvatar,
                    message.sender === 'user' ? styles.userAvatar : styles.botMessageAvatar
                  ]}>
                    {message.sender === 'user' ? (
                      <MaterialIcons name="person" size={16} color={COLORS.white} />
                    ) : (
                      <LinearGradient
                        colors={[COLORS.primary, COLORS.secondary]}
                        style={styles.avatarGradient}
                      >
                        <MaterialIcons name="psychology" size={16} color={COLORS.white} />
                      </LinearGradient>
                    )}
                  </View>
                  
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
                    <Text style={[
                      styles.messageTime,
                      message.sender === 'user' ? styles.userTime : styles.botTime
                    ]}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
              <View style={styles.messageContainer}>
                <View style={[styles.messageAvatar, styles.botMessageAvatar]}>
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.secondary]}
                    style={styles.avatarGradient}
                  >
                    <MaterialIcons name="psychology" size={16} color={COLORS.white} />
                  </LinearGradient>
                </View>
                <View style={styles.typingBubble}>
                  <View style={styles.typingDots}>
                    <View style={[styles.dot, styles.dot1]} />
                    <View style={[styles.dot, styles.dot2]} />
                    <View style={[styles.dot, styles.dot3]} />
                  </View>
                </View>
              </View>
            )}
          </View>
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

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              placeholder="Ask me anything about travel..."
              placeholderTextColor={COLORS.gray400}
              value={inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={sendMessage}
              multiline
            />
            <TouchableOpacity
              style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
              onPress={toggleVoice}
            >
              <MaterialIcons 
                name={isListening ? "mic" : "mic-none"} 
                size={20} 
                color={isListening ? COLORS.red600 : COLORS.gray600} 
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={sendMessage}
              disabled={!inputValue.trim()}
            >
              <LinearGradient
                colors={inputValue.trim() ? [COLORS.primary, COLORS.secondary] : [COLORS.gray400, COLORS.gray400]}
                style={styles.sendGradient}
              >
                <MaterialIcons name="send" size={20} color={COLORS.white} />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.chatFeatures}>
            <View style={styles.featureItem}>
              <MaterialIcons name="psychology" size={12} color={COLORS.primary} />
              <Text style={styles.featureText}>AI-powered responses</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialIcons name="language" size={12} color={COLORS.green600} />
              <Text style={styles.featureText}>Multi-language support</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialIcons name="access-time" size={12} color={COLORS.blue600} />
              <Text style={styles.featureText}>24/7 availability</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
    paddingTop: 44,
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  botInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  botDetails: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray900,
    marginRight: 8,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.green600,
  },
  botStatus: {
    fontSize: 12,
    color: COLORS.gray600,
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: COLORS.gray50,
  },
  messagesContent: {
    padding: 16,
  },
  messageWrapper: {
    marginBottom: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userMessageContainer: {
    flexDirection: 'row-reverse',
  },
  botMessageContainer: {
    flexDirection: 'row',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  userAvatar: {
    backgroundColor: COLORS.primary,
  },
  botMessageAvatar: {
    backgroundColor: 'transparent',
  },
  avatarGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 16,
    padding: 12,
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
  messageTime: {
    fontSize: 10,
    marginTop: 4,
  },
  userTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  botTime: {
    color: COLORS.gray400,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 48,
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
  typingBubble: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray100,
    borderRadius: 16,
    padding: 12,
  },
  typingDots: {
    flexDirection: 'row',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.gray400,
    marginHorizontal: 2,
  },
  dot1: {
    opacity: 1,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 0.5,
  },
  quickResponsesContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
  },
  quickResponses: {
    flexDirection: 'row',
    paddingHorizontal: 16,
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
  inputContainer: {
    backgroundColor: COLORS.white,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.gray100,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.gray900,
    backgroundColor: COLORS.gray50,
    maxHeight: 100,
    marginRight: 8,
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.gray100,
  },
  voiceButtonActive: {
    backgroundColor: COLORS.red50,
    borderColor: COLORS.red600,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  sendGradient: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    fontSize: 10,
    color: COLORS.gray600,
  },
});