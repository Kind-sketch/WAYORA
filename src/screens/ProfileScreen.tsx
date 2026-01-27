import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import ChatBot from "../components/ChatBot";

const COLORS = {
  primary: "#ea580c",
  secondary: "#fb923c",
  white: "#ffffff",
  gray50: "#f9fafb",
  gray100: "#f3f4f6",
  gray400: "#9ca3af",
  gray600: "#4b5563",
  gray900: "#111827",
  orange50: "#fff7ed",
  amber50: "#fffbeb",
  pink600: "#db2777",
  amber600: "#d97706",
};

export default function ProfileScreen() {
  // State for profile editing
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Alex Thompson",
    subtitle: "AI-Enhanced Explorer • Level 12",
  });
  const [editData, setEditData] = useState({ ...profileData });

  // State for Privacy and Help modals
  const [privacyModal, setPrivacyModal] = useState(false);
  const [helpModal, setHelpModal] = useState(false);
  const [personalInfoModal, setPersonalInfoModal] = useState(false);

  // State for personal details
  const [personalDetails, setPersonalDetails] = useState({
    // Identity Documents
    panCard: "",
    aadhaarNumber: "",
    passportNumber: "",
    drivingLicense: "",
    voterID: "",

    // Financial Details
    primaryBankAccount: "",
    secondaryBankAccount: "",
    creditCardNumber: "",
    debitCardNumber: "",

    // Emergency Contacts
    emergencyContact1: {
      name: "",
      relation: "",
      phone: "",
    },
    emergencyContact2: {
      name: "",
      relation: "",
      phone: "",
    },

    // Travel Details
    frequentFlyerNumber: "",
    travelInsurancePolicy: "",

    // Medical Information
    bloodGroup: "",
    allergies: "",
    medicalConditions: "",

    // Personal Information
    dateOfBirth: "",
    nationality: "",
    occupation: "",
    address: "",
  });

  // State for settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [aiAssistantEnabled, setAiAssistantEnabled] = useState(true);
  const [smartRecommendations, setSmartRecommendations] = useState(true);
  const [photoEnhancement, setPhotoEnhancement] = useState(true);
  const [locationIntelligence, setLocationIntelligence] = useState(true);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Handler functions
  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
    Alert.alert(
      "Notifications",
      `Notifications ${!notificationsEnabled ? "enabled" : "disabled"}`,
      [{ text: "OK" }]
    );
  };

  const handlePrivacySettings = () => {
    setPrivacyModal(true);
  };

  const handleHelpSupport = () => {
    setHelpModal(true);
  };

  const handleLanguageSettings = () => {
    Alert.alert("Language Settings", "Select your preferred language:", [
      {
        text: "English",
        onPress: () => Alert.alert("Language", "Language set to English"),
      },
      {
        text: "Spanish",
        onPress: () => Alert.alert("Language", "Language set to Spanish"),
      },
      {
        text: "French",
        onPress: () => Alert.alert("Language", "Language set to French"),
      },
      {
        text: "German",
        onPress: () => Alert.alert("Language", "Language set to German"),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleEditProfile = () => {
    setEditData({ ...profileData });
    setEditProfileModal(true);
  };

  const handleSaveProfile = () => {
    setProfileData({ ...editData });
    setEditProfileModal(false);
    Alert.alert(
      "Profile Updated",
      "Your profile has been successfully updated!"
    );
  };

  const handleBudgetSettings = () => {
    Alert.alert("AI Budget Range", "Select your preferred budget range:", [
      {
        text: "Budget ($50-100/day)",
        onPress: () => Alert.alert("Budget", "Budget range updated to Budget"),
      },
      {
        text: "Mid-range ($100-300/day)",
        onPress: () =>
          Alert.alert("Budget", "Budget range updated to Mid-range"),
      },
      {
        text: "Luxury ($300+/day)",
        onPress: () => Alert.alert("Budget", "Budget range updated to Luxury"),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleTravelStyle = () => {
    Alert.alert("AI Travel Style", "Choose your travel style:", [
      {
        text: "Cultural Explorer",
        onPress: () =>
          Alert.alert("Travel Style", "Style set to Cultural Explorer"),
      },
      {
        text: "Adventure Seeker",
        onPress: () =>
          Alert.alert("Travel Style", "Style set to Adventure Seeker"),
      },
      {
        text: "Relaxation Focused",
        onPress: () =>
          Alert.alert("Travel Style", "Style set to Relaxation Focused"),
      },
      {
        text: "Business Traveler",
        onPress: () =>
          Alert.alert("Travel Style", "Style set to Business Traveler"),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleAccommodationSettings = () => {
    Alert.alert("Smart Accommodation", "Select accommodation preference:", [
      {
        text: "Hotels near transit",
        onPress: () =>
          Alert.alert("Accommodation", "Preference set to Hotels near transit"),
      },
      {
        text: "City center locations",
        onPress: () =>
          Alert.alert(
            "Accommodation",
            "Preference set to City center locations"
          ),
      },
      {
        text: "Quiet neighborhoods",
        onPress: () =>
          Alert.alert("Accommodation", "Preference set to Quiet neighborhoods"),
      },
      {
        text: "Budget-friendly areas",
        onPress: () =>
          Alert.alert(
            "Accommodation",
            "Preference set to Budget-friendly areas"
          ),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleCuisineSettings = () => {
    Alert.alert("AI Cuisine Match", "Select cuisine preferences:", [
      {
        text: "Local favorites",
        onPress: () =>
          Alert.alert("Cuisine", "Preference set to Local favorites"),
      },
      {
        text: "International cuisine",
        onPress: () =>
          Alert.alert("Cuisine", "Preference set to International cuisine"),
      },
      {
        text: "Vegetarian options",
        onPress: () =>
          Alert.alert("Cuisine", "Preference set to Vegetarian options"),
      },
      {
        text: "Fine dining",
        onPress: () => Alert.alert("Cuisine", "Preference set to Fine dining"),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleBackupSync = () => {
    Alert.alert(
      "Backup & Sync",
      "Your data is automatically backed up to the cloud. Last backup: 2 hours ago",
      [
        {
          text: "Backup Now",
          onPress: () =>
            Alert.alert("Backup", "Backup completed successfully!"),
        },
        {
          text: "Settings",
          onPress: () =>
            Alert.alert("Backup Settings", "Backup settings coming soon!"),
        },
        { text: "OK", style: "default" },
      ]
    );
  };

  const handleInviteFriends = () => {
    Alert.alert("Invite Friends", "Share Wayora with your friends!", [
      {
        text: "Share Link",
        onPress: () => Alert.alert("Share", "Share link copied to clipboard!"),
      },
      {
        text: "Send Email",
        onPress: () => Alert.alert("Email", "Email invitation sent!"),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleRateApp = () => {
    Alert.alert(
      "Rate Wayora",
      "Enjoying Wayora? Please rate us in the app store!",
      [
        {
          text: "⭐⭐⭐⭐⭐ Rate 5 Stars",
          onPress: () => Alert.alert("Thank You!", "Thanks for rating Wayora!"),
        },
        { text: "Later", style: "cancel" },
      ]
    );
  };

  const handlePersonalInfo = () => {
    setPersonalInfoModal(true);
  };

  const handleDownloadReport = () => {
    Alert.alert(
      "Download Report",
      "Select which report you'd like to download:",
      [
        {
          text: "Personal Details Report",
          onPress: () => generatePersonalDetailsReport(),
        },
        {
          text: "Trip History Report",
          onPress: () => generateTripHistoryReport(),
        },
        {
          text: "Complete Profile Report",
          onPress: () => generateCompleteReport(),
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const generatePersonalDetailsReport = () => {
    // Simulate generating a personal details report
    const reportData = {
      profileInfo: profileData,
      personalDetails: personalDetails,
      generatedAt: new Date().toISOString(),
      reportType: "Personal Details",
    };

    Alert.alert(
      "Report Generated",
      `Personal Details Report has been generated successfully!\n\nReport includes:\n• Profile Information\n• Identity Documents\n• Emergency Contacts\n• Medical Information\n• Travel Preferences\n\nGenerated on: ${new Date().toLocaleDateString()}`,
      [
        {
          text: "Share Report",
          onPress: () => Alert.alert("Feature Coming Soon", "Sharing functionality will be available in the next update!"),
        },
        { text: "OK" },
      ]
    );
  };

  const generateTripHistoryReport = () => {
    // Simulate generating a trip history report
    Alert.alert(
      "Report Generated",
      `Trip History Report has been generated successfully!\n\nReport includes:\n• 24 Countries Visited\n• 1,250 Points Earned\n• 48 Badges Collected\n• AI Travel Insights\n• Budget Analytics\n\nGenerated on: ${new Date().toLocaleDateString()}`,
      [
        {
          text: "Share Report",
          onPress: () => Alert.alert("Feature Coming Soon", "Sharing functionality will be available in the next update!"),
        },
        { text: "OK" },
      ]
    );
  };

  const generateCompleteReport = () => {
    // Simulate generating a complete profile report
    Alert.alert(
      "Report Generated",
      `Complete Profile Report has been generated successfully!\n\nReport includes:\n• Personal & Profile Information\n• Complete Trip History\n• AI Preferences & Settings\n• Achievement Summary\n• Privacy & Security Settings\n\nGenerated on: ${new Date().toLocaleDateString()}`,
      [
        {
          text: "Share Report",
          onPress: () => Alert.alert("Feature Coming Soon", "Sharing functionality will be available in the next update!"),
        },
        { text: "OK" },
      ]
    );
  };

  const updatePersonalDetails = (field: string, value: string) => {
    setPersonalDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateEmergencyContact = (
    contactIndex: number,
    field: string,
    value: string
  ) => {
    const contactKey =
      contactIndex === 1 ? "emergencyContact1" : "emergencyContact2";
    setPersonalDetails((prev) => ({
      ...prev,
      [contactKey]: {
        ...prev[contactKey],
        [field]: value,
      },
    }));
  };

  const savePersonalDetails = () => {
    Alert.alert(
      "Details Saved",
      "Your personal information has been securely saved.",
      [{ text: "OK" }]
    );
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () =>
          Alert.alert("Signed Out", "You have been signed out successfully."),
      },
    ]);
  };

  const handleAvatarPress = () => {
    Alert.alert("Profile Photo", "Change your profile photo:", [
      {
        text: "Take Photo",
        onPress: () => Alert.alert("Camera", "Camera feature coming soon!"),
      },
      {
        text: "Choose from Gallery",
        onPress: () => Alert.alert("Gallery", "Gallery access coming soon!"),
      },
      {
        text: "Remove Photo",
        onPress: () => Alert.alert("Remove", "Photo removed successfully!"),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleViewAllCountries = () => {
    Alert.alert(
      "Countries Visited",
      "View your complete travel map and country statistics in the Travel Map section.",
      [
        {
          text: "View Map",
          onPress: () => Alert.alert("Travel Map", "Opening travel map..."),
        },
        { text: "OK", style: "default" },
      ]
    );
  };

  const handleViewAllBadges = () => {
    Alert.alert(
      "Achievement Center",
      "View all your badges and unlock new achievements!",
      [
        {
          text: "View Badges",
          onPress: () => Alert.alert("Badges", "Opening achievement center..."),
        },
        { text: "OK", style: "default" },
      ]
    );
  };

  const handleRedeemPoints = () => {
    Alert.alert("Redeem Points", "Use your 1,250 points for rewards:", [
      {
        text: "Hotel Discounts (500 pts)",
        onPress: () => Alert.alert("Redeemed", "Hotel discount unlocked!"),
      },
      {
        text: "Flight Vouchers (1000 pts)",
        onPress: () => Alert.alert("Redeemed", "Flight voucher unlocked!"),
      },
      {
        text: "Premium Features (200 pts)",
        onPress: () => Alert.alert("Redeemed", "Premium features unlocked!"),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity style={styles.avatar} onPress={handleAvatarPress}>
            <Text style={styles.avatarText}>
              {profileData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </Text>
          </TouchableOpacity>
          <Text style={styles.profileName}>{profileData.name}</Text>
          <Text style={styles.profileSubtitle}>{profileData.subtitle}</Text>
          <TouchableOpacity
            style={styles.aiStatusBadge}
            onPress={() =>
              Alert.alert(
                "AI Profile Status",
                "Your AI Profile is actively learning from your travel patterns!\n\n✅ Smart Recommendations: Active\n✅ Personalized Insights: Learning\n✅ Route Optimization: Enhanced\n✅ Preference Matching: 92% Accuracy\n\nAI has analyzed 24 trips to personalize your experience."
              )
            }
          >
            <MaterialIcons
              name="auto-awesome"
              size={14}
              color={COLORS.primary}
            />
            <Text style={styles.aiStatusText}>AI Profile Active</Text>
          </TouchableOpacity>

          <View style={styles.statsRow}>
            <TouchableOpacity
              style={styles.statItem}
              onPress={handleViewAllCountries}
            >
              <Text style={[styles.statNumber, { color: COLORS.primary }]}>
                24
              </Text>
              <Text style={styles.statLabel}>Countries</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statItem}
              onPress={handleRedeemPoints}
            >
              <Text style={[styles.statNumber, { color: COLORS.pink600 }]}>
                1,250
              </Text>
              <Text style={styles.statLabel}>Points</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statItem}
              onPress={handleViewAllBadges}
            >
              <Text style={[styles.statNumber, { color: COLORS.amber600 }]}>
                48
              </Text>
              <Text style={styles.statLabel}>Badges</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Settings */}
        <View style={styles.quickSettingsCard}>
          <LinearGradient
            colors={[COLORS.orange50, COLORS.amber50]}
            style={styles.quickSettingsGradient}
          >
            <Text style={styles.sectionTitle}>Quick Settings</Text>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleNotificationToggle}
            >
              <View style={styles.settingLeft}>
                <MaterialIcons
                  name="notifications"
                  size={20}
                  color={COLORS.gray600}
                />
                <Text style={styles.settingLabel}>Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: COLORS.gray400, true: COLORS.primary }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={handlePrivacySettings}
            >
              <View style={styles.settingLeft}>
                <MaterialIcons
                  name="security"
                  size={20}
                  color={COLORS.gray600}
                />
                <Text style={styles.settingLabel}>Privacy</Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={16}
                color={COLORS.gray400}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleHelpSupport}
            >
              <View style={styles.settingLeft}>
                <MaterialIcons name="help" size={20} color={COLORS.gray600} />
                <Text style={styles.settingLabel}>Help & Support</Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={16}
                color={COLORS.gray400}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleLanguageSettings}
            >
              <View style={styles.settingLeft}>
                <MaterialIcons
                  name="language"
                  size={20}
                  color={COLORS.gray600}
                />
                <Text style={styles.settingLabel}>Language</Text>
              </View>
              <Text style={styles.settingAction}>English</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* AI-Enhanced Travel Preferences */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>AI Travel Preferences</Text>
            <TouchableOpacity
              style={styles.aiIndicator}
              onPress={() =>
                Alert.alert(
                  "Smart AI Features",
                  "AI has learned your preferences from 24 trips:\n\n🧠 Cultural Explorer (89% match)\n💰 Mid-range Budget (Optimized)\n🏨 Hotels near transit (Preferred)\n🍜 Local cuisine (Favorite)\n\nAI continuously improves recommendations based on your feedback!"
                )
              }
            >
              <MaterialIcons
                name="psychology"
                size={14}
                color={COLORS.primary}
              />
              <Text style={styles.aiIndicatorText}>Smart</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.aiInsightCard}
            onPress={() =>
              Alert.alert(
                "AI Travel Insights",
                "Based on your travel history, AI has learned:\n\n🌅 Morning Activity: Cultural sites (8-11 AM)\n🍽️ Dining Time: Restaurants after 6 PM\n🚶 Walking Preference: 15-20 min between spots\n💰 Budget Sweet Spot: $150-250/day\n🏨 Accommodation: Near public transport\n\nThese insights help AI plan better itineraries for you!"
              )
            }
          >
            <LinearGradient
              colors={[COLORS.orange50, COLORS.amber50]}
              style={styles.aiInsightGradient}
            >
              <MaterialIcons
                name="lightbulb"
                size={16}
                color={COLORS.amber600}
              />
              <Text style={styles.aiInsightText}>
                AI learned you prefer cultural sites in the morning and
                restaurants after 6 PM
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.preferenceItem}
            onPress={handleBudgetSettings}
          >
            <View style={styles.preferenceLeft}>
              <MaterialIcons
                name="attach-money"
                size={16}
                color={COLORS.primary}
              />
              <Text style={styles.preferenceLabel}>AI Budget Range</Text>
              <MaterialIcons
                name="auto-awesome"
                size={12}
                color={COLORS.amber600}
              />
            </View>
            <Text style={styles.preferenceValue}>Mid-range (AI-optimized)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.preferenceItem}
            onPress={handleTravelStyle}
          >
            <View style={styles.preferenceLeft}>
              <MaterialIcons name="group" size={16} color="#8b5cf6" />
              <Text style={styles.preferenceLabel}>AI Travel Style</Text>
              <MaterialIcons
                name="auto-awesome"
                size={12}
                color={COLORS.amber600}
              />
            </View>
            <Text style={styles.preferenceValue}>Cultural Explorer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.preferenceItem}
            onPress={handleAccommodationSettings}
          >
            <View style={styles.preferenceLeft}>
              <MaterialIcons name="home" size={16} color="#2563eb" />
              <Text style={styles.preferenceLabel}>Smart Accommodation</Text>
              <MaterialIcons
                name="auto-awesome"
                size={12}
                color={COLORS.amber600}
              />
            </View>
            <Text style={styles.preferenceValue}>Hotels near transit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.preferenceItem}
            onPress={handleCuisineSettings}
          >
            <View style={styles.preferenceLeft}>
              <MaterialIcons
                name="restaurant"
                size={16}
                color={COLORS.primary}
              />
              <Text style={styles.preferenceLabel}>AI Cuisine Match</Text>
              <MaterialIcons
                name="auto-awesome"
                size={12}
                color={COLORS.amber600}
              />
            </View>
            <Text style={styles.preferenceValue}>Local favorites</Text>
          </TouchableOpacity>
        </View>

        {/* AI Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>AI Personalization</Text>
            <TouchableOpacity
              style={styles.aiIndicator}
              onPress={() =>
                Alert.alert(
                  "AI Personalization Status",
                  "Your AI features are enhancing your travel experience:\n\n🤖 Travel Assistant: Provides real-time help\n🧠 Smart Recommendations: Learning your style\n📷 Photo Enhancement: Auto-improving images\n📍 Location Intelligence: Optimizing routes\n\nToggle individual features below to customize your AI experience."
                )
              }
            >
              <MaterialIcons
                name="auto-awesome"
                size={14}
                color={COLORS.primary}
              />
              <Text style={styles.aiIndicatorText}>Smart</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setAiAssistantEnabled(!aiAssistantEnabled)}
          >
            <View style={styles.settingLeft}>
              <MaterialIcons
                name="auto-awesome"
                size={16}
                color={COLORS.primary}
              />
              <Text style={styles.settingLabel}>AI Travel Assistant</Text>
            </View>
            <Switch
              value={aiAssistantEnabled}
              onValueChange={setAiAssistantEnabled}
              trackColor={{ false: COLORS.gray400, true: COLORS.primary }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setSmartRecommendations(!smartRecommendations)}
          >
            <View style={styles.settingLeft}>
              <MaterialIcons
                name="psychology"
                size={16}
                color={COLORS.primary}
              />
              <Text style={styles.settingLabel}>Smart Recommendations</Text>
            </View>
            <Switch
              value={smartRecommendations}
              onValueChange={setSmartRecommendations}
              trackColor={{ false: COLORS.gray400, true: COLORS.primary }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setPhotoEnhancement(!photoEnhancement)}
          >
            <View style={styles.settingLeft}>
              <MaterialIcons
                name="camera-alt"
                size={16}
                color={COLORS.primary}
              />
              <Text style={styles.settingLabel}>AI Photo Enhancement</Text>
            </View>
            <Switch
              value={photoEnhancement}
              onValueChange={setPhotoEnhancement}
              trackColor={{ false: COLORS.gray400, true: COLORS.primary }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setLocationIntelligence(!locationIntelligence)}
          >
            <View style={styles.settingLeft}>
              <MaterialIcons
                name="location-on"
                size={16}
                color={COLORS.primary}
              />
              <Text style={styles.settingLabel}>Location Intelligence</Text>
            </View>
            <Switch
              value={locationIntelligence}
              onValueChange={setLocationIntelligence}
              trackColor={{ false: COLORS.gray400, true: COLORS.primary }}
            />
          </TouchableOpacity>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={handleEditProfile}
          >
            <View style={styles.actionLeft}>
              <MaterialIcons name="edit" size={20} color={COLORS.gray600} />
              <Text style={[styles.actionLabel, { color: COLORS.gray600 }]}>
                Edit Profile
              </Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={16}
              color={COLORS.gray400}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={handlePersonalInfo}
          >
            <View style={styles.actionLeft}>
              <MaterialIcons name="badge" size={20} color={COLORS.gray600} />
              <Text style={[styles.actionLabel, { color: COLORS.gray600 }]}>
                Personal Details
              </Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={16}
              color={COLORS.gray400}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={handleDownloadReport}
          >
            <View style={styles.actionLeft}>
              <MaterialIcons name="file-download" size={20} color={COLORS.primary} />
              <Text style={[styles.actionLabel, { color: COLORS.primary }]}>
                Download Report
              </Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={16}
              color={COLORS.gray400}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={handleBackupSync}
          >
            <View style={styles.actionLeft}>
              <MaterialIcons name="backup" size={20} color={COLORS.gray600} />
              <Text style={[styles.actionLabel, { color: COLORS.gray600 }]}>
                Backup & Sync
              </Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={16}
              color={COLORS.gray400}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={handleInviteFriends}
          >
            <View style={styles.actionLeft}>
              <MaterialIcons name="share" size={20} color={COLORS.primary} />
              <Text style={[styles.actionLabel, { color: COLORS.primary }]}>
                Invite Friends
              </Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={16}
              color={COLORS.gray400}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={handleRateApp}>
            <View style={styles.actionLeft}>
              <MaterialIcons
                name="rate-review"
                size={20}
                color={COLORS.gray600}
              />
              <Text style={[styles.actionLabel, { color: COLORS.gray600 }]}>
                Rate Wayora
              </Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={16}
              color={COLORS.gray400}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={handleSignOut}>
            <View style={styles.actionLeft}>
              <MaterialIcons name="logout" size={20} color="#dc2626" />
              <Text style={[styles.actionLabel, { color: "#dc2626" }]}>
                Sign Out
              </Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={16}
              color={COLORS.gray400}
            />
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Wayora v1.0.0</Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editProfileModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditProfileModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditProfileModal(false)}>
                <MaterialIcons name="close" size={24} color={COLORS.gray600} />
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.formLabel}>Display Name</Text>
              <TextInput
                style={styles.formInput}
                value={editData.name}
                onChangeText={(text) =>
                  setEditData({ ...editData, name: text })
                }
                placeholder="Enter your name"
              />

              <Text style={styles.formLabel}>Bio/Subtitle</Text>
              <TextInput
                style={styles.formInput}
                value={editData.subtitle}
                onChangeText={(text) =>
                  setEditData({ ...editData, subtitle: text })
                }
                placeholder="Enter your bio"
                multiline
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setEditProfileModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveProfile}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Privacy Settings Modal */}
      <Modal
        visible={privacyModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPrivacyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🔒 Privacy Settings</Text>
              <TouchableOpacity onPress={() => setPrivacyModal(false)}>
                <MaterialIcons name="close" size={24} color={COLORS.gray600} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.privacyContainer}>
              <Text style={styles.privacySection}>Data & Sharing</Text>

              <TouchableOpacity
                style={styles.privacyItem}
                onPress={() =>
                  Alert.alert(
                    "Data Sharing",
                    "Control what data is shared with third-party services and partners."
                  )
                }
              >
                <View style={styles.privacyLeft}>
                  <MaterialIcons
                    name="share"
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text style={styles.privacyLabel}>Data Sharing</Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={16}
                  color={COLORS.gray400}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.privacyItem}
                onPress={() =>
                  Alert.alert(
                    "Location Tracking",
                    "Manage location services and GPS tracking preferences."
                  )
                }
              >
                <View style={styles.privacyLeft}>
                  <MaterialIcons
                    name="location-on"
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text style={styles.privacyLabel}>Location Tracking</Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={16}
                  color={COLORS.gray400}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.privacyItem}
                onPress={() =>
                  Alert.alert(
                    "Profile Visibility",
                    "Set who can see your profile and travel activities."
                  )
                }
              >
                <View style={styles.privacyLeft}>
                  <MaterialIcons
                    name="visibility"
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text style={styles.privacyLabel}>Profile Visibility</Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={16}
                  color={COLORS.gray400}
                />
              </TouchableOpacity>

              <Text style={styles.privacySection}>AI & Analytics</Text>

              <TouchableOpacity
                style={styles.privacyItem}
                onPress={() =>
                  Alert.alert(
                    "AI Data Usage",
                    "Configure how AI uses your data for personalization and recommendations."
                  )
                }
              >
                <View style={styles.privacyLeft}>
                  <MaterialIcons
                    name="psychology"
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text style={styles.privacyLabel}>AI Data Usage</Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={16}
                  color={COLORS.gray400}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.privacyItem}
                onPress={() =>
                  Alert.alert(
                    "Analytics",
                    "Manage usage analytics and performance data collection."
                  )
                }
              >
                <View style={styles.privacyLeft}>
                  <MaterialIcons
                    name="analytics"
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text style={styles.privacyLabel}>Usage Analytics</Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={16}
                  color={COLORS.gray400}
                />
              </TouchableOpacity>

              <Text style={styles.privacySection}>Security</Text>

              <TouchableOpacity
                style={styles.privacyItem}
                onPress={() =>
                  Alert.alert(
                    "Two-Factor Authentication",
                    "Add extra security to your account with 2FA."
                  )
                }
              >
                <View style={styles.privacyLeft}>
                  <MaterialIcons
                    name="security"
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text style={styles.privacyLabel}>Two-Factor Auth</Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={16}
                  color={COLORS.gray400}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.privacyItem}
                onPress={() =>
                  Alert.alert(
                    "Login Activity",
                    "View recent login attempts and active sessions."
                  )
                }
              >
                <View style={styles.privacyLeft}>
                  <MaterialIcons
                    name="login"
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text style={styles.privacyLabel}>Login Activity</Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={16}
                  color={COLORS.gray400}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.privacyItem}
                onPress={() =>
                  Alert.alert(
                    "Data Export",
                    "Download a copy of all your data from Wayora."
                  )
                }
              >
                <View style={styles.privacyLeft}>
                  <MaterialIcons
                    name="file-download"
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text style={styles.privacyLabel}>Export My Data</Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={16}
                  color={COLORS.gray400}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.privacyItem, { borderBottomWidth: 0 }]}
                onPress={() =>
                  Alert.alert(
                    "Delete Account",
                    "Permanently delete your account and all associated data. This action cannot be undone.",
                    [
                      { text: "Cancel", style: "cancel" },
                      { text: "Delete", style: "destructive" },
                    ]
                  )
                }
              >
                <View style={styles.privacyLeft}>
                  <MaterialIcons
                    name="delete-forever"
                    size={20}
                    color="#dc2626"
                  />
                  <Text style={[styles.privacyLabel, { color: "#dc2626" }]}>
                    Delete Account
                  </Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={16}
                  color={COLORS.gray400}
                />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Help & Support Modal */}
      <Modal
        visible={helpModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setHelpModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🎧 Help & Support</Text>
              <TouchableOpacity onPress={() => setHelpModal(false)}>
                <MaterialIcons name="close" size={24} color={COLORS.gray600} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.helpContainer}>
              <Text style={styles.helpSection}>Get Help</Text>

              <TouchableOpacity
                style={styles.helpItem}
                onPress={() =>
                  Alert.alert(
                    "FAQ",
                    "Frequently Asked Questions:\n\n• How to plan a trip?\n• How does AI work?\n• Payment methods\n• Booking policies\n• Account management\n\nFull FAQ coming soon!"
                  )
                }
              >
                <View style={styles.helpLeft}>
                  <MaterialIcons
                    name="help-outline"
                    size={24}
                    color={COLORS.primary}
                  />
                  <View style={styles.helpTextContainer}>
                    <Text style={styles.helpLabel}>FAQ</Text>
                    <Text style={styles.helpDesc}>
                      Frequently asked questions
                    </Text>
                  </View>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={16}
                  color={COLORS.gray400}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.helpItem}
                onPress={() => setIsChatbotOpen(true)}
              >
                <View style={styles.helpLeft}>
                  <MaterialIcons name="chat" size={24} color={COLORS.primary} />
                  <View style={styles.helpTextContainer}>
                    <Text style={styles.helpLabel}>AI Travel Assistant</Text>
                    <Text style={styles.helpDesc}>Chat with Tavi • 24/7</Text>
                  </View>
                </View>
                <View style={styles.liveBadge}>
                  <Text style={styles.liveBadgeText}>AI</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.helpItem}
                onPress={() =>
                  Alert.alert(
                    "Email Support",
                    "📧 Email Support\n\nsupport@wayora.com\n\n• General inquiries\n• Technical issues\n• Billing questions\n• Feature requests\n\nResponse time: Within 24 hours"
                  )
                }
              >
                <View style={styles.helpLeft}>
                  <MaterialIcons
                    name="email"
                    size={24}
                    color={COLORS.primary}
                  />
                  <View style={styles.helpTextContainer}>
                    <Text style={styles.helpLabel}>Email Support</Text>
                    <Text style={styles.helpDesc}>support@wayora.com</Text>
                  </View>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={16}
                  color={COLORS.gray400}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.helpItem}
                onPress={() =>
                  Alert.alert(
                    "Phone Support",
                    "📞 Phone Support\n\n+1-800-WAYORA\n(+1-800-929-6726)\n\n⏰ Hours:\nMon-Fri: 9 AM - 6 PM EST\nSat-Sun: 10 AM - 4 PM EST\n\n🌍 International support available"
                  )
                }
              >
                <View style={styles.helpLeft}>
                  <MaterialIcons
                    name="phone"
                    size={24}
                    color={COLORS.primary}
                  />
                  <View style={styles.helpTextContainer}>
                    <Text style={styles.helpLabel}>Phone Support</Text>
                    <Text style={styles.helpDesc}>+1-800-WAYORA</Text>
                  </View>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={16}
                  color={COLORS.gray400}
                />
              </TouchableOpacity>

              <Text style={styles.helpSection}>Resources</Text>

              <TouchableOpacity
                style={styles.helpItem}
                onPress={() =>
                  Alert.alert(
                    "User Guide",
                    "📖 Complete User Guide\n\n• Getting started with Wayora\n• AI features explained\n• Trip planning walkthrough\n• Budget management\n• Photo & memory features\n\nInteractive guide coming soon!"
                  )
                }
              >
                <View style={styles.helpLeft}>
                  <MaterialIcons
                    name="book"
                    size={24}
                    color={COLORS.amber600}
                  />
                  <View style={styles.helpTextContainer}>
                    <Text style={styles.helpLabel}>User Guide</Text>
                    <Text style={styles.helpDesc}>
                      Complete app walkthrough
                    </Text>
                  </View>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={16}
                  color={COLORS.gray400}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.helpItem}
                onPress={() =>
                  Alert.alert(
                    "Video Tutorials",
                    '🎥 Video Tutorials\n\n• "Getting Started" (3 min)\n• "AI Trip Planning" (5 min)\n• "Budget Tracking" (4 min)\n• "Photo Management" (3 min)\n• "Advanced Features" (7 min)\n\nVideo library launching soon!'
                  )
                }
              >
                <View style={styles.helpLeft}>
                  <MaterialIcons
                    name="play-circle-outline"
                    size={24}
                    color={COLORS.amber600}
                  />
                  <View style={styles.helpTextContainer}>
                    <Text style={styles.helpLabel}>Video Tutorials</Text>
                    <Text style={styles.helpDesc}>Step-by-step videos</Text>
                  </View>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={16}
                  color={COLORS.gray400}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.helpItem}
                onPress={() =>
                  Alert.alert(
                    "Community Forum",
                    "👥 Community Forum\n\n• Share travel experiences\n• Get tips from other travelers\n• Ask questions\n• Feature discussions\n• Travel inspiration\n\nJoin thousands of Wayora travelers!"
                  )
                }
              >
                <View style={styles.helpLeft}>
                  <MaterialIcons
                    name="forum"
                    size={24}
                    color={COLORS.amber600}
                  />
                  <View style={styles.helpTextContainer}>
                    <Text style={styles.helpLabel}>Community Forum</Text>
                    <Text style={styles.helpDesc}>Connect with travelers</Text>
                  </View>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={16}
                  color={COLORS.gray400}
                />
              </TouchableOpacity>

              <Text style={styles.helpSection}>Feedback</Text>

              <TouchableOpacity
                style={styles.helpItem}
                onPress={() =>
                  Alert.alert(
                    "Report a Bug",
                    "🐛 Report a Bug\n\nHelp us improve Wayora by reporting issues:\n\n• App crashes\n• Feature not working\n• Performance issues\n• UI/UX problems\n\nYour feedback helps make Wayora better!"
                  )
                }
              >
                <View style={styles.helpLeft}>
                  <MaterialIcons name="bug-report" size={24} color="#dc2626" />
                  <View style={styles.helpTextContainer}>
                    <Text style={styles.helpLabel}>Report a Bug</Text>
                    <Text style={styles.helpDesc}>Help us fix issues</Text>
                  </View>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={16}
                  color={COLORS.gray400}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.helpItem, { borderBottomWidth: 0 }]}
                onPress={() =>
                  Alert.alert(
                    "Feature Request",
                    "💡 Request a Feature\n\nSuggest new features for Wayora:\n\n• New AI capabilities\n• Travel tools\n• Integration requests\n• UI improvements\n\nWe love hearing your ideas!"
                  )
                }
              >
                <View style={styles.helpLeft}>
                  <MaterialIcons
                    name="lightbulb-outline"
                    size={24}
                    color="#16a34a"
                  />
                  <View style={styles.helpTextContainer}>
                    <Text style={styles.helpLabel}>Feature Request</Text>
                    <Text style={styles.helpDesc}>Suggest improvements</Text>
                  </View>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={16}
                  color={COLORS.gray400}
                />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Personal Details Modal */}
      <Modal
        visible={personalInfoModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setPersonalInfoModal(false)}
      >
        <SafeAreaView style={styles.personalDetailsModalContainer}>
          <View style={styles.personalDetailsModalHeader}>
            <TouchableOpacity onPress={() => setPersonalInfoModal(false)}>
              <MaterialIcons name="close" size={24} color={COLORS.gray600} />
            </TouchableOpacity>
            <Text style={styles.personalDetailsModalTitle}>
              🆔 Personal Details
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView
            style={styles.personalDetailsContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.personalDetailsScrollContent}
          >
            <Text style={styles.personalDetailsSection}>
              Identity Documents
            </Text>
            <Text style={styles.personalDetailsDesc}>
              Store your important identification details securely. All
              information is encrypted and stored locally.
            </Text>

            {/* PAN Card */}
            <View style={styles.detailField}>
              <Text style={styles.detailLabel}>PAN Card Number</Text>
              <TextInput
                style={styles.detailInput}
                placeholder="ABCDE1234F"
                value={personalDetails.panCard}
                onChangeText={(value) =>
                  updatePersonalDetails("panCard", value)
                }
                maxLength={10}
                autoCapitalize="characters"
              />
            </View>

            {/* Aadhaar Number */}
            <View style={styles.detailField}>
              <Text style={styles.detailLabel}>Aadhaar Number</Text>
              <TextInput
                style={styles.detailInput}
                placeholder="1234 5678 9012"
                value={personalDetails.aadhaarNumber}
                onChangeText={(value) =>
                  updatePersonalDetails("aadhaarNumber", value)
                }
                keyboardType="numeric"
                maxLength={14}
              />
            </View>

            {/* Passport Number */}
            <View style={styles.detailField}>
              <Text style={styles.detailLabel}>Passport Number</Text>
              <TextInput
                style={styles.detailInput}
                placeholder="A1234567"
                value={personalDetails.passportNumber}
                onChangeText={(value) =>
                  updatePersonalDetails("passportNumber", value)
                }
                autoCapitalize="characters"
              />
            </View>

            {/* Driving License */}
            <View style={styles.detailField}>
              <Text style={styles.detailLabel}>Driving License</Text>
              <TextInput
                style={styles.detailInput}
                placeholder="DL-1420110012345"
                value={personalDetails.drivingLicense}
                onChangeText={(value) =>
                  updatePersonalDetails("drivingLicense", value)
                }
                autoCapitalize="characters"
              />
            </View>

            {/* Voter ID */}
            <View style={styles.detailField}>
              <Text style={styles.detailLabel}>Voter ID</Text>
              <TextInput
                style={styles.detailInput}
                placeholder="ABC1234567"
                value={personalDetails.voterID}
                onChangeText={(value) =>
                  updatePersonalDetails("voterID", value)
                }
                autoCapitalize="characters"
              />
            </View>

            <Text style={styles.personalDetailsSection}>
              Financial Information
            </Text>

            {/* Primary Bank Account */}
            <View style={styles.detailField}>
              <Text style={styles.detailLabel}>Primary Bank Account</Text>
              <TextInput
                style={styles.detailInput}
                placeholder="Account Number"
                value={personalDetails.primaryBankAccount}
                onChangeText={(value) =>
                  updatePersonalDetails("primaryBankAccount", value)
                }
                keyboardType="numeric"
                secureTextEntry
              />
            </View>

            {/* Credit Card */}
            <View style={styles.detailField}>
              <Text style={styles.detailLabel}>
                Credit Card (Last 4 digits)
              </Text>
              <TextInput
                style={styles.detailInput}
                placeholder="••••1234"
                value={personalDetails.creditCardNumber}
                onChangeText={(value) =>
                  updatePersonalDetails("creditCardNumber", value)
                }
                keyboardType="numeric"
                maxLength={4}
              />
            </View>

            {/* Debit Card */}
            <View style={styles.detailField}>
              <Text style={styles.detailLabel}>Debit Card (Last 4 digits)</Text>
              <TextInput
                style={styles.detailInput}
                placeholder="••••5678"
                value={personalDetails.debitCardNumber}
                onChangeText={(value) =>
                  updatePersonalDetails("debitCardNumber", value)
                }
                keyboardType="numeric"
                maxLength={4}
              />
            </View>

            <Text style={styles.personalDetailsSection}>
              Emergency Contacts
            </Text>

            {/* Emergency Contact 1 */}
            <View style={styles.emergencyContactCard}>
              <Text style={styles.emergencyContactTitle}>
                Primary Emergency Contact
              </Text>
              <View style={styles.detailField}>
                <Text style={styles.detailLabel}>Name</Text>
                <TextInput
                  style={styles.detailInput}
                  placeholder="Full Name"
                  value={personalDetails.emergencyContact1.name}
                  onChangeText={(value) =>
                    updateEmergencyContact(1, "name", value)
                  }
                />
              </View>
              <View style={styles.detailField}>
                <Text style={styles.detailLabel}>Relation</Text>
                <TextInput
                  style={styles.detailInput}
                  placeholder="e.g., Spouse, Parent, Sibling"
                  value={personalDetails.emergencyContact1.relation}
                  onChangeText={(value) =>
                    updateEmergencyContact(1, "relation", value)
                  }
                />
              </View>
              <View style={styles.detailField}>
                <Text style={styles.detailLabel}>Phone Number</Text>
                <TextInput
                  style={styles.detailInput}
                  placeholder="+91 98765 43210"
                  value={personalDetails.emergencyContact1.phone}
                  onChangeText={(value) =>
                    updateEmergencyContact(1, "phone", value)
                  }
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Emergency Contact 2 */}
            <View style={styles.emergencyContactCard}>
              <Text style={styles.emergencyContactTitle}>
                Secondary Emergency Contact
              </Text>
              <View style={styles.detailField}>
                <Text style={styles.detailLabel}>Name</Text>
                <TextInput
                  style={styles.detailInput}
                  placeholder="Full Name"
                  value={personalDetails.emergencyContact2.name}
                  onChangeText={(value) =>
                    updateEmergencyContact(2, "name", value)
                  }
                />
              </View>
              <View style={styles.detailField}>
                <Text style={styles.detailLabel}>Relation</Text>
                <TextInput
                  style={styles.detailInput}
                  placeholder="e.g., Friend, Colleague"
                  value={personalDetails.emergencyContact2.relation}
                  onChangeText={(value) =>
                    updateEmergencyContact(2, "relation", value)
                  }
                />
              </View>
              <View style={styles.detailField}>
                <Text style={styles.detailLabel}>Phone Number</Text>
                <TextInput
                  style={styles.detailInput}
                  placeholder="+91 98765 43210"
                  value={personalDetails.emergencyContact2.phone}
                  onChangeText={(value) =>
                    updateEmergencyContact(2, "phone", value)
                  }
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <Text style={styles.personalDetailsSection}>
              Travel & Medical Information
            </Text>

            {/* Travel Details */}
            <View style={styles.detailField}>
              <Text style={styles.detailLabel}>Frequent Flyer Number</Text>
              <TextInput
                style={styles.detailInput}
                placeholder="Airline membership number"
                value={personalDetails.frequentFlyerNumber}
                onChangeText={(value) =>
                  updatePersonalDetails("frequentFlyerNumber", value)
                }
              />
            </View>

            <View style={styles.detailField}>
              <Text style={styles.detailLabel}>Travel Insurance Policy</Text>
              <TextInput
                style={styles.detailInput}
                placeholder="Policy number"
                value={personalDetails.travelInsurancePolicy}
                onChangeText={(value) =>
                  updatePersonalDetails("travelInsurancePolicy", value)
                }
              />
            </View>

            {/* Medical Information */}
            <View style={styles.detailField}>
              <Text style={styles.detailLabel}>Blood Group</Text>
              <TextInput
                style={styles.detailInput}
                placeholder="A+, B+, AB+, O+, etc."
                value={personalDetails.bloodGroup}
                onChangeText={(value) =>
                  updatePersonalDetails("bloodGroup", value)
                }
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.detailField}>
              <Text style={styles.detailLabel}>Allergies</Text>
              <TextInput
                style={styles.detailInput}
                placeholder="Food allergies, medications, etc."
                value={personalDetails.allergies}
                onChangeText={(value) =>
                  updatePersonalDetails("allergies", value)
                }
                multiline
              />
            </View>

            <View style={styles.detailField}>
              <Text style={styles.detailLabel}>Medical Conditions</Text>
              <TextInput
                style={styles.detailInput}
                placeholder="Chronic conditions, medications"
                value={personalDetails.medicalConditions}
                onChangeText={(value) =>
                  updatePersonalDetails("medicalConditions", value)
                }
                multiline
              />
            </View>

            <Text style={styles.personalDetailsSection}>
              Additional Information
            </Text>

            {/* Personal Information */}
            <View style={styles.detailField}>
              <Text style={styles.detailLabel}>Date of Birth</Text>
              <TextInput
                style={styles.detailInput}
                placeholder="DD/MM/YYYY"
                value={personalDetails.dateOfBirth}
                onChangeText={(value) =>
                  updatePersonalDetails("dateOfBirth", value)
                }
              />
            </View>

            <View style={styles.detailField}>
              <Text style={styles.detailLabel}>Nationality</Text>
              <TextInput
                style={styles.detailInput}
                placeholder="Indian, American, etc."
                value={personalDetails.nationality}
                onChangeText={(value) =>
                  updatePersonalDetails("nationality", value)
                }
              />
            </View>

            <View style={styles.detailField}>
              <Text style={styles.detailLabel}>Occupation</Text>
              <TextInput
                style={styles.detailInput}
                placeholder="Your profession"
                value={personalDetails.occupation}
                onChangeText={(value) =>
                  updatePersonalDetails("occupation", value)
                }
              />
            </View>

            <View style={styles.detailField}>
              <Text style={styles.detailLabel}>Address</Text>
              <TextInput
                style={styles.detailInput}
                placeholder="Your complete address"
                value={personalDetails.address}
                onChangeText={(value) =>
                  updatePersonalDetails("address", value)
                }
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={styles.saveDetailsButton}
              onPress={savePersonalDetails}
            >
              <MaterialIcons name="save" size={20} color={COLORS.white} />
              <Text style={styles.saveDetailsButtonText}>
                Save Personal Details
              </Text>
            </TouchableOpacity>

            <View style={styles.securityNote}>
              <MaterialIcons name="security" size={20} color={COLORS.gray600} />
              <Text style={styles.securityNoteText}>
                All personal information is encrypted and stored securely on
                your device. This data is only accessible by you and is never
                shared with third parties.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ChatBot Modal */}
      <ChatBot
        visible={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 24,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.gray900,
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 14,
    color: COLORS.gray600,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
  },
  statItem: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 7,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray600,
  },
  quickSettingsCard: {
    borderRadius: 7,
    overflow: "hidden",
    marginBottom: 24,
  },
  quickSettingsGradient: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.gray900,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 7,
    padding: 12,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.gray900,
  },
  settingAction: {
    fontSize: 14,
    color: COLORS.gray600,
  },
  preferenceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 7,
    padding: 12,
    marginBottom: 8,
  },
  preferenceLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  preferenceLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.gray900,
  },
  preferenceValue: {
    fontSize: 14,
    color: COLORS.gray600,
  },
  actionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 7,
    padding: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  versionContainer: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 32,
  },
  versionText: {
    fontSize: 12,
    color: COLORS.gray400,
  },
  aiStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.orange50,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
    gap: 6,
  },
  aiStatusText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "500",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  aiIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.orange50,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  aiIndicatorText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "500",
  },
  aiInsightCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  aiInsightGradient: {
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  aiInsightText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.amber600,
    fontWeight: "500",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.gray900,
  },
  formContainer: {
    gap: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.gray900,
    marginBottom: 4,
  },
  formInput: {
    borderWidth: 1,
    borderColor: COLORS.gray100,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: COLORS.gray50,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray400,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: COLORS.gray600,
    fontWeight: "500",
  },
  saveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "500",
  },
  // Privacy Modal Styles
  privacyContainer: {
    maxHeight: 400,
  },
  privacySection: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.gray900,
    marginTop: 16,
    marginBottom: 12,
  },
  privacyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  privacyLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  privacyLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.gray900,
    marginLeft: 12,
  },
  // Help Modal Styles
  helpContainer: {
    maxHeight: 450,
  },
  helpSection: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.gray900,
    marginTop: 16,
    marginBottom: 12,
  },
  helpItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  helpLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  helpTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  helpLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.gray900,
  },
  helpDesc: {
    fontSize: 12,
    color: COLORS.gray600,
    marginTop: 2,
  },
  liveBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 8,
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: COLORS.white,
  },
  // Personal Details Styles
  personalDetailsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  personalDetailsSection: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.gray900,
    marginTop: 24,
    marginBottom: 8,
  },
  personalDetailsDesc: {
    fontSize: 14,
    color: COLORS.gray600,
    marginBottom: 20,
    lineHeight: 20,
  },
  detailField: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.gray900,
    marginBottom: 6,
  },
  detailInput: {
    borderWidth: 1,
    borderColor: COLORS.gray100,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.gray900,
    backgroundColor: COLORS.gray50,
  },
  emergencyContactCard: {
    backgroundColor: COLORS.orange50,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.gray100,
  },
  emergencyContactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray900,
    marginBottom: 12,
  },
  saveDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 16,
    gap: 8,
  },
  saveDetailsButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.amber50,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  securityNoteText: {
    fontSize: 12,
    color: COLORS.gray600,
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  // Personal Details Modal Styles
  personalDetailsModalContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  personalDetailsModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  personalDetailsModalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.gray900,
  },
  personalDetailsScrollContent: {
    paddingBottom: 20,
  },
});
