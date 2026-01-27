import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

const COLORS = {
  primary: "#ea580c",
  secondary: "#fb923c",
  white: "#ffffff",
  gray50: "#f9fafb",
  gray100: "#f3f4f6",
  gray200: "#e5e7eb",
  gray300: "#d1d5db",
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
};

interface POI {
  id: string;
  name: string;
  address: string;
}

interface RouteOptimization {
  totalTime: string;
  timeSaved: string;
  route: POI[];
  trafficAvoided: string;
}

interface ItineraryItem {
  id: string;
  poi: string;
  time: string;
  duration: string;
  category: string;
  day?: number;
}

interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  category: "packing" | "booking" | "documents" | "activities" | "other";
}

interface Accommodation {
  id: string;
  name: string;
  price: string;
  pricePerNight: number;
  originalPrice?: string;
  rating: number;
  image: string;
  location: string;
  aiInsight: string;
  distance: string;
  amenities: string[];
}

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  tasteMatch: number;
  distance: string;
  walkTime: string;
  rating: number;
  priceRange: string;
  isHiddenGem: boolean;
  signature?: string;
  localTip?: string;
}

export default function TripsScreen() {
  // Modal states
  const [checklistModal, setChecklistModal] = useState(false);
  const [itineraryModal, setItineraryModal] = useState(false);
  const [staysModal, setStaysModal] = useState(false);
  const [foodModal, setFoodModal] = useState(false);

  // Checklist states
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [newTask, setNewTask] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "packing" | "booking" | "documents" | "activities" | "other"
  >("other");

  // AI Itinerary Builder states
  const [travelStyle, setTravelStyle] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [destination, setDestination] = useState("");
  const [tripDuration, setTripDuration] = useState("");
  const [foodPreferences, setFoodPreferences] = useState("");
  const [travelCompanions, setTravelCompanions] = useState("");
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [personalizedScore, setPersonalizedScore] = useState(0);

  // Smart Stays Finder states
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [checkinDate, setCheckinDate] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");
  const [accommodationType, setAccommodationType] = useState("");
  const [isSearchingStays, setIsSearchingStays] = useState(false);
  const [luxuryLevel, setLuxuryLevel] = useState("");

  // Local Food AI states
  const [currentLocation, setCurrentLocation] = useState("");
  const [cuisinePreferences, setCuisinePreferences] = useState<string[]>([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isSearchingFood, setIsSearchingFood] = useState(false);

  // Handler functions for the planning tools
  const handleToolPress = (toolTitle: string) => {
    switch (toolTitle) {
      case "Checklist":
        setChecklistModal(true);
        break;
      case "AI Itinerary Builder":
        setItineraryModal(true);
        break;
      case "Smart Stays Finder":
        setStaysModal(true);
        break;
      case "Local Food AI":
        setFoodModal(true);
        break;
      default:
        Alert.alert(
          "Coming Soon",
          `${toolTitle} feature will be available soon!`
        );
    }
  };

  // Checklist Implementation
  const addChecklistItem = () => {
    if (newTask.trim()) {
      const newItem: ChecklistItem = {
        id: Date.now().toString(),
        task: newTask.trim(),
        completed: false,
        category: selectedCategory,
      };
      setChecklistItems([...checklistItems, newItem]);
      setNewTask("");
    }
  };

  const toggleChecklistItem = (id: string) => {
    setChecklistItems(
      checklistItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const removeChecklistItem = (id: string) => {
    setChecklistItems(checklistItems.filter((item) => item.id !== id));
  };

  const getCompletedCount = () => {
    return checklistItems.filter((item) => item.completed).length;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "packing":
        return COLORS.blue600;
      case "booking":
        return COLORS.green600;
      case "documents":
        return COLORS.orange600;
      case "activities":
        return COLORS.primary;
      default:
        return COLORS.gray500;
    }
  };

  // AI Itinerary Builder Implementation
  const buildItinerary = () => {
    if (!travelStyle || !budgetRange || !destination || !tripDuration) {
      Alert.alert(
        "Input Required",
        "Please fill in all required fields (Travel Style, Budget Range, Destination, and Trip Duration)."
      );
      return;
    }

    const days = parseInt(tripDuration);
    if (isNaN(days) || days <= 0) {
      Alert.alert(
        "Invalid Duration",
        "Please enter a valid number of days for your trip."
      );
      return;
    }

    setIsBuilding(true);

    // Generate dynamic itinerary based on trip duration
    setTimeout(() => {
      const generatedItinerary: ItineraryItem[] = [];

      // Comprehensive activity pool based on travel style and destination
      const allActivities = {
        Cultural: [
          {
            name: `${destination} National Museum`,
            category: "Cultural",
            duration: "2h",
          },
          {
            name: `Historic Temple District`,
            category: "Cultural",
            duration: "1.5h",
          },
          {
            name: `Traditional Art Gallery`,
            category: "Cultural",
            duration: "1h",
          },
          {
            name: `Cultural Heritage Site`,
            category: "Cultural",
            duration: "2.5h",
          },
          {
            name: `Local History Museum`,
            category: "Cultural",
            duration: "1.5h",
          },
          {
            name: `Ancient Architecture Tour`,
            category: "Cultural",
            duration: "2h",
          },
          {
            name: `Folk Music Performance`,
            category: "Cultural",
            duration: "1.5h",
          },
          {
            name: `Traditional Craft Workshop`,
            category: "Cultural",
            duration: "2h",
          },
          { name: `Archaeological Site`, category: "Cultural", duration: "3h" },
          { name: `Cultural Dance Show`, category: "Cultural", duration: "1h" },
          {
            name: `Local Library & Archives`,
            category: "Cultural",
            duration: "1.5h",
          },
          {
            name: `Heritage Walking Tour`,
            category: "Cultural",
            duration: "2.5h",
          },
        ],
        Adventure: [
          {
            name: `${destination} Adventure Park`,
            category: "Adventure",
            duration: "3h",
          },
          {
            name: `Mountain Hiking Trail`,
            category: "Adventure",
            duration: "4h",
          },
          {
            name: `Water Sports Center`,
            category: "Adventure",
            duration: "2h",
          },
          { name: `Rock Climbing Area`, category: "Adventure", duration: "3h" },
          {
            name: `Zip Line Adventure`,
            category: "Adventure",
            duration: "2.5h",
          },
          {
            name: `Kayaking Expedition`,
            category: "Adventure",
            duration: "3h",
          },
          { name: `Wildlife Safari`, category: "Adventure", duration: "4h" },
          { name: `Bungee Jumping`, category: "Adventure", duration: "1.5h" },
          {
            name: `Paragliding Experience`,
            category: "Adventure",
            duration: "2h",
          },
          { name: `Cave Exploration`, category: "Adventure", duration: "3h" },
          { name: `Scuba Diving`, category: "Adventure", duration: "4h" },
          { name: `Mountain Biking`, category: "Adventure", duration: "3h" },
        ],
        Relaxation: [
          {
            name: `Luxury Spa & Wellness`,
            category: "Relaxation",
            duration: "2h",
          },
          {
            name: `Peaceful Gardens`,
            category: "Relaxation",
            duration: "1.5h",
          },
          { name: `Sunset Beach Walk`, category: "Relaxation", duration: "1h" },
          {
            name: `Meditation Center`,
            category: "Relaxation",
            duration: "1.5h",
          },
          { name: `Thermal Springs`, category: "Relaxation", duration: "2.5h" },
          {
            name: `Yoga Session in Nature`,
            category: "Relaxation",
            duration: "1h",
          },
          { name: `Botanical Gardens`, category: "Relaxation", duration: "2h" },
          { name: `Wellness Retreat`, category: "Relaxation", duration: "3h" },
          {
            name: `Aromatherapy Session`,
            category: "Relaxation",
            duration: "1.5h",
          },
          {
            name: `Lake Side Relaxation`,
            category: "Relaxation",
            duration: "2h",
          },
          {
            name: `Hot Stone Massage`,
            category: "Relaxation",
            duration: "1.5h",
          },
          {
            name: `Scenic Picnic Spot`,
            category: "Relaxation",
            duration: "2h",
          },
        ],
        "Food & Wine": [
          {
            name: `${destination} Food Market`,
            category: "Food & Culture",
            duration: "2h",
          },
          {
            name: `Wine Tasting Tour`,
            category: "Food & Wine",
            duration: "2.5h",
          },
          {
            name: `Cooking Class Experience`,
            category: "Food & Culture",
            duration: "3h",
          },
          {
            name: `Local Restaurant District`,
            category: "Food & Culture",
            duration: "1.5h",
          },
          {
            name: `Street Food Tour`,
            category: "Food & Culture",
            duration: "2h",
          },
          {
            name: `Farm-to-Table Experience`,
            category: "Food & Culture",
            duration: "3h",
          },
          { name: `Brewery Tour`, category: "Food & Wine", duration: "2h" },
          {
            name: `Chocolate Making Workshop`,
            category: "Food & Culture",
            duration: "2h",
          },
          {
            name: `Spice Market Visit`,
            category: "Food & Culture",
            duration: "1.5h",
          },
          {
            name: `Fine Dining Experience`,
            category: "Food & Wine",
            duration: "2.5h",
          },
          {
            name: `Coffee Plantation Tour`,
            category: "Food & Culture",
            duration: "3h",
          },
          { name: `Food Festival`, category: "Food & Culture", duration: "2h" },
        ],
      };

      const selectedPool =
        allActivities[travelStyle as keyof typeof allActivities] ||
        allActivities["Cultural"];

      // Generate diverse activities for each day
      for (let day = 1; day <= days; day++) {
        const activitiesPerDay = 4; // 4 activities per day
        const startTimes = ["9:00 AM", "11:30 AM", "1:00 PM", "3:30 PM"];

        // Select different activities for each day
        const startIndex = ((day - 1) * activitiesPerDay) % selectedPool.length;

        for (let i = 0; i < activitiesPerDay; i++) {
          const activityIndex = (startIndex + i) % selectedPool.length;
          const activity = selectedPool[activityIndex];

          generatedItinerary.push({
            id: `${day}-${i + 1}`,
            poi: activity.name,
            time: startTimes[i],
            duration: activity.duration,
            category: activity.category,
            day: day,
          });
        }
      }

      setItinerary(generatedItinerary);
      setPersonalizedScore(Math.floor(Math.random() * 20) + 80); // Random score between 80-100
      setIsBuilding(false);
    }, 2500);
  };

  // Smart Stays Finder Implementation
  const findSmartStays = () => {
    if (!checkinDate || !checkoutDate) {
      Alert.alert(
        "Input Required",
        "Please select check-in and check-out dates."
      );
      return;
    }

    setIsSearchingStays(true);
    setTimeout(() => {
      const sampleAccommodations: Accommodation[] = [
        {
          id: "1",
          name: "Grand Tokyo Hotel",
          price: "$189",
          pricePerNight: 189,
          originalPrice: "$249",
          rating: 5,
          image: "hotel1.jpg",
          location: "Shibuya, Tokyo",
          aiInsight: "AI Prediction: Best price today, 24% below peak rates",
          distance: "0.5km from Shibuya Station",
          amenities: ["Free WiFi", "Pool", "Gym", "Restaurant", "Spa"],
        },
        {
          id: "2",
          name: "Modern Capsule Inn",
          price: "$89",
          pricePerNight: 89,
          rating: 4,
          image: "hotel2.jpg",
          location: "Tokyo Station Area",
          aiInsight:
            "AI Insight: High value for location, frequently booked by business travelers",
          distance: "1.2km from Tokyo Station",
          amenities: ["Free WiFi", "Luggage Storage", "24/7 Reception"],
        },
        {
          id: "3",
          name: "Traditional Ryokan",
          price: "$329",
          pricePerNight: 329,
          originalPrice: "$420",
          rating: 5,
          image: "hotel3.jpg",
          location: "Imperial Palace District",
          aiInsight:
            "AI Special: Authentic experience with modern amenities, 22% seasonal discount",
          distance: "2.1km from Imperial Palace",
          amenities: [
            "Traditional Onsen",
            "Kaiseki Meals",
            "Garden View",
            "Tea Ceremony",
          ],
        },
      ];
      setAccommodations(sampleAccommodations);
      setIsSearchingStays(false);
    }, 1800);
  };

  // Local Food AI Implementation
  const findLocalFood = () => {
    if (!currentLocation) {
      Alert.alert("Input Required", "Please enter your current location.");
      return;
    }

    setIsSearchingFood(true);
    setTimeout(() => {
      const sampleRestaurants: Restaurant[] = [
        {
          id: "1",
          name: "Ramen Yokocho",
          cuisine: "Japanese Ramen",
          tasteMatch: 96,
          distance: "0.2km",
          walkTime: "3 min",
          rating: 5,
          priceRange: "¥¥",
          isHiddenGem: true,
          signature: "Tonkotsu Ramen with 18-hour broth",
          localTip:
            "Order extra chashu - the pork belly is incredibly tender and melts in your mouth",
        },
        {
          id: "2",
          name: "Sushi Masa",
          cuisine: "Traditional Sushi",
          tasteMatch: 92,
          distance: "0.4km",
          walkTime: "5 min",
          rating: 5,
          priceRange: "¥¥¥",
          isHiddenGem: true,
          signature: "Omakase featuring daily Tsukiji catches",
          localTip:
            "Best seat is at the counter - watch the master chef at work and ask for recommendations",
        },
        {
          id: "3",
          name: "Street Takoyaki Stand",
          cuisine: "Street Food",
          tasteMatch: 88,
          distance: "0.1km",
          walkTime: "1 min",
          rating: 4,
          priceRange: "¥",
          isHiddenGem: true,
          signature: "Crispy takoyaki with secret sauce blend",
          localTip:
            "Try the mixed plate with both original and spicy mayo - locals always order 8 pieces minimum",
        },
      ];
      setRestaurants(sampleRestaurants);
      setIsSearchingFood(false);
    }, 1500);
  };

  const planningTools = [
    {
      icon: "checklist",
      title: "Checklist",
      desc: "Trip planning to-do list",
      aiFeature: "Smart task suggestions",
    },
    {
      icon: "event",
      title: "AI Itinerary Builder",
      desc: "Personalized by preferences",
      aiFeature: "Auto-schedule optimization",
    },
    {
      icon: "home",
      title: "Smart Stays Finder",
      desc: "AI-curated accommodations",
      aiFeature: "Price prediction & deals",
    },
    {
      icon: "restaurant",
      title: "Local Food AI",
      desc: "Taste-matched dining spots",
      aiFeature: "Dietary preference matching",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Trips</Text>
        <TouchableOpacity style={styles.planButton}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            style={styles.planButtonGradient}
          >
            <MaterialIcons name="add" size={16} color={COLORS.white} />
            <Text style={styles.planButtonText}>Plan Trip</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* AI-Enhanced Planning Tools */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>AI-Enhanced Planning Tools</Text>
            <View style={styles.aiIndicator}>
              <MaterialIcons
                name="auto-awesome"
                size={14}
                color={COLORS.primary}
              />
              <Text style={styles.aiIndicatorText}>Smart</Text>
            </View>
          </View>
          <View style={styles.toolsGrid}>
            {planningTools.map((tool, index) => (
              <TouchableOpacity
                key={index}
                style={styles.toolCard}
                onPress={() => handleToolPress(tool.title)}
              >
                <View style={styles.toolHeader}>
                  <View style={styles.toolIcon}>
                    <MaterialIcons
                      name={tool.icon as any}
                      size={20}
                      color={COLORS.primary}
                    />
                  </View>
                  <MaterialIcons
                    name="auto-awesome"
                    size={14}
                    color={COLORS.orange600}
                  />
                </View>
                <Text style={styles.toolTitle}>{tool.title}</Text>
                <Text style={styles.toolDesc}>{tool.desc}</Text>
                <Text style={styles.toolAiFeature}>{tool.aiFeature}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Current Trip Details */}
        <View style={[styles.section, styles.currentTripSection]}>
          <Text style={styles.sectionTitle}>Current Trip: Paris</Text>
          <View style={styles.tripDetailsList}>
            {[
              { icon: "event", label: "Itinerary" },
              { icon: "bookmark", label: "Bookmarks", count: "12 places" },
              { icon: "group", label: "Travel Companions", count: "3 people" },
            ].map((item, index) => (
              <TouchableOpacity key={index} style={styles.tripDetailItem}>
                <View style={styles.tripDetailLeft}>
                  <MaterialIcons
                    name={item.icon as any}
                    size={16}
                    color={COLORS.blue600}
                  />
                  <Text style={styles.tripDetailLabel}>{item.label}</Text>
                </View>
                <View style={styles.tripDetailRight}>
                  {item.count && (
                    <View style={styles.countBadge}>
                      <Text style={styles.countText}>{item.count}</Text>
                    </View>
                  )}
                  <MaterialIcons
                    name="chevron-right"
                    size={16}
                    color={COLORS.gray400}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Trip History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Trips</Text>
          {[
            { destination: "Barcelona, Spain", dates: "Sep 2024", rating: 5 },
            {
              destination: "Amsterdam, Netherlands",
              dates: "Jul 2024",
              rating: 4,
            },
            {
              destination: "Prague, Czech Republic",
              dates: "May 2024",
              rating: 5,
            },
          ].map((trip, index) => (
            <TouchableOpacity key={index} style={styles.historyItem}>
              <View style={styles.historyContent}>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyDestination}>
                    {trip.destination}
                  </Text>
                  <Text style={styles.historyDates}>{trip.dates}</Text>
                </View>
                <View style={styles.ratingContainer}>
                  {[...Array(trip.rating)].map((_, i) => (
                    <MaterialIcons
                      key={i}
                      name="star"
                      size={14}
                      color="#fbbf24"
                    />
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Checklist Modal */}
      <Modal
        visible={checklistModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setChecklistModal(false)}>
              <MaterialIcons name="close" size={24} color={COLORS.gray600} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Trip Checklist</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalSubtitle}>
              Keep track of your trip planning tasks and never forget anything
              important
            </Text>

            {/* Progress Overview */}
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <MaterialIcons
                  name="assignment"
                  size={24}
                  color={COLORS.primary}
                />
                <Text style={styles.progressTitle}>Progress</Text>
              </View>
              <Text style={styles.progressText}>
                {getCompletedCount()} of {checklistItems.length} tasks completed
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${
                        checklistItems.length > 0
                          ? (getCompletedCount() / checklistItems.length) * 100
                          : 0
                      }%`,
                    },
                  ]}
                />
              </View>
            </View>

            {/* Add New Task */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Add New Task</Text>
              <View style={styles.addTaskContainer}>
                <TextInput
                  style={styles.taskInput}
                  value={newTask}
                  onChangeText={setNewTask}
                  placeholder="Enter a new task..."
                  placeholderTextColor={COLORS.gray400}
                />
                <View style={styles.categorySelector}>
                  <Text style={styles.categoryLabel}>Category:</Text>
                  <View style={styles.categoryOptions}>
                    {(
                      [
                        "packing",
                        "booking",
                        "documents",
                        "activities",
                        "other",
                      ] as const
                    ).map((category) => (
                      <TouchableOpacity
                        key={category}
                        style={[
                          styles.categoryChip,
                          selectedCategory === category &&
                            styles.categoryChipActive,
                        ]}
                        onPress={() => setSelectedCategory(category)}
                      >
                        <Text
                          style={[
                            styles.categoryChipText,
                            selectedCategory === category &&
                              styles.categoryChipTextActive,
                          ]}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.addTaskButton}
                  onPress={addChecklistItem}
                >
                  <MaterialIcons name="add" size={20} color={COLORS.white} />
                  <Text style={styles.addTaskButtonText}>Add Task</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Checklist Items */}
            {checklistItems.length > 0 && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Your Tasks ({checklistItems.length})
                </Text>
                <View style={styles.checklistContainer}>
                  {checklistItems.map((item) => (
                    <View key={item.id} style={styles.checklistItem}>
                      <TouchableOpacity
                        style={[
                          styles.checkbox,
                          item.completed && styles.checkboxChecked,
                        ]}
                        onPress={() => toggleChecklistItem(item.id)}
                      >
                        {item.completed && (
                          <MaterialIcons
                            name="check"
                            size={18}
                            color={COLORS.white}
                          />
                        )}
                      </TouchableOpacity>
                      <View style={styles.taskContent}>
                        <Text
                          style={[
                            styles.taskText,
                            item.completed && styles.taskTextCompleted,
                          ]}
                        >
                          {item.task}
                        </Text>
                        <View style={styles.taskMeta}>
                          <View
                            style={[
                              styles.categoryBadge,
                              {
                                backgroundColor: getCategoryColor(
                                  item.category
                                ),
                              },
                            ]}
                          >
                            <Text style={styles.categoryBadgeText}>
                              {item.category.charAt(0).toUpperCase() +
                                item.category.slice(1)}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => removeChecklistItem(item.id)}
                      >
                        <MaterialIcons
                          name="delete"
                          size={20}
                          color={COLORS.gray400}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {checklistItems.length === 0 && (
              <View style={styles.emptyState}>
                <MaterialIcons
                  name="assignment"
                  size={48}
                  color={COLORS.gray400}
                />
                <Text style={styles.emptyStateTitle}>No tasks yet</Text>
                <Text style={styles.emptyStateText}>
                  Add your first task to get started with your trip planning
                  checklist
                </Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* AI Itinerary Builder Modal */}
      <Modal
        visible={itineraryModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setItineraryModal(false)}>
              <MaterialIcons name="close" size={24} color={COLORS.gray600} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>AI Itinerary Builder</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalSubtitle}>
              Let AI create a personalized itinerary based on your preferences
              and travel style
            </Text>

            {/* Travel Style */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Travel Style</Text>
              <View style={styles.optionGrid}>
                {["Cultural", "Adventure", "Relaxation", "Food & Wine"].map(
                  (style) => (
                    <TouchableOpacity
                      key={style}
                      style={[
                        styles.optionCard,
                        travelStyle === style && styles.optionCardActive,
                      ]}
                      onPress={() => setTravelStyle(style)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          travelStyle === style && styles.optionTextActive,
                        ]}
                      >
                        {style}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>

            {/* Budget Range */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Budget Range</Text>
              <View style={styles.optionGrid}>
                {["Budget", "Mid-Range", "Luxury", "Premium"].map((budget) => (
                  <TouchableOpacity
                    key={budget}
                    style={[
                      styles.optionCard,
                      budgetRange === budget && styles.optionCardActive,
                    ]}
                    onPress={() => setBudgetRange(budget)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        budgetRange === budget && styles.optionTextActive,
                      ]}
                    >
                      {budget}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Destination */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Destination</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Where would you like to go?"
                value={destination}
                onChangeText={setDestination}
              />
            </View>

            {/* Trip Duration */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Trip Duration</Text>
              <TextInput
                style={styles.textInput}
                placeholder="How many days?"
                value={tripDuration}
                onChangeText={setTripDuration}
                keyboardType="numeric"
              />
            </View>

            {/* Food Preferences */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Food Preferences</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Any dietary preferences or favorite cuisines?"
                value={foodPreferences}
                onChangeText={setFoodPreferences}
                multiline
              />
            </View>

            {/* Travel Companions */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Travel Companions</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Who are you traveling with?"
                value={travelCompanions}
                onChangeText={setTravelCompanions}
              />
            </View>

            {/* Build Itinerary Button */}
            <TouchableOpacity
              style={styles.generateButton}
              onPress={buildItinerary}
              disabled={isBuilding}
            >
              <LinearGradient
                colors={["#9333ea", "#a855f7"]}
                style={styles.generateButtonGradient}
              >
                {isBuilding ? (
                  <Text style={styles.generateButtonText}>
                    Building Itinerary...
                  </Text>
                ) : (
                  <Text style={styles.generateButtonText}>
                    Build AI Itinerary
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Itinerary Results */}
            {itinerary.length > 0 && (
              <View style={styles.resultContainer}>
                <View style={styles.itineraryHeader}>
                  <Text style={styles.resultTitle}>
                    Your Personalized Itinerary
                  </Text>
                  <View style={styles.scoreCard}>
                    <MaterialIcons
                      name="psychology"
                      size={16}
                      color="#9333ea"
                    />
                    <Text style={styles.scoreText}>
                      {personalizedScore}% Match
                    </Text>
                  </View>
                </View>

                {/* Group activities by day */}
                {Array.from(new Set(itinerary.map((item) => item.day || 1)))
                  .sort()
                  .map((dayNumber) => {
                    const dayActivities = itinerary.filter(
                      (item) => (item.day || 1) === dayNumber
                    );
                    const dayTitle = `Day ${dayNumber} - ${travelStyle} Experience`;

                    return (
                      <View key={dayNumber} style={styles.daySection}>
                        <Text style={styles.itinerarySubtitle}>{dayTitle}</Text>

                        <View style={styles.itineraryList}>
                          {dayActivities.map((item, index) => (
                            <View key={item.id} style={styles.itineraryItem}>
                              <View style={styles.timeSlot}>
                                <Text style={styles.timeText}>{item.time}</Text>
                                <Text style={styles.durationText}>
                                  {item.duration}
                                </Text>
                              </View>
                              <View style={styles.itineraryContent}>
                                <Text style={styles.poiName}>{item.poi}</Text>
                                <View style={styles.itineraryCategoryBadge}>
                                  <Text style={styles.categoryText}>
                                    {item.category}
                                  </Text>
                                </View>
                              </View>
                              <MaterialIcons
                                name="drag-handle"
                                size={20}
                                color={COLORS.gray400}
                              />
                            </View>
                          ))}
                        </View>
                      </View>
                    );
                  })}

                <View style={styles.itineraryNote}>
                  <MaterialIcons name="info" size={16} color={COLORS.blue600} />
                  <Text style={styles.noteText}>
                    Drag and drop to reorder activities. All timings respect
                    venue operating hours.
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Smart Stays Finder Modal */}
      <Modal
        visible={staysModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setStaysModal(false)}>
              <MaterialIcons name="close" size={24} color={COLORS.gray600} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Smart Stays Finder</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalSubtitle}>
              AI-curated accommodations with price prediction and hidden deals
              discovery
            </Text>

            {/* Check-in and Check-out Dates */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Check-in & Check-out</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Check-in date"
                  value={checkinDate}
                  onChangeText={setCheckinDate}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Check-out date"
                  value={checkoutDate}
                  onChangeText={setCheckoutDate}
                />
              </View>
            </View>

            {/* Accommodation Type */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Accommodation Type</Text>
              <View style={styles.methodGrid}>
                {["Hotel", "Apartment", "Villa", "Resort", "Hostel"].map(
                  (type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.methodOption,
                        accommodationType === type && styles.methodOptionActive,
                      ]}
                      onPress={() => setAccommodationType(type)}
                    >
                      <Text
                        style={[
                          styles.methodText,
                          accommodationType === type && styles.methodTextActive,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>

            {/* Find Smart Stays Button */}
            <TouchableOpacity
              style={styles.generateButton}
              onPress={findSmartStays}
              disabled={isSearchingStays}
            >
              <LinearGradient
                colors={["#16a34a", "#22c55e"]}
                style={styles.generateButtonGradient}
              >
                {isSearchingStays ? (
                  <Text style={styles.generateButtonText}>
                    Finding Best Stays...
                  </Text>
                ) : (
                  <Text style={styles.generateButtonText}>
                    Find Smart Stays
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Accommodation Results */}
            {accommodations.length > 0 && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>
                  AI-Curated Accommodations
                </Text>

                <View style={styles.accommodationList}>
                  {accommodations.map((accommodation) => (
                    <View
                      key={accommodation.id}
                      style={styles.accommodationCard}
                    >
                      <View style={styles.accommodationHeader}>
                        <Text style={styles.accommodationName}>
                          {accommodation.name}
                        </Text>
                        <View style={styles.priceContainer}>
                          <Text style={styles.priceAmount}>
                            ${accommodation.pricePerNight}
                          </Text>
                          <Text style={styles.priceUnit}>per night</Text>
                        </View>
                      </View>

                      <View style={styles.accommodationDetails}>
                        <Text style={styles.accommodationLocation}>
                          {accommodation.location}
                        </Text>
                        <View style={styles.ratingContainer}>
                          {[...Array(5)].map((_, i) => (
                            <MaterialIcons
                              key={i}
                              name="star"
                              size={14}
                              color={
                                i < accommodation.rating
                                  ? COLORS.orange600
                                  : COLORS.gray100
                              }
                            />
                          ))}
                          <Text style={styles.ratingText}>
                            ({accommodation.rating})
                          </Text>
                        </View>
                      </View>

                      {accommodation.aiInsight && (
                        <View style={styles.insightCard}>
                          <MaterialIcons
                            name="psychology"
                            size={16}
                            color={COLORS.green600}
                          />
                          <Text style={styles.aiInsightText}>
                            {accommodation.aiInsight}
                          </Text>
                        </View>
                      )}

                      <View style={styles.amenitiesContainer}>
                        {accommodation.amenities
                          .slice(0, 3)
                          .map((amenity, index) => (
                            <View key={index} style={styles.amenityBadge}>
                              <Text style={styles.amenityText}>{amenity}</Text>
                            </View>
                          ))}
                      </View>

                      <TouchableOpacity style={styles.bookingButton}>
                        <Text style={styles.bookingButtonText}>
                          View Details
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>

                <View style={styles.aiNote}>
                  <MaterialIcons
                    name="auto-awesome"
                    size={16}
                    color={COLORS.green600}
                  />
                  <Text style={styles.noteText}>
                    AI analyzed 1,247 properties to find the best matches for
                    your travel style and budget.
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Local Food AI Modal */}
      <Modal
        visible={foodModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setFoodModal(false)}>
              <MaterialIcons name="close" size={24} color={COLORS.gray600} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Local Food AI</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalSubtitle}>
              AI-powered taste matching to discover hidden culinary gems and
              local favorites
            </Text>

            {/* Current Location */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Current Location</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your location or use GPS"
                value={currentLocation}
                onChangeText={setCurrentLocation}
              />
            </View>

            {/* Cuisine Preferences */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Cuisine Preferences</Text>
              <View style={styles.methodGrid}>
                {[
                  "Local",
                  "Asian",
                  "European",
                  "Street Food",
                  "Fine Dining",
                  "Vegetarian",
                ].map((cuisine) => (
                  <TouchableOpacity
                    key={cuisine}
                    style={[
                      styles.methodOption,
                      cuisinePreferences.includes(cuisine) &&
                        styles.methodOptionActive,
                    ]}
                    onPress={() => {
                      if (cuisinePreferences.includes(cuisine)) {
                        setCuisinePreferences((prev) =>
                          prev.filter((c) => c !== cuisine)
                        );
                      } else {
                        setCuisinePreferences((prev) => [...prev, cuisine]);
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.methodText,
                        cuisinePreferences.includes(cuisine) &&
                          styles.methodTextActive,
                      ]}
                    >
                      {cuisine}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Dietary Restrictions */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Dietary Restrictions (Optional)
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Halal, Vegan, Gluten-free"
                value={dietaryRestrictions}
                onChangeText={setDietaryRestrictions}
              />
            </View>

            {/* Find Local Food Button */}
            <TouchableOpacity
              style={styles.generateButton}
              onPress={findLocalFood}
              disabled={isSearchingFood}
            >
              <LinearGradient
                colors={["#ea580c", "#fb923c"]}
                style={styles.generateButtonGradient}
              >
                {isSearchingFood ? (
                  <Text style={styles.generateButtonText}>
                    Finding Hidden Gems...
                  </Text>
                ) : (
                  <Text style={styles.generateButtonText}>
                    Discover Local Food
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Restaurant Results */}
            {restaurants.length > 0 && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>AI-Matched Restaurants</Text>

                <View style={styles.restaurantList}>
                  {restaurants.map((restaurant) => (
                    <View key={restaurant.id} style={styles.restaurantCard}>
                      <View style={styles.restaurantHeader}>
                        <Text style={styles.restaurantName}>
                          {restaurant.name}
                        </Text>
                        <View style={styles.tasteMatchBadge}>
                          <MaterialIcons
                            name="psychology"
                            size={14}
                            color={COLORS.primary}
                          />
                          <Text style={styles.tasteMatchText}>
                            {restaurant.tasteMatch}% Match
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.restaurantCuisine}>
                        {restaurant.cuisine} • {restaurant.priceRange}
                      </Text>
                      <Text style={styles.restaurantDistance}>
                        {restaurant.distance} away • {restaurant.walkTime} walk
                      </Text>

                      {restaurant.signature && (
                        <View style={styles.signatureContainer}>
                          <MaterialIcons
                            name="star"
                            size={16}
                            color={COLORS.orange600}
                          />
                          <Text style={styles.signatureText}>
                            Signature: {restaurant.signature}
                          </Text>
                        </View>
                      )}

                      {restaurant.localTip && (
                        <View style={styles.localTipCard}>
                          <MaterialIcons
                            name="lightbulb"
                            size={16}
                            color={COLORS.blue600}
                          />
                          <Text style={styles.localTipText}>
                            {restaurant.localTip}
                          </Text>
                        </View>
                      )}

                      <View style={styles.restaurantFooter}>
                        <View style={styles.ratingContainer}>
                          {[...Array(5)].map((_, i) => (
                            <MaterialIcons
                              key={i}
                              name="star"
                              size={14}
                              color={
                                i < restaurant.rating
                                  ? COLORS.orange600
                                  : COLORS.gray100
                              }
                            />
                          ))}
                          <Text style={styles.ratingText}>
                            ({restaurant.rating})
                          </Text>
                        </View>
                        <TouchableOpacity style={styles.directionsButton}>
                          <MaterialIcons
                            name="directions"
                            size={16}
                            color={COLORS.blue600}
                          />
                          <Text style={styles.directionsText}>Directions</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>

                <View style={styles.aiNote}>
                  <MaterialIcons
                    name="restaurant"
                    size={16}
                    color={COLORS.primary}
                  />
                  <Text style={styles.noteText}>
                    AI analyzed local reviews, taste profiles, and hidden gems
                    to match your preferences.
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.gray900,
  },
  planButton: {
    borderRadius: 8,
    overflow: "hidden",
  },
  planButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  planButtonText: {
    color: COLORS.white,
    fontWeight: "500",
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  currentTripSection: {
    backgroundColor: "rgba(206,142,245,0.2)",
    padding: 16,
    borderRadius: 7,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.gray900,
    marginBottom: 12,
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
    color: COLORS.orange600,
    fontWeight: "500",
  },
  toolsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  toolCard: {
    width: "47%",
    backgroundColor: "rgba(142,180,245,0.2)",
    padding: 16,
    borderRadius: 7,
    alignItems: "center",
  },
  toolHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  toolIcon: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(234,88,12,0.1)",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  toolTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.gray900,
    marginBottom: 4,
    textAlign: "center",
  },
  toolDesc: {
    fontSize: 12,
    color: COLORS.gray600,
    textAlign: "center",
  },
  toolAiFeature: {
    fontSize: 10,
    color: COLORS.orange600,
    fontWeight: "500",
    fontStyle: "italic",
    marginTop: 4,
  },
  tripDetailsList: {
    gap: 8,
  },
  tripDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: COLORS.gray50,
    borderRadius: 7,
  },
  tripDetailLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  tripDetailLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.gray900,
  },
  tripDetailRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.gray100,
    borderRadius: 4,
  },
  countText: {
    fontSize: 12,
    color: COLORS.gray600,
  },
  historyItem: {
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
  historyContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyInfo: {
    flex: 1,
  },
  historyDestination: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray900,
    marginBottom: 4,
  },
  historyDates: {
    fontSize: 14,
    color: COLORS.gray600,
  },
  ratingContainer: {
    flexDirection: "row",
    gap: 2,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.gray900,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.gray600,
    marginBottom: 24,
    lineHeight: 20,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray900,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray100,
    borderRadius: 7,
    padding: 12,
    fontSize: 16,
    color: COLORS.gray900,
    backgroundColor: COLORS.white,
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
  },
  addButton: {
    backgroundColor: COLORS.blue600,
    borderRadius: 7,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  poiItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: COLORS.gray50,
    borderRadius: 7,
    marginBottom: 8,
    gap: 8,
  },
  poiText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.gray900,
  },
  methodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  methodOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: COLORS.gray100,
    backgroundColor: COLORS.white,
  },
  methodOptionActive: {
    borderColor: COLORS.blue600,
    backgroundColor: COLORS.blue50,
  },
  methodText: {
    fontSize: 14,
    color: COLORS.gray600,
  },
  methodTextActive: {
    color: COLORS.blue600,
    fontWeight: "500",
  },
  generateButton: {
    borderRadius: 7,
    overflow: "hidden",
    marginVertical: 20,
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
  resultContainer: {
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.gray900,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.gray50,
    borderRadius: 7,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.gray900,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray600,
    marginTop: 4,
  },
  insightCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: COLORS.orange50,
    borderRadius: 7,
    marginBottom: 16,
    gap: 8,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.orange600,
  },
  routeVisualization: {
    backgroundColor: COLORS.white,
    borderRadius: 7,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.gray100,
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray900,
    marginBottom: 16,
  },
  routeStep: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  routeNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.blue600,
    justifyContent: "center",
    alignItems: "center",
  },
  routeNumberText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
  },
  routeDetails: {
    flex: 1,
  },
  routeName: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.gray900,
  },
  routeAddress: {
    fontSize: 12,
    color: COLORS.gray600,
    marginTop: 2,
  },
  // AI Itinerary Builder Styles
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionCard: {
    flex: 1,
    minWidth: "45%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: COLORS.gray100,
    backgroundColor: COLORS.white,
    alignItems: "center",
  },
  optionCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.orange50,
  },
  optionText: {
    fontSize: 14,
    color: COLORS.gray600,
    fontWeight: "500",
  },
  optionTextActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: COLORS.gray50,
    color: COLORS.gray900,
  },
  daySection: {
    marginBottom: 20,
  },
  itineraryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  scoreCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.orange50,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  scoreText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "600",
  },
  itinerarySubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray900,
    marginBottom: 16,
  },
  itineraryList: {
    gap: 8,
  },
  itineraryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: COLORS.white,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: COLORS.gray100,
    gap: 12,
  },
  timeSlot: {
    alignItems: "center",
    minWidth: 60,
  },
  timeText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.gray900,
  },
  durationText: {
    fontSize: 12,
    color: COLORS.gray400,
  },
  poiName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.gray900,
  },
  itineraryContent: {
    flex: 1,
  },
  itineraryCategoryBadge: {
    backgroundColor: COLORS.gray100,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  categoryText: {
    fontSize: 10,
    color: COLORS.gray600,
    fontWeight: "500",
    textTransform: "uppercase",
  },
  itineraryNote: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: COLORS.blue50,
    borderRadius: 7,
    marginTop: 16,
    gap: 8,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.blue600,
    lineHeight: 16,
  },
  // Smart Stays Finder Styles
  accommodationList: {
    gap: 16,
  },
  accommodationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 7,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.gray100,
  },
  accommodationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  accommodationName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray900,
    marginRight: 8,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  priceAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.green600,
  },
  priceUnit: {
    fontSize: 12,
    color: COLORS.gray600,
  },
  accommodationDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  accommodationLocation: {
    flex: 1,
    fontSize: 14,
    color: COLORS.gray600,
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.gray600,
    marginLeft: 4,
  },
  aiInsightText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.green600,
    fontStyle: "italic",
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  amenityBadge: {
    backgroundColor: COLORS.gray100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  amenityText: {
    fontSize: 10,
    color: COLORS.gray600,
    fontWeight: "500",
  },
  bookingButton: {
    backgroundColor: COLORS.green600,
    borderRadius: 7,
    paddingVertical: 10,
    alignItems: "center",
  },
  bookingButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
  aiNote: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: COLORS.green50,
    borderRadius: 7,
    marginTop: 16,
    gap: 8,
  },
  // Local Food AI Styles
  restaurantList: {
    gap: 16,
  },
  restaurantCard: {
    backgroundColor: COLORS.white,
    borderRadius: 7,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.gray100,
  },
  restaurantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  restaurantName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray900,
    marginRight: 8,
  },
  tasteMatchBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.orange50,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  tasteMatchText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "600",
  },
  restaurantCuisine: {
    fontSize: 14,
    color: COLORS.gray600,
    marginBottom: 4,
  },
  restaurantDistance: {
    fontSize: 12,
    color: COLORS.gray400,
    marginBottom: 12,
  },
  signatureContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  signatureText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.orange600,
    fontWeight: "500",
  },
  localTipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 8,
    backgroundColor: COLORS.blue50,
    borderRadius: 6,
    marginBottom: 12,
    gap: 6,
  },
  localTipText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.blue600,
    lineHeight: 16,
    fontStyle: "italic",
  },
  restaurantFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  directionsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  directionsText: {
    fontSize: 12,
    color: COLORS.blue600,
    fontWeight: "500",
  },
  // Checklist Styles
  progressCard: {
    backgroundColor: COLORS.gray50,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray900,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.gray600,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.gray200,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  addTaskContainer: {
    gap: 12,
  },
  taskInput: {
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: COLORS.white,
  },
  categorySelector: {
    gap: 8,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.gray700,
  },
  categoryOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    backgroundColor: COLORS.white,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 12,
    color: COLORS.gray600,
    fontWeight: "500",
  },
  categoryChipTextActive: {
    color: COLORS.white,
    fontWeight: "600",
  },
  addTaskButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  addTaskButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  checklistContainer: {
    gap: 12,
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray100,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.gray300,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  taskContent: {
    flex: 1,
    gap: 4,
  },
  taskText: {
    fontSize: 16,
    color: COLORS.gray900,
    lineHeight: 20,
  },
  taskTextCompleted: {
    textDecorationLine: "line-through",
    color: COLORS.gray500,
  },
  taskMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  deleteButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.gray600,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.gray500,
    textAlign: "center",
    lineHeight: 20,
  },
});
