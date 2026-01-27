import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  Modal,
  TextInput,
  Alert,
  Dimensions,
  Linking,
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
  gray200: "#e5e7eb",
  gray400: "#9ca3af",
  gray500: "#6b7280",
  gray600: "#4b5563",
  gray700: "#374151",
  gray800: "#1f2937",
  gray900: "#111827",
  blue50: "#eff6ff",
  blue600: "#2563eb",
  green50: "#f0fdf4",
  green600: "#16a34a",
  orange50: "#fff7ed",
  orange500: "#f97316",
  orange600: "#ea580c",
  red50: "#fef2f2",
  red600: "#dc2626",
};

interface EmergencyService {
  id: string;
  name: string;
  type: "hospital" | "pharmacy" | "atm" | "police";
  address: string;
  distance: string;
  phone?: string;
  isOpen: boolean;
  rating?: number;
  coordinates: { lat: number; lng: number };
}

interface UserLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export default function HomeScreen() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Modal states
  const [tripAtlasModal, setTripAtlasModal] = useState(false);
  const [emergencyModal, setEmergencyModal] = useState(false);

  // Emergency services states
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [emergencyServices, setEmergencyServices] = useState<
    EmergencyService[]
  >([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState<
    "all" | "hospital" | "pharmacy" | "atm" | "police"
  >("all");
  const [smartBookingsModal, setSmartBookingsModal] = useState(false);
  const [postGeneratorModal, setPostGeneratorModal] = useState(false);
  const [locationHistoryModal, setLocationHistoryModal] = useState(false);

  // Trip Atlas states
  const [tripForm, setTripForm] = useState({
    destination: "",
    duration: "",
    foodPreferences: "",
    travelCompanions: "",
    travelStyle: "",
    budgetRange: "",
  });
  const [showTripRoute, setShowTripRoute] = useState(false);
  const [isGeneratingRoute, setIsGeneratingRoute] = useState(false);

  // Smart Bookings states
  const [selectedBudgetType, setSelectedBudgetType] = useState("");
  const [showBookings, setShowBookings] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  // Post Generator states
  const [generatedPost, setGeneratedPost] = useState("");
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
  const [showPostEditor, setShowPostEditor] = useState(false);

  // Add Trip states
  const [addTripModal, setAddTripModal] = useState(false);
  const [newTripForm, setNewTripForm] = useState({
    tripName: "",
    destination: "",
    startDate: "",
    endDate: "",
  });
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);

  // Upcoming trips state
  const [upcomingTrips, setUpcomingTrips] = useState([
    {
      id: 1,
      tripName: "Tokyo Adventure",
      destination: "Tokyo, Japan",
      dates: "Jan 10-20, 2025",
      status: "Planning",
    },
    {
      id: 2,
      tripName: "Alpine Escape",
      destination: "Swiss Alps",
      dates: "Mar 5-12, 2025",
      status: "Saved",
    },
  ]);

  // Handler functions for Quick Actions
  const handleQuickAction = (actionLabel: string) => {
    switch (actionLabel) {
      case "Trip Atlas":
        setTripAtlasModal(true);
        break;
      case "Post Generator":
        setPostGeneratorModal(true);
        break;
      case "Smart Bookings":
        setSmartBookingsModal(true);
        break;
      case "Location History":
        setLocationHistoryModal(true);
        break;
      case "Emergency Finder":
        setEmergencyModal(true);
        handleLocationDetection();
        break;
      default:
        Alert.alert(
          "Coming Soon",
          `${actionLabel} feature will be available soon!`
        );
    }
  };

  const handleGenerateRoute = () => {
    if (
      !tripForm.destination ||
      !tripForm.duration ||
      !tripForm.travelStyle ||
      !tripForm.budgetRange
    ) {
      Alert.alert(
        "Missing Information",
        "Please fill in all required fields to generate your itinerary."
      );
      return;
    }

    setIsGeneratingRoute(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsGeneratingRoute(false);
      setShowTripRoute(true);
    }, 2000);
  };

  const handleBookingFilter = (budgetType: string) => {
    setSelectedBudgetType(budgetType);
    setIsLoadingBookings(true);
    // Simulate AI curation
    setTimeout(() => {
      setIsLoadingBookings(false);
      setShowBookings(true);
    }, 1500);
  };

  const handleGeneratePost = () => {
    setIsGeneratingPost(true);
    // Simulate data collection and AI generation
    setTimeout(() => {
      setGeneratedPost(
        "🗾 Just wrapped up an incredible Tokyo adventure! From sunrise at Senso-ji Temple to late-night ramen in Shibuya 🍜 ✨ 15 new spots discovered, 247 photos captured, and memories for a lifetime. Budget: $1,850 well spent! 📸 #TokyoAdventure #TravelMemories #AIGenerated"
      );
      setIsGeneratingPost(false);
      setShowPostEditor(true);
    }, 2500);
  };

  const handleAddTrip = () => {
    setAddTripModal(true);
  };

  const handleCreateTrip = () => {
    if (
      !newTripForm.tripName ||
      !newTripForm.destination ||
      !newTripForm.startDate ||
      !newTripForm.endDate
    ) {
      Alert.alert(
        "Missing Information",
        "Please fill in all fields to create your trip."
      );
      return;
    }

    setIsCreatingTrip(true);

    // Simulate trip creation process
    setTimeout(() => {
      const newTrip = {
        id: upcomingTrips.length + 1,
        tripName: newTripForm.tripName,
        destination: newTripForm.destination,
        dates: `${new Date(newTripForm.startDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}-${new Date(newTripForm.endDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`,
        status: "Planning",
      };

      setUpcomingTrips([newTrip, ...upcomingTrips]);
      setIsCreatingTrip(false);
      setAddTripModal(false);

      // Reset form
      setNewTripForm({
        tripName: "",
        destination: "",
        startDate: "",
        endDate: "",
      });

      // Show success message and redirect to Trip Atlas
      Alert.alert(
        "Trip Created Successfully! 🎉",
        `${newTrip.tripName} has been added to your upcoming trips. Ready to start planning with AI?`,
        [
          { text: "Later", style: "cancel" },
          {
            text: "Start Planning",
            onPress: () => {
              // Pre-fill Trip Atlas with new trip data
              setTripForm({
                destination: newTrip.destination,
                duration: "",
                foodPreferences: "",
                travelCompanions: "",
                travelStyle: "",
                budgetRange: "",
              });
              setTripAtlasModal(true);
            },
          },
        ]
      );
    }, 1500);
  };

  // Emergency Services Functions
  const handleLocationDetection = async () => {
    setIsLoadingLocation(true);

    try {
      // Simulate location detection (in a real app, you'd use expo-location)
      setTimeout(() => {
        const mockLocation: UserLocation = {
          latitude: 40.7128,
          longitude: -74.006,
          address: "New York, NY, USA",
        };
        setUserLocation(mockLocation);
        setIsLoadingLocation(false);
        loadEmergencyServices(mockLocation);
      }, 1500);
    } catch (error) {
      setIsLoadingLocation(false);
      Alert.alert(
        "Location Error",
        "Unable to detect your location. Please check your location settings."
      );
    }
  };

  const loadEmergencyServices = (location: UserLocation) => {
    setIsLoadingServices(true);

    // Simulate API call to get nearby emergency services
    setTimeout(() => {
      const mockServices: EmergencyService[] = [
        {
          id: "1",
          name: "Mount Sinai Hospital",
          type: "hospital",
          address: "1468 Madison Ave, New York, NY 10029",
          distance: "0.8 miles",
          phone: "+1 (212) 241-6500",
          isOpen: true,
          rating: 4.2,
          coordinates: { lat: 40.7829, lng: -73.9441 },
        },
        {
          id: "2",
          name: "NewYork-Presbyterian Hospital",
          type: "hospital",
          address: "525 E 68th St, New York, NY 10065",
          distance: "1.2 miles",
          phone: "+1 (212) 746-5454",
          isOpen: true,
          rating: 4.5,
          coordinates: { lat: 40.7648, lng: -73.9422 },
        },
        {
          id: "3",
          name: "CVS Pharmacy",
          type: "pharmacy",
          address: "150 E 42nd St, New York, NY 10017",
          distance: "0.3 miles",
          phone: "+1 (212) 687-0924",
          isOpen: true,
          rating: 3.8,
          coordinates: { lat: 40.7527, lng: -73.9772 },
        },
        {
          id: "4",
          name: "Walgreens Pharmacy",
          type: "pharmacy",
          address: "312 Park Ave S, New York, NY 10010",
          distance: "0.5 miles",
          phone: "+1 (212) 685-1096",
          isOpen: false,
          rating: 4.0,
          coordinates: { lat: 40.7441, lng: -73.9834 },
        },
        {
          id: "5",
          name: "Chase Bank ATM",
          type: "atm",
          address: "270 Park Ave, New York, NY 10017",
          distance: "0.2 miles",
          isOpen: true,
          coordinates: { lat: 40.7549, lng: -73.9717 },
        },
        {
          id: "6",
          name: "Bank of America ATM",
          type: "atm",
          address: "42nd St & Broadway, New York, NY 10036",
          distance: "0.4 miles",
          isOpen: true,
          coordinates: { lat: 40.759, lng: -73.9845 },
        },
        {
          id: "7",
          name: "NYPD Midtown North Precinct",
          type: "police",
          address: "306 W 54th St, New York, NY 10019",
          distance: "0.6 miles",
          phone: "+1 (212) 767-8400",
          isOpen: true,
          coordinates: { lat: 40.7674, lng: -73.9857 },
        },
      ];

      setEmergencyServices(mockServices);
      setIsLoadingServices(false);
    }, 1000);
  };

  const handleCallService = (phone: string) => {
    Alert.alert("Call Service", `Do you want to call ${phone}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Call", onPress: () => Linking.openURL(`tel:${phone}`) },
    ]);
  };

  const handleGetDirections = (service: EmergencyService) => {
    const url = `https://maps.google.com/?q=${service.coordinates.lat},${service.coordinates.lng}`;
    Linking.openURL(url);
  };

  const getFilteredServices = () => {
    if (selectedServiceType === "all") {
      return emergencyServices;
    }
    return emergencyServices.filter(
      (service) => service.type === selectedServiceType
    );
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "hospital":
        return "local-hospital";
      case "pharmacy":
        return "local-pharmacy";
      case "atm":
        return "atm";
      case "police":
        return "local-police";
      default:
        return "place";
    }
  };

  const getServiceColor = (type: string) => {
    switch (type) {
      case "hospital":
        return "#dc2626";
      case "pharmacy":
        return "#16a34a";
      case "atm":
        return "#2563eb";
      case "police":
        return "#7c3aed";
      default:
        return COLORS.primary;
    }
  };

  const currentTrip = {
    destination: "Paris, France",
    dates: "Dec 15-22, 2024",
    daysLeft: 12,
    budget: 2500,
    spent: 450,
    image: "https://images.unsplash.com/photo-1646494836291-dccc011e3d83",
  };

  const quickActions = [
    { icon: "book", label: "Trip Atlas", color: COLORS.blue600 },
    { icon: "auto-awesome", label: "Post Generator", color: COLORS.orange600 },
    {
      icon: "event-available",
      label: "Smart Bookings",
      color: COLORS.green600,
    },
    { icon: "location-history", label: "Location History", color: "#8b5cf6" },
  ];

  return (
    <>
      {/* Trip Atlas Modal */}
      <Modal
        visible={tripAtlasModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setTripAtlasModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>✨ AI Itinerary Builder</Text>
              <TouchableOpacity
                onPress={() => {
                  setTripAtlasModal(false);
                  setShowTripRoute(false);
                  setTripForm({
                    destination: "",
                    duration: "",
                    foodPreferences: "",
                    travelCompanions: "",
                    travelStyle: "",
                    budgetRange: "",
                  });
                }}
              >
                <MaterialIcons name="close" size={24} color={COLORS.gray600} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalHeaderContent}>
              <Text style={styles.modalDescription}>
                Let AI create a personalized itinerary based on your preferences
                and travel style
              </Text>
            </View>

            {!showTripRoute ? (
              <View style={styles.formContainer}>
                <Text style={styles.formLabel}>Travel Style</Text>
                <View style={styles.optionGrid}>
                  {["Cultural", "Adventure", "Relaxation", "Food & Wine"].map(
                    (style) => (
                      <TouchableOpacity
                        key={style}
                        style={[
                          styles.optionButton,
                          tripForm.travelStyle === style &&
                            styles.optionButtonSelected,
                        ]}
                        onPress={() =>
                          setTripForm({ ...tripForm, travelStyle: style })
                        }
                      >
                        <Text
                          style={[
                            styles.optionButtonText,
                            tripForm.travelStyle === style &&
                              styles.optionButtonTextSelected,
                          ]}
                        >
                          {style}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>

                <Text style={styles.formLabel}>Budget Range</Text>
                <View style={styles.optionGrid}>
                  {["Budget", "Mid-Range", "Luxury", "Premium"].map(
                    (budget) => (
                      <TouchableOpacity
                        key={budget}
                        style={[
                          styles.optionButton,
                          tripForm.budgetRange === budget &&
                            styles.optionButtonSelected,
                        ]}
                        onPress={() =>
                          setTripForm({ ...tripForm, budgetRange: budget })
                        }
                      >
                        <Text
                          style={[
                            styles.optionButtonText,
                            tripForm.budgetRange === budget &&
                              styles.optionButtonTextSelected,
                          ]}
                        >
                          {budget}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>

                <Text style={styles.formLabel}>Destination</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Where would you like to go?"
                  value={tripForm.destination}
                  onChangeText={(text) =>
                    setTripForm({ ...tripForm, destination: text })
                  }
                />

                <Text style={styles.formLabel}>Trip Duration</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="How many days?"
                  value={tripForm.duration}
                  onChangeText={(text) =>
                    setTripForm({ ...tripForm, duration: text })
                  }
                  keyboardType="numeric"
                />

                <Text style={styles.formLabel}>Food Preferences</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Any dietary preferences or favorite cuisines?"
                  value={tripForm.foodPreferences}
                  onChangeText={(text) =>
                    setTripForm({ ...tripForm, foodPreferences: text })
                  }
                />

                <Text style={styles.formLabel}>Travel Companions</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Who are you traveling with?"
                  value={tripForm.travelCompanions}
                  onChangeText={(text) =>
                    setTripForm({ ...tripForm, travelCompanions: text })
                  }
                />

                <TouchableOpacity
                  style={styles.generateButton}
                  onPress={handleGenerateRoute}
                  disabled={isGeneratingRoute}
                >
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.secondary]}
                    style={styles.generateButtonGradient}
                  >
                    {isGeneratingRoute ? (
                      <Text style={styles.generateButtonText}>
                        🤖 Building Itinerary...
                      </Text>
                    ) : (
                      <Text style={styles.generateButtonText}>
                        Build AI Itinerary
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.routeResult}>
                <View style={styles.itineraryHeader}>
                  <Text style={styles.resultTitle}>
                    Your Personalized Itinerary
                  </Text>
                  <View style={styles.matchBadge}>
                    <MaterialIcons
                      name="verified"
                      size={16}
                      color={COLORS.orange600}
                    />
                    <Text style={styles.matchText}>92% Match</Text>
                  </View>
                </View>

                <View style={styles.itineraryDays}>
                  <View style={styles.dayCard}>
                    <Text style={styles.dayTitle}>
                      Day 1 - Cultural Experience
                    </Text>

                    <View style={styles.activityItem}>
                      <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>9:00 AM</Text>
                        <Text style={styles.durationText}>3h</Text>
                      </View>
                      <View style={styles.activityDetails}>
                        <Text style={styles.activityName}>
                          Tokyo National Museum
                        </Text>
                        <Text style={styles.activityType}>CULTURAL</Text>
                      </View>
                      <MaterialIcons
                        name="more-horiz"
                        size={20}
                        color={COLORS.gray400}
                      />
                    </View>

                    <View style={styles.activityItem}>
                      <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>11:30 AM</Text>
                        <Text style={styles.durationText}>1.5h</Text>
                      </View>
                      <View style={styles.activityDetails}>
                        <Text style={styles.activityName}>Senso-ji Temple</Text>
                        <Text style={styles.activityType}>CULTURAL</Text>
                      </View>
                      <MaterialIcons
                        name="more-horiz"
                        size={20}
                        color={COLORS.gray400}
                      />
                    </View>

                    <View style={styles.activityItem}>
                      <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>1:00 PM</Text>
                        <Text style={styles.durationText}>2h</Text>
                      </View>
                      <View style={styles.activityDetails}>
                        <Text style={styles.activityName}>
                          Tsukiji Outer Market
                        </Text>
                        <Text style={styles.activityType}>FOOD & CULTURE</Text>
                      </View>
                      <MaterialIcons
                        name="more-horiz"
                        size={20}
                        color={COLORS.gray400}
                      />
                    </View>
                  </View>
                </View>

                <TouchableOpacity style={styles.chooseButton}>
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.secondary]}
                    style={styles.chooseButtonGradient}
                  >
                    <Text style={styles.chooseButtonText}>
                      Save This Itinerary
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Smart Bookings Modal */}
      <Modal
        visible={smartBookingsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSmartBookingsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                🏨 Smart Bookings - AI Curated
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSmartBookingsModal(false);
                  setShowBookings(false);
                  setSelectedBudgetType("");
                }}
              >
                <MaterialIcons name="close" size={24} color={COLORS.gray600} />
              </TouchableOpacity>
            </View>

            {!showBookings ? (
              <View style={styles.filterContainer}>
                <Text style={styles.filterTitle}>Select Your Preference</Text>

                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    selectedBudgetType === "budget" && styles.selectedFilter,
                  ]}
                  onPress={() => handleBookingFilter("budget")}
                >
                  <Text style={styles.filterEmoji}>💰</Text>
                  <View style={styles.filterTextContainer}>
                    <Text style={styles.filterLabel}>Budget</Text>
                    <Text style={styles.filterDesc}>
                      Affordable stays, great value
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    selectedBudgetType === "standard" && styles.selectedFilter,
                  ]}
                  onPress={() => handleBookingFilter("standard")}
                >
                  <Text style={styles.filterEmoji}>✨</Text>
                  <View style={styles.filterTextContainer}>
                    <Text style={styles.filterLabel}>Standard</Text>
                    <Text style={styles.filterDesc}>
                      Comfortable mid-range options
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    selectedBudgetType === "luxury" && styles.selectedFilter,
                  ]}
                  onPress={() => handleBookingFilter("luxury")}
                >
                  <Text style={styles.filterEmoji}>💎</Text>
                  <View style={styles.filterTextContainer}>
                    <Text style={styles.filterLabel}>Luxury</Text>
                    <Text style={styles.filterDesc}>Premium experiences</Text>
                  </View>
                </TouchableOpacity>

                {isLoadingBookings && (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>
                      🤖 AI Curating Top Stays...
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.bookingsResult}>
                <Text style={styles.resultTitle}>🎯 AI Recommended Stays</Text>

                {[
                  {
                    name: "Grand Central Hotel",
                    rating: 4.8,
                    price: "$120",
                    badge: "Best Value",
                  },
                  {
                    name: "Boutique Urban Lodge",
                    rating: 4.9,
                    price: "$85",
                    badge: "Hidden Gem",
                  },
                  {
                    name: "Downtown Comfort Inn",
                    rating: 4.7,
                    price: "$95",
                    badge: "Great Location",
                  },
                ].map((hotel, index) => (
                  <View key={index} style={styles.hotelCard}>
                    <View style={styles.hotelInfo}>
                      <Text style={styles.hotelName}>{hotel.name}</Text>
                      <View style={styles.hotelMeta}>
                        <MaterialIcons name="star" size={16} color="#fbbf24" />
                        <Text style={styles.hotelRating}>{hotel.rating}</Text>
                        <Text style={styles.hotelPrice}>
                          {hotel.price}/night
                        </Text>
                      </View>
                      <View style={styles.aiBadge}>
                        <Text style={styles.aiBadgeText}>
                          🤖 AI-Recommended: {hotel.badge}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.bookButton}>
                      <Text style={styles.bookButtonText}>Book Now</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* AI Post Generator Modal */}
      <Modal
        visible={postGeneratorModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPostGeneratorModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📸 AI Post Generator</Text>
              <TouchableOpacity
                onPress={() => {
                  setPostGeneratorModal(false);
                  setShowPostEditor(false);
                  setGeneratedPost("");
                }}
              >
                <MaterialIcons name="close" size={24} color={COLORS.gray600} />
              </TouchableOpacity>
            </View>

            {!showPostEditor ? (
              <View style={styles.postGeneratorContainer}>
                <View style={styles.tripDataCard}>
                  <Text style={styles.tripDataTitle}>
                    📊 Tokyo Adventure - Completed
                  </Text>
                  <View style={styles.tripStats}>
                    <Text style={styles.tripStat}>📸 Photos: 247</Text>
                    <Text style={styles.tripStat}>📍 Places Visited: 15</Text>
                    <Text style={styles.tripStat}>💰 Total Spent: $1,850</Text>
                    <Text style={styles.tripStat}>⭐ Highlights: 8</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.generatePostButton}
                  onPress={handleGeneratePost}
                  disabled={isGeneratingPost}
                >
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.secondary]}
                    style={styles.generateButtonGradient}
                  >
                    {isGeneratingPost ? (
                      <Text style={styles.generateButtonText}>
                        🤖 Collecting Trip Data...
                      </Text>
                    ) : (
                      <Text style={styles.generateButtonText}>
                        Generate AI Travel Post
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.postEditorContainer}>
                <Text style={styles.resultTitle}>
                  ✨ Generated Travel Recap
                </Text>

                <TextInput
                  style={styles.postEditor}
                  multiline
                  value={generatedPost}
                  onChangeText={setGeneratedPost}
                  placeholder="Your AI-generated post will appear here..."
                />

                <Text style={styles.editLabel}>📝 User Edits (Optional)</Text>

                <View style={styles.socialShareContainer}>
                  <Text style={styles.shareTitle}>Export to:</Text>
                  <View style={styles.socialButtons}>
                    <TouchableOpacity style={styles.socialButton}>
                      <Text style={styles.socialIcon}>📷</Text>
                      <Text style={styles.socialText}>Instagram</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}>
                      <Text style={styles.socialIcon}>📘</Text>
                      <Text style={styles.socialText}>Facebook</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}>
                      <Text style={styles.socialIcon}>🐦</Text>
                      <Text style={styles.socialText}>X (Twitter)</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Location History Modal */}
      <Modal
        visible={locationHistoryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLocationHistoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📍 Location History</Text>
              <TouchableOpacity onPress={() => setLocationHistoryModal(false)}>
                <MaterialIcons name="close" size={24} color={COLORS.gray600} />
              </TouchableOpacity>
            </View>

            <View style={styles.locationContainer}>
              <Text style={styles.resultTitle}>🗺️ Your Tokyo Journey</Text>

              <View style={styles.mapPlaceholder}>
                <MaterialIcons name="map" size={60} color={COLORS.primary} />
                <Text style={styles.mapText}>GPS Journey Map</Text>
                <Text style={styles.mapSubtext}>
                  Color-coded path visualization
                </Text>
              </View>

              <View style={styles.journeyStats}>
                <View style={styles.journeyStatItem}>
                  <MaterialIcons
                    name="check-circle"
                    size={20}
                    color={COLORS.green600}
                  />
                  <Text style={styles.journeyStatText}>15 Check-ins</Text>
                </View>
                <View style={styles.journeyStatItem}>
                  <MaterialIcons
                    name="camera-alt"
                    size={20}
                    color={COLORS.blue600}
                  />
                  <Text style={styles.journeyStatText}>247 Photos</Text>
                </View>
                <View style={styles.journeyStatItem}>
                  <MaterialIcons
                    name="place"
                    size={20}
                    color={COLORS.orange600}
                  />
                  <Text style={styles.journeyStatText}>32 Visits</Text>
                </View>
              </View>

              <View style={styles.recentLocations}>
                <Text style={styles.locationsTitle}>Recent Locations</Text>
                {[
                  {
                    name: "Senso-ji Temple",
                    time: "2 hours ago",
                    type: "check-in",
                  },
                  {
                    name: "Shibuya Crossing",
                    time: "4 hours ago",
                    type: "photo",
                  },
                  {
                    name: "Tsukiji Market",
                    time: "6 hours ago",
                    type: "visit",
                  },
                ].map((location, index) => (
                  <View key={index} style={styles.locationItem}>
                    <MaterialIcons
                      name={
                        location.type === "check-in"
                          ? "check-circle"
                          : location.type === "photo"
                          ? "camera-alt"
                          : "place"
                      }
                      size={16}
                      color={
                        location.type === "check-in"
                          ? COLORS.green600
                          : location.type === "photo"
                          ? COLORS.blue600
                          : COLORS.orange600
                      }
                    />
                    <View style={styles.locationDetails}>
                      <Text style={styles.locationName}>{location.name}</Text>
                      <Text style={styles.locationTime}>{location.time}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Trip Modal */}
      <Modal
        visible={addTripModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddTripModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>✈️ Create New Trip</Text>
              <TouchableOpacity
                onPress={() => {
                  setAddTripModal(false);
                  setNewTripForm({
                    tripName: "",
                    destination: "",
                    startDate: "",
                    endDate: "",
                  });
                }}
              >
                <MaterialIcons name="close" size={24} color={COLORS.gray600} />
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.formSubtitle}>
                Let's start planning your next adventure! Fill in the details
                below to create your trip.
              </Text>

              <Text style={styles.formLabel}>Trip Name</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Mediterranean Cruise, Bali Adventure"
                value={newTripForm.tripName}
                onChangeText={(text) =>
                  setNewTripForm({ ...newTripForm, tripName: text })
                }
              />

              <Text style={styles.formLabel}>Destination</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Copenhagen, Denmark or Kyoto, Japan"
                value={newTripForm.destination}
                onChangeText={(text) =>
                  setNewTripForm({ ...newTripForm, destination: text })
                }
              />

              <View style={styles.dateRow}>
                <View style={styles.dateColumn}>
                  <Text style={styles.formLabel}>Start Date</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="YYYY-MM-DD"
                    value={newTripForm.startDate}
                    onChangeText={(text) =>
                      setNewTripForm({ ...newTripForm, startDate: text })
                    }
                  />
                </View>

                <View style={styles.dateColumn}>
                  <Text style={styles.formLabel}>End Date</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="YYYY-MM-DD"
                    value={newTripForm.endDate}
                    onChangeText={(text) =>
                      setNewTripForm({ ...newTripForm, endDate: text })
                    }
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.createTripButton}
                onPress={handleCreateTrip}
                disabled={isCreatingTrip}
              >
                <LinearGradient
                  colors={[COLORS.primary, COLORS.secondary]}
                  style={styles.createTripButtonGradient}
                >
                  {isCreatingTrip ? (
                    <Text style={styles.createTripButtonText}>
                      🎯 Creating Your Trip...
                    </Text>
                  ) : (
                    <Text style={styles.createTripButtonText}>
                      Start Planning
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <Text style={styles.planningNote}>
                💡 After creation, you'll be able to use AI Trip Atlas for
                intelligent route planning!
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Emergency Services Modal */}
      <Modal
        visible={emergencyModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEmergencyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.emergencyModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🚨 Emergency Services</Text>
              <TouchableOpacity onPress={() => setEmergencyModal(false)}>
                <MaterialIcons name="close" size={24} color={COLORS.gray600} />
              </TouchableOpacity>
            </View>

            {/* Location Status */}
            <View style={styles.locationStatus}>
              <MaterialIcons
                name="my-location"
                size={16}
                color={COLORS.primary}
              />
              <Text style={styles.locationText}>
                {isLoadingLocation
                  ? "Detecting your location..."
                  : userLocation
                  ? `📍 ${userLocation.address}`
                  : "Location unavailable"}
              </Text>
            </View>

            {/* Service Type Filter */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.emergencyFilterContainer}
            >
              {[
                { key: "all", label: "All", icon: "apps" },
                { key: "hospital", label: "Hospitals", icon: "local-hospital" },
                {
                  key: "pharmacy",
                  label: "Pharmacies",
                  icon: "local-pharmacy",
                },
                { key: "atm", label: "ATMs", icon: "atm" },
                { key: "police", label: "Police", icon: "local-police" },
              ].map((filter) => (
                <TouchableOpacity
                  key={filter.key}
                  style={[
                    styles.filterChip,
                    selectedServiceType === filter.key &&
                      styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedServiceType(filter.key as any)}
                >
                  <MaterialIcons
                    name={filter.icon as any}
                    size={16}
                    color={
                      selectedServiceType === filter.key
                        ? COLORS.white
                        : COLORS.gray600
                    }
                  />
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedServiceType === filter.key &&
                        styles.filterChipTextActive,
                    ]}
                  >
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Services List */}
            <ScrollView style={styles.servicesList}>
              {isLoadingServices ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>
                    🔍 Finding nearby services...
                  </Text>
                </View>
              ) : (
                getFilteredServices().map((service) => (
                  <View key={service.id} style={styles.serviceCard}>
                    <View style={styles.serviceHeader}>
                      <View style={styles.serviceIconContainer}>
                        <MaterialIcons
                          name={getServiceIcon(service.type) as any}
                          size={24}
                          color={getServiceColor(service.type)}
                        />
                      </View>
                      <View style={styles.serviceInfo}>
                        <Text style={styles.serviceName}>{service.name}</Text>
                        <Text style={styles.serviceAddress}>
                          {service.address}
                        </Text>
                        <View style={styles.serviceDetails}>
                          <Text style={styles.serviceDistance}>
                            📍 {service.distance}
                          </Text>
                          <View
                            style={[
                              styles.statusBadge,
                              {
                                backgroundColor: service.isOpen
                                  ? "#16a34a"
                                  : "#dc2626",
                              },
                            ]}
                          >
                            <Text style={styles.statusText}>
                              {service.isOpen ? "Open" : "Closed"}
                            </Text>
                          </View>
                          {service.rating && (
                            <View style={styles.ratingContainer}>
                              <MaterialIcons
                                name="star"
                                size={14}
                                color="#fbbf24"
                              />
                              <Text style={styles.ratingText}>
                                {service.rating}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>

                    <View style={styles.serviceActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleGetDirections(service)}
                      >
                        <MaterialIcons
                          name="directions"
                          size={18}
                          color={COLORS.primary}
                        />
                        <Text style={styles.actionButtonText}>Directions</Text>
                      </TouchableOpacity>

                      {service.phone && (
                        <TouchableOpacity
                          style={[styles.actionButton, styles.callButton]}
                          onPress={() => handleCallService(service.phone!)}
                        >
                          <MaterialIcons
                            name="phone"
                            size={18}
                            color={COLORS.white}
                          />
                          <Text
                            style={[
                              styles.actionButtonText,
                              styles.callButtonText,
                            ]}
                          >
                            Call
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))
              )}

              {!isLoadingServices && getFilteredServices().length === 0 && (
                <View style={styles.noResultsContainer}>
                  <MaterialIcons
                    name="search-off"
                    size={48}
                    color={COLORS.gray400}
                  />
                  <Text style={styles.noResultsText}>
                    No{" "}
                    {selectedServiceType === "all"
                      ? "services"
                      : selectedServiceType + "s"}{" "}
                    found nearby
                  </Text>
                  <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={() =>
                      userLocation && loadEmergencyServices(userLocation)
                    }
                  >
                    <Text style={styles.refreshButtonText}>Refresh</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>

            {/* Emergency Hotlines */}
            <View style={styles.emergencyHotlines}>
              <Text style={styles.hotlineTitle}>Emergency Hotlines</Text>
              <View style={styles.hotlineButtons}>
                <TouchableOpacity
                  style={styles.hotlineButton}
                  onPress={() => Linking.openURL("tel:911")}
                >
                  <Text style={styles.hotlineButtonText}>🚑 911</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.hotlineButton}
                  onPress={() => Linking.openURL("tel:311")}
                >
                  <Text style={styles.hotlineButtonText}>ℹ️ 311</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.hotlineButton}
                  onPress={() => Linking.openURL("tel:411")}
                >
                  <Text style={styles.hotlineButtonText}>📞 411</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

        {/* Background */}
        <LinearGradient
          colors={[COLORS.orange50, COLORS.white]}
          style={styles.backgroundGradient}
        />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.appNameContainer}>
              <MaterialIcons name="location-on" size={24} color="#8B5CF6" />
              <Text style={styles.appName}>Wayora</Text>
            </View>
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome back!</Text>
              <Text style={styles.nameText}>Alex Thompson</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationButton}>
              <MaterialIcons
                name="notifications"
                size={24}
                color={COLORS.red600}
              />
            </TouchableOpacity>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AT</Text>
            </View>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Current Trip Card */}
          <View style={styles.currentTripCard}>
            <Image
              source={{ uri: currentTrip.image }}
              style={styles.tripImage}
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.6)"]}
              style={styles.tripOverlay}
            />
            <View style={styles.tripContent}>
              <View style={styles.tripHeader}>
                <MaterialIcons
                  name="location-on"
                  size={16}
                  color={COLORS.white}
                />
                <Text style={styles.tripDestination}>
                  {currentTrip.destination}
                </Text>
              </View>
              <Text style={styles.tripDates}>{currentTrip.dates}</Text>
              <Text style={styles.tripCountdown}>
                {currentTrip.daysLeft} days to go!
              </Text>
            </View>
          </View>

          {/* Budget Progress */}
          <View style={styles.budgetCard}>
            <LinearGradient
              colors={[COLORS.green50, COLORS.blue50]}
              style={styles.budgetGradient}
            >
              <View style={styles.budgetHeader}>
                <Text style={styles.budgetLabel}>Budget Progress</Text>
                <Text style={styles.budgetAmount}>
                  ${currentTrip.spent} / ${currentTrip.budget}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${
                        (currentTrip.spent / currentTrip.budget) * 100
                      }%`,
                    },
                  ]}
                />
              </View>
            </LinearGradient>
          </View>

          {/* AI-Powered Quick Actions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>AI-Powered Actions</Text>
              <View style={styles.aiIndicator}>
                <MaterialIcons
                  name="auto-awesome"
                  size={14}
                  color={COLORS.orange600}
                />
                <Text style={styles.aiIndicatorText}>Smart</Text>
              </View>
            </View>
            <View style={styles.quickActionsGrid}>
              {/* First Row: Trip Atlas, Post Generator */}
              <View style={styles.quickActionRow}>
                {quickActions.slice(0, 2).map((action, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.quickActionCard}
                    onPress={() => handleQuickAction(action.label)}
                  >
                    <View
                      style={[
                        styles.quickActionIcon,
                        { backgroundColor: `${action.color}20` },
                      ]}
                    >
                      <MaterialIcons
                        name={action.icon as any}
                        size={20}
                        color={action.color}
                      />
                    </View>
                    <Text style={styles.quickActionLabel}>{action.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Second Row: Smart Bookings, Location History */}
              <View style={styles.quickActionRow}>
                {quickActions.slice(2, 4).map((action, index) => (
                  <TouchableOpacity
                    key={index + 2}
                    style={styles.quickActionCard}
                    onPress={() => handleQuickAction(action.label)}
                  >
                    <View
                      style={[
                        styles.quickActionIcon,
                        { backgroundColor: `${action.color}20` },
                      ]}
                    >
                      <MaterialIcons
                        name={action.icon as any}
                        size={20}
                        color={action.color}
                      />
                    </View>
                    <Text style={styles.quickActionLabel}>{action.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Emergency Finder - Refined Design */}
          <View style={styles.emergencySection}>
            <TouchableOpacity
              style={styles.emergencyCard}
              onPress={() => handleQuickAction("Emergency Finder")}
            >
              <LinearGradient
                colors={["#fef2f2", "#fee2e2", "#fecaca"]}
                style={styles.emergencyGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {/* Emergency Icon */}
                <View style={styles.emergencyIconContainer}>
                  <View style={styles.emergencyIconCircle}>
                    <MaterialIcons name="shield" size={28} color="#dc2626" />
                  </View>
                </View>

                {/* Emergency Content */}
                <View style={styles.emergencyContent}>
                  <Text style={styles.emergencyTitle}>
                    �️ Emergency Assistance
                  </Text>
                  <Text style={styles.emergencySubtitle}>
                    Quick access to emergency services, hospitals & safety
                    contacts
                  </Text>
                  <View style={styles.emergencyBadge}>
                    <MaterialIcons
                      name="verified-user"
                      size={12}
                      color="#16a34a"
                    />
                    <Text style={styles.emergencyBadgeText}>Always Ready</Text>
                  </View>
                </View>

                {/* Emergency Arrow */}
                <View style={styles.emergencyArrow}>
                  <MaterialIcons
                    name="chevron-right"
                    size={20}
                    color="#64748b"
                  />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* AI Insights */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>AI Travel Insights</Text>
              <View style={styles.aiIndicator}>
                <MaterialIcons
                  name="psychology"
                  size={14}
                  color={COLORS.orange600}
                />
                <Text style={styles.aiIndicatorText}>Powered by AI</Text>
              </View>
            </View>

            <View style={styles.insightCard}>
              <LinearGradient
                colors={[COLORS.blue50, COLORS.orange50]}
                style={styles.insightGradient}
              >
                <MaterialIcons
                  name="lightbulb"
                  size={20}
                  color={COLORS.orange600}
                />
                <Text style={styles.insightText}>
                  Based on your Paris trip, consider booking restaurants 2-3
                  days in advance. Peak dining hours are 7-9 PM.
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.insightCard}>
              <LinearGradient
                colors={[COLORS.green50, COLORS.blue50]}
                style={styles.insightGradient}
              >
                <MaterialIcons
                  name="trending-up"
                  size={20}
                  color={COLORS.green600}
                />
                <Text style={styles.insightText}>
                  Your budget is on track! You're spending 18% of your allocated
                  funds. Consider upgrading one meal experience.
                </Text>
              </LinearGradient>
            </View>
          </View>

          {/* Upcoming Trips */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Trips</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddTrip}
              >
                <MaterialIcons name="add" size={16} color={COLORS.primary} />
                <Text style={styles.addButtonText}>Add Trip</Text>
              </TouchableOpacity>
            </View>

            {upcomingTrips.map((trip, index) => (
              <TouchableOpacity key={index} style={styles.tripItem}>
                <View style={styles.tripItemContent}>
                  <View style={styles.tripItemInfo}>
                    <Text style={styles.tripItemName}>{trip.tripName}</Text>
                    <Text style={styles.tripItemDestination}>
                      {trip.destination}
                    </Text>
                    <Text style={styles.tripItemDates}>{trip.dates}</Text>
                  </View>
                  <View style={styles.tripItemRight}>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>{trip.status}</Text>
                    </View>
                    <MaterialIcons
                      name="chevron-right"
                      size={20}
                      color={COLORS.gray400}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Floating Chat Button */}
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => setIsChatbotOpen(true)}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            style={styles.chatButtonGradient}
          >
            <MaterialIcons name="chat" size={24} color={COLORS.white} />
          </LinearGradient>
        </TouchableOpacity>

        {/* ChatBot Modal */}
        <ChatBot
          visible={isChatbotOpen}
          onClose={() => setIsChatbotOpen(false)}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 8,
  },
  headerLeft: {
    flex: 1,
  },
  appNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
    marginRight: 24,
  },
  appName: {
    fontSize: 22,
    fontWeight: "600",
    color: "#6B46C1",
    letterSpacing: 0.5,
  },
  welcomeContainer: {
    marginTop: 4,
  },
  welcomeText: {
    fontSize: 14,
    color: COLORS.gray600,
    marginBottom: 4,
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.gray900,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  notificationButton: {
    padding: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  currentTripCard: {
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  tripImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  tripOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
  },
  tripContent: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  tripHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  tripDestination: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.white,
    marginLeft: 4,
  },
  tripDates: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 4,
  },
  tripCountdown: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.8,
  },
  budgetCard: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
  },
  budgetGradient: {
    padding: 16,
  },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  budgetLabel: {
    fontSize: 14,
    color: COLORS.gray600,
  },
  budgetAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.gray900,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.gray100,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.gray900,
    borderRadius: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.gray900,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "500",
  },
  quickActionsGrid: {
    gap: 12,
  },
  quickActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: "rgba(142,180,245,0.2)",
    padding: 12,
    borderRadius: 7,
    alignItems: "center",
    gap: 6,
    minHeight: 85,
  },
  quickActionCardWide: {
    backgroundColor: "rgba(220,38,38,0.2)",
    padding: 16,
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    minHeight: 85,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.gray900,
    textAlign: "center",
    lineHeight: 12,
  },
  quickActionLabelWide: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.red600,
    textAlign: "center",
  },
  // Emergency Finder Refined Styles
  emergencySection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  emergencyCard: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  emergencyGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    minHeight: 90,
  },
  emergencyIconContainer: {
    marginRight: 14,
  },
  emergencyIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff7ed",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fed7aa",
  },
  emergencyContent: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  emergencySubtitle: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
    marginBottom: 8,
  },
  emergencyBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: "flex-start",
    gap: 3,
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },
  emergencyBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#16a34a",
  },
  emergencyArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  quickActionDescription: {
    fontSize: 10,
    color: COLORS.gray600,
    textAlign: "center",
    fontStyle: "italic",
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
    color: COLORS.orange600,
    fontWeight: "500",
  },
  insightCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  insightGradient: {
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.gray600,
    lineHeight: 20,
  },
  tripItem: {
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
  tripItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  tripItemInfo: {
    flex: 1,
  },
  tripItemName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.gray900,
    marginBottom: 2,
  },
  tripItemDestination: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.gray600,
    marginBottom: 4,
  },
  tripItemDates: {
    fontSize: 14,
    color: COLORS.gray600,
  },
  tripItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.gray100,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.gray600,
  },
  chatButton: {
    position: "absolute",
    bottom: 80,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  chatButtonGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
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
    borderRadius: 7,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.gray900,
    flex: 1,
  },
  modalHeaderContent: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.gray800,
    marginBottom: 4,
  },
  modalDescription: {
    fontSize: 14,
    color: COLORS.gray600,
    lineHeight: 20,
  },
  // Trip Atlas Modal Styles
  formContainer: {
    gap: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.gray900,
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: COLORS.gray100,
    borderRadius: 7,
    padding: 12,
    fontSize: 16,
    backgroundColor: COLORS.gray50,
  },
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    minWidth: 80,
    alignItems: "center",
  },
  optionButtonSelected: {
    borderColor: COLORS.orange500,
    backgroundColor: COLORS.orange50,
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.gray700,
  },
  optionButtonTextSelected: {
    color: COLORS.orange600,
    fontWeight: "600",
  },
  generateButton: {
    borderRadius: 7,
    overflow: "hidden",
    marginTop: 8,
  },
  generateButtonGradient: {
    padding: 16,
    alignItems: "center",
  },
  generateButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  routeResult: {
    alignItems: "center",
    gap: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.gray900,
    textAlign: "center",
  },
  mapPlaceholder: {
    width: "100%",
    height: 150,
    backgroundColor: COLORS.gray50,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.gray100,
    borderStyle: "dashed",
  },
  mapText: {
    fontSize: 14,
    color: COLORS.gray600,
    marginTop: 8,
  },
  mapSubtext: {
    fontSize: 12,
    color: COLORS.gray400,
    marginTop: 4,
  },
  routePoints: {
    width: "100%",
    gap: 12,
  },
  routePoint: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.gray50,
    padding: 12,
    borderRadius: 7,
    gap: 12,
  },
  routePointText: {
    fontSize: 14,
    color: COLORS.gray900,
    flex: 1,
  },
  chooseButton: {
    borderRadius: 7,
    overflow: "hidden",
    width: "100%",
  },
  chooseButtonGradient: {
    padding: 16,
    alignItems: "center",
  },
  chooseButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  // Itinerary Display Styles
  itineraryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  matchBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.orange50,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  matchText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.orange600,
  },
  itineraryDays: {
    gap: 16,
    marginBottom: 20,
  },
  dayCard: {
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
    padding: 16,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray900,
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  timeContainer: {
    minWidth: 70,
    marginRight: 12,
  },
  timeText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.gray900,
  },
  durationText: {
    fontSize: 12,
    color: COLORS.gray500,
  },
  activityDetails: {
    flex: 1,
  },
  activityName: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.gray900,
    marginBottom: 2,
  },
  activityType: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.blue600,
    letterSpacing: 0.5,
  },
  // Smart Bookings Modal Styles
  filterContainer: {
    gap: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray900,
    textAlign: "center",
    marginBottom: 8,
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: COLORS.gray100,
    backgroundColor: COLORS.gray50,
    gap: 16,
  },
  selectedFilter: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.orange50,
  },
  filterEmoji: {
    fontSize: 24,
  },
  filterTextContainer: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray900,
  },
  filterDesc: {
    fontSize: 14,
    color: COLORS.gray600,
    marginTop: 4,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "500",
  },
  bookingsResult: {
    gap: 16,
  },
  hotelCard: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: COLORS.gray50,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: COLORS.gray100,
  },
  hotelInfo: {
    flex: 1,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray900,
  },
  hotelMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 8,
  },
  hotelRating: {
    fontSize: 14,
    color: COLORS.gray600,
  },
  hotelPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  aiBadge: {
    marginTop: 8,
    backgroundColor: COLORS.orange50,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
    alignSelf: "flex-start",
  },
  aiBadgeText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "500",
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 7,
    alignSelf: "center",
  },
  bookButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
  // Post Generator Modal Styles
  postGeneratorContainer: {
    gap: 20,
  },
  tripDataCard: {
    backgroundColor: COLORS.gray50,
    padding: 16,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: COLORS.gray100,
  },
  tripDataTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray900,
    marginBottom: 12,
  },
  tripStats: {
    gap: 8,
  },
  tripStat: {
    fontSize: 14,
    color: COLORS.gray600,
  },
  generatePostButton: {
    borderRadius: 7,
    overflow: "hidden",
  },
  postEditorContainer: {
    gap: 16,
  },
  postEditor: {
    borderWidth: 1,
    borderColor: COLORS.gray100,
    borderRadius: 7,
    padding: 16,
    fontSize: 16,
    backgroundColor: COLORS.gray50,
    minHeight: 120,
    textAlignVertical: "top",
  },
  editLabel: {
    fontSize: 14,
    color: COLORS.gray600,
    fontStyle: "italic",
  },
  socialShareContainer: {
    gap: 12,
  },
  shareTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray900,
  },
  socialButtons: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-around",
  },
  socialButton: {
    alignItems: "center",
    padding: 12,
    backgroundColor: COLORS.gray50,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: COLORS.gray100,
    flex: 1,
  },
  socialIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  socialText: {
    fontSize: 12,
    color: COLORS.gray600,
    fontWeight: "500",
  },
  // Location History Modal Styles
  locationContainer: {
    gap: 16,
  },
  journeyStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: COLORS.gray50,
    padding: 16,
    borderRadius: 7,
  },
  journeyStatItem: {
    alignItems: "center",
    gap: 4,
  },
  journeyStatText: {
    fontSize: 12,
    color: COLORS.gray600,
    fontWeight: "500",
  },
  recentLocations: {
    gap: 12,
  },
  locationsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray900,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: COLORS.gray50,
    borderRadius: 7,
    gap: 12,
  },
  locationDetails: {
    flex: 1,
  },
  locationName: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.gray900,
  },
  locationTime: {
    fontSize: 12,
    color: COLORS.gray600,
    marginTop: 2,
  },
  // Add Trip Modal Styles
  formSubtitle: {
    fontSize: 14,
    color: COLORS.gray600,
    marginBottom: 20,
    lineHeight: 20,
    textAlign: "center",
  },
  dateRow: {
    flexDirection: "row",
    gap: 12,
  },
  dateColumn: {
    flex: 1,
  },
  createTripButton: {
    borderRadius: 7,
    overflow: "hidden",
    marginTop: 20,
  },
  createTripButtonGradient: {
    padding: 16,
    alignItems: "center",
  },
  createTripButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  planningNote: {
    fontSize: 12,
    color: COLORS.gray600,
    textAlign: "center",
    marginTop: 16,
    fontStyle: "italic",
  },
  // Emergency Services Modal Styles
  emergencyModalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 450,
    maxHeight: "90%",
  },
  locationStatus: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.orange50,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    color: COLORS.gray600,
    flex: 1,
  },
  emergencyFilterContainer: {
    marginBottom: 16,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.gray100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    gap: 4,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.gray600,
  },
  filterChipTextActive: {
    color: COLORS.white,
  },
  servicesList: {
    maxHeight: 400,
    marginBottom: 16,
  },
  serviceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.gray100,
  },
  serviceHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  serviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.gray900,
    marginBottom: 4,
  },
  serviceAddress: {
    fontSize: 13,
    color: COLORS.gray600,
    marginBottom: 8,
    lineHeight: 18,
  },
  serviceDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  serviceDistance: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "500",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.gray600,
    fontWeight: "500",
  },
  serviceActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.gray100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.primary,
  },
  callButton: {
    backgroundColor: COLORS.primary,
  },
  callButtonText: {
    color: COLORS.white,
  },
  noResultsContainer: {
    alignItems: "center",
    padding: 32,
  },
  noResultsText: {
    fontSize: 14,
    color: COLORS.gray600,
    marginTop: 12,
    marginBottom: 16,
    textAlign: "center",
  },
  refreshButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  refreshButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.white,
  },
  emergencyHotlines: {
    backgroundColor: COLORS.red50,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.red600,
  },
  hotlineTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.red600,
    marginBottom: 8,
    textAlign: "center",
  },
  hotlineButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  hotlineButton: {
    backgroundColor: COLORS.red600,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
  },
  hotlineButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.white,
    textAlign: "center",
  },
});
