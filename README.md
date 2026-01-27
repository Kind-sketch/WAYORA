
  # Wayora - Advanced Travel Planning Mobile Application

A comprehensive, modern travel planning mobile application built with React Native and Expo. Wayora delivers native iOS and Android experiences, helping users plan, track, and explore their travel journeys with intelligent AI-powered features, sophisticated gamification, and an intuitive mobile interface.

## 🌟 Key Features

### 📱 **Native Mobile Experience**
- **Cross-Platform Native**: Built with React Native for authentic iOS and Android experiences
- **Native Components**: Utilizes platform-specific UI elements and animations for optimal performance
- **Gesture-Based Interactions**: Touch, swipe, and scroll optimized for mobile devices
- **Consistent Design**: Unified `7px` border radius and refined color palette across all screens

### 🏠 **Dashboard & Home**
- **Personalized Welcome**: User-specific greetings and current trip tracking
- **Quick Actions Hub**: Trip Atlas, Post Generator, Bookings, Location History, Emergency Finder
- **Visual Progress Tracking**: Budget and trip progress with enhanced progress bars
- **Upcoming Trips Overview**: Visual cards with destination images and status

### 🗺️ **Intelligent Trip Management**
- **AI-Powered Route Optimization**: Advanced planning process where users input Source, Destination, Budget, Duration, and Preferences. Our AI Navigation Engine intelligently detects tourist spots, hidden gems, and calculates efficient paths to generate a Suggested Route, which users can refine and customize to their preferences
- **Accommodation & Food Finder**: Sophisticated 'Stay and Food Picks' system with intelligent filters based on user input (Budget, Standard, Luxury categories). AI Curates Top Stays and AI Filters Nearby Restaurants for personalized recommendations
- **Local Discovery**: AI-powered detection of hidden gems and cultural hotspots along your route
- **Trip Organization**: Comprehensive bookmarks system, travel companions management, and detailed itineraries

### 💰 **Advanced Budget Tracker**
- **Automated Expense Capture**: Primary OCR Bill Scanning feature for modern, effortless expense entry, complemented by traditional Manual Entry options for comprehensive tracking
- **Smart Insights**: Advanced AI system that Tracks Spending Patterns for sophisticated financial analytics, delivering personalized budget recommendations and intelligent spending alerts
- **Visual Analytics**: Enhanced progress bars with black fills for better contrast and real-time monitoring
- **Expense Categories**: Intelligent categorization across Accommodation, Food & Dining, Transportation, Activities
- **Pattern Recognition**: AI-driven analysis of spending habits for predictive budget optimization

### 🎮 **Exploria Gamification System**
- **AI-Generated Challenges**: Intelligent system where AI Creates Challenges tailored to your travel style and destinations
- **Interactive User Tasks**: Earn points through specific actions including Check-ins, Photo captures, Location visits, and cultural interactions
- **Achievement System**: Comprehensive Earn Badge/Score Points mechanism with 48+ collectible travel milestones
- **Leaderboard Progress**: Dynamic ranking system showcasing global and regional travel achievements with real-time updates

### 🤖 **Wayora AI Assistant**
- **Multi-Modal Input**: Accepts both Text and Voice Queries for seamless interaction across different user preferences
- **AI NLP Engine**: Advanced natural language processing system for intelligent query understanding and contextual responses
- **Multilingual Support**: Comprehensive language capabilities delivering Tips, Travel Advice, Reminders, and Troubleshooting in multiple languages
- **Emergency & Cultural Intelligence**: Instant access to hospitals, embassies, emergency contacts, plus local customs and etiquette guidance

### 👤 **Enhanced Profile Management**
- **Travel Statistics**: 24 countries visited, comprehensive trip history
- **Preference System**: Color-coded travel style, budget range, accommodation preferences
- **Achievement Gallery**: Visual display of earned badges and milestones
- **Account Settings**: Privacy, notifications, language, and security options

## 🎨 **UI/UX Enhancements**

### **Recent Design Improvements:**
- ✨ **Refined Border Radius**: Consistent `rounded-[7px]` throughout the interface
- 🎯 **Enhanced Transparency**: Subtle `bg-white/70` and `bg-white/60` overlays for depth
- 🌈 **Color-Coded Icons**: Organized visual hierarchy with specific color assignments
- 📊 **Improved Progress Bars**: Black fills (`[&>div]:bg-black`) for better visibility
- 🃁 **Premium Card Design**: Enhanced hover states with smooth transitions
- 🎨 **Sophisticated Gradients**: Subtle `from-orange-25 to-amber-25` backgrounds

## 🛠️ **Technical Stack**

- **Mobile Framework**: React Native 0.72.10 with Expo SDK 49
- **Language**: TypeScript for type safety and development efficiency  
- **Navigation**: React Navigation 6 with bottom tab and stack navigators
- **UI Components**: Native iOS/Android components with custom styling
- **Icons**: Expo Vector Icons (@expo/vector-icons) for consistent iconography
- **Gradients & Effects**: expo-linear-gradient and expo-blur for visual polish
- **State Management**: React hooks with optimized re-rendering
- **Development**: Expo CLI for streamlined development and testing

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 16+ 
- npm or yarn package manager
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (Mac) or Android Studio (for emulators)
- Expo Go app on your mobile device

### **Installation & Setup**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nithika-Murugan/Wayora.git
   cd Wayora
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - **Mobile Device**: Scan QR code with Expo Go (Android) or Camera (iOS)
   - **Android Emulator**: Press `a` in terminal
   - **iOS Simulator**: Press `i` in terminal (Mac only)
   - **Web Preview**: Press `w` in terminal

### **Build for Production**
```bash
npx expo build:android
npx expo build:ios
```

## 📖 **Usage Guide**

### **Navigation Overview**
1. **Home**: Current trip tracking, quick actions, upcoming trips
2. **Trips**: Trip planning tools, current trip details, history
3. **Budget**: Real-time expense tracking, smart recommendations
4. **Explore**: Gamification challenges, achievements, level progression
5. **Profile**: Personal stats, preferences, account settings

### **Key Interactions**
- **AI Assistant**: Floating chat button for instant travel help
- **Quick Actions**: One-tap access to common travel tools
- **Budget Tracking**: Automatic categorization with visual progress
- **Achievement System**: Gamified travel milestones and rewards

## 🎯 **Feature Highlights**

### **Smart Budget Management**
- Multi-currency support (planned)
- OCR receipt scanning for automatic expense entry
- Predictive budget recommendations
- Real-time spending alerts and optimization tips

### **📸 AI Post Generator**
- **Automated Trip Recap**: Intelligent system that Collects Trip Data including Highlights, Photos, and Expenses to create comprehensive travel summaries
- **AI Content Generation**: Advanced AI Generate Travel Recap Post feature that creates Instagram and Facebook-ready content with personalized captions and layouts
- **Social Media Integration**: Seamless Optional Edit functionality allowing users to customize generated content before exporting to preferred social media platforms
- **Memory Preservation**: Automatic compilation of travel memories into shareable, professional-quality posts

### **Intelligent Travel Assistant**
- Natural language processing for travel queries
- Location-based emergency services
- Cultural insights and local etiquette guidance
- Personalized destination recommendations

### **Gamification Elements**
- Progressive achievement system with 48+ badges
- Challenge-based point earning (1,250+ points possible)
- Social travel milestones and community features
- Level-based unlocks and premium features

## 📁 **Project Structure**

```
Wayora/
├── App.tsx                    # Main navigation setup with bottom tabs
├── src/
│   └── screens/              # Individual screen components
│       ├── HomeScreen.tsx        # Dashboard & current trip tracking
│       ├── TripsScreen.tsx       # Trip planning & management
│       ├── BudgetScreen.tsx      # Budget tracking & analytics  
│       ├── ExploreScreen.tsx     # Gamification & challenges
│       └── ProfileScreen.tsx     # User profile & settings
├── assets/                   # Images, icons, and static assets
├── app.json                  # Expo configuration
├── babel.config.js           # Babel configuration for React Native
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies and scripts
└── web-backup/               # Original web version backup
    ├── src/                  # Web React components
    └── package-web.json      # Web dependencies backup
```

## 🔧 **Configuration & Customization**

### **Design Tokens**
The application uses a sophisticated color system with:
- **Primary Colors**: Orange (`#ea580c`) to Pink gradients
- **Semantic Colors**: Success (green), warning (amber), error (red)
- **Transparency Levels**: 60%, 70%, 80% for layered effects
- **Border Radius**: Consistent 7px throughout the interface

### **Responsive Breakpoints**
- **Mobile**: 320px - 768px (primary focus)
- **Tablet**: 768px - 1024px 
- **Desktop**: 1024px+ (enhanced experience)

## 🌍 **Roadmap & Future Features**

- 🌐 **Multi-language Support**: Internationalization with 10+ languages
- 🔗 **Social Integration**: Trip sharing and community features
- 📊 **Advanced Analytics**: Detailed travel insights and reporting
- 🎫 **Booking Integration**: Direct hotel and flight reservations
- 📱 **App Store Publishing**: iOS App Store and Google Play Store releases
- 🤝 **Collaborative Planning**: Group trip organization tools
- 🔄 **Offline Mode**: Cache data for offline travel planning
- 📍 **GPS Integration**: Real-time location tracking and navigation

## 🤝 **Contributing**

We welcome contributions! Please see our contributing guidelines for:
- Code style and formatting standards
- Component architecture patterns
- Testing requirements and coverage
- Documentation standards

## 📄 **License**

This project is proprietary and confidential.

---

**Wayora** - *Transforming every journey into an extraordinary mobile adventure* ✈️🌟

> Built with ❤️ using React Native, Expo, TypeScript, and cutting-edge mobile technologies
  