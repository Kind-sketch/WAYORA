import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import MapTracker from "../components/MapTracker";

const COLORS = {
  primary: "#ea580c",
  secondary: "#fb923c",
  white: "#ffffff",
  gray50: "#f9fafb",
  gray100: "#f3f4f6",
  gray400: "#9ca3af",
  gray600: "#4b5563",
  gray900: "#111827",
  yellow500: "#eab308",
  orange50: "#fff7ed",
  amber50: "#fffbeb",
};

export default function ExploreScreen() {
  const [selectedTab, setSelectedTab] = useState("challenges");

  const exploriaChallenges = [
    {
      title: "AI Hidden Gem Hunter",
      progress: 75,
      points: 150,
      icon: "explore",
      description: "Discover 5 AI-recommended secret spots",
      reward: "Unlock Premium Photo Filters",
    },
    {
      title: "Smart Budget Master",
      progress: 60,
      points: 120,
      icon: "attach-money",
      description: "Stay within AI-optimized budget for 7 days",
      reward: "Personal Finance AI Assistant",
    },
    {
      title: "Photo Explorer Pro",
      progress: 90,
      points: 200,
      icon: "camera-alt",
      description: "Upload 20 photos with AI enhancement",
      reward: "Advanced AI Photo Editor",
    },
    {
      title: "Cultural AI Connector",
      progress: 45,
      points: 80,
      icon: "public",
      description: "Experience 3 AI-curated cultural activities",
      reward: "Local Culture AI Guide",
    },
  ];

  const recentAchievements = [
    { title: "First Check-in", icon: "location-on", earned: "2 days ago" },
    { title: "Budget Saver", icon: "attach-money", earned: "1 week ago" },
    { title: "Photo Pro", icon: "camera-alt", earned: "2 weeks ago" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Exploria</Text>
          <Text style={styles.headerSubtitle}>XP: 1,250 • Streak: 6 days</Text>
        </View>
        <View style={styles.pointsContainer}>
          <View style={styles.tokenPill}>
            <MaterialIcons name="local-offer" size={14} color={COLORS.white} />
            <Text style={styles.tokenText}>42</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Map + Live Tracking */}
        <View
          style={{
            height: 240,
            borderRadius: 12,
            overflow: "hidden",
            marginBottom: 16,
          }}
        >
          <MapTracker />
        </View>
        {/* AI-Enhanced Level Progress */}
        <View style={styles.levelCard}>
          <LinearGradient
            colors={[COLORS.orange50, COLORS.amber50]}
            style={styles.levelGradient}
          >
            <View style={styles.levelHeader}>
              <View>
                <Text style={styles.levelTitle}>AI Explorer Level 12</Text>
                <Text style={styles.levelSubtitle}>Smart World Wanderer</Text>
              </View>
              <View style={styles.levelBadge}>
                <MaterialIcons
                  name="auto-awesome"
                  size={24}
                  color={COLORS.yellow500}
                />
              </View>
            </View>

            <View style={styles.levelProgress}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>
                  Progress to AI Master Level 13
                </Text>
                <Text style={styles.progressPoints}>1,250 / 1,500 XP</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: "83%" }]} />
              </View>
            </View>

            {/* AI Insights */}
            <View style={styles.aiInsight}>
              <MaterialIcons
                name="psychology"
                size={16}
                color={COLORS.primary}
              />
              <Text style={styles.aiInsightText}>
                AI suggests completing "Hidden Gem Hunter" for fastest level
                progression
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === "challenges" && styles.activeTab,
            ]}
            onPress={() => setSelectedTab("challenges")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "challenges" && styles.activeTabText,
              ]}
            >
              AI Challenges
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === "achievements" && styles.activeTab,
            ]}
            onPress={() => setSelectedTab("achievements")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "achievements" && styles.activeTabText,
              ]}
            >
              AI Rewards
            </Text>
          </TouchableOpacity>
        </View>

        {/* AI-Powered Challenges */}
        {selectedTab === "challenges" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>AI-Generated Challenges</Text>
              <View style={styles.aiIndicator}>
                <MaterialIcons
                  name="auto-awesome"
                  size={14}
                  color={COLORS.primary}
                />
                <Text style={styles.aiIndicatorText}>AI Curated</Text>
              </View>
            </View>

            {exploriaChallenges.map((challenge, index) => (
              <TouchableOpacity key={index} style={styles.challengeCard}>
                <View style={styles.challengeHeader}>
                  <View style={styles.challengeIcon}>
                    <MaterialIcons
                      name={challenge.icon as any}
                      size={16}
                      color={COLORS.primary}
                    />
                  </View>
                  <View style={styles.challengeInfo}>
                    <Text style={styles.challengeTitle}>{challenge.title}</Text>
                    <Text style={styles.challengeDescription}>
                      {challenge.description}
                    </Text>
                    <Text style={styles.challengeReward}>
                      🏆 {challenge.reward}
                    </Text>
                    <Text style={styles.challengePoints}>
                      {challenge.points} XP
                    </Text>
                  </View>
                  <Text style={styles.challengeProgress}>
                    {challenge.progress}%
                  </Text>
                </View>
                <View style={styles.challengeProgressBar}>
                  <View
                    style={[
                      styles.challengeProgressFill,
                      { width: `${challenge.progress}%` },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Recent Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <View style={styles.achievementsGrid}>
            {recentAchievements.map((achievement, index) => (
              <View key={index} style={styles.achievementCard}>
                <View style={styles.achievementIcon}>
                  <MaterialIcons
                    name={achievement.icon as any}
                    size={16}
                    color={COLORS.yellow500}
                  />
                </View>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDate}>{achievement.earned}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Countries</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>89</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>48</Text>
              <Text style={styles.statLabel}>Badges</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.gray900,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  levelCard: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
  },
  levelGradient: {
    padding: 16,
  },
  levelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.gray900,
    marginBottom: 4,
  },
  levelSubtitle: {
    fontSize: 14,
    color: COLORS.gray600,
  },
  levelBadge: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(234,179,8,0.2)",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  levelProgress: {},
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: COLORS.gray600,
  },
  progressPoints: {
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
    backgroundColor: COLORS.primary,
    borderRadius: 4,
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
  challengeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 7,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  challengeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
  },
  challengeIcon: {
    width: 32,
    height: 32,
    backgroundColor: "rgba(234,88,12,0.1)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray900,
    marginBottom: 2,
  },
  challengePoints: {
    fontSize: 14,
    color: COLORS.gray600,
  },
  challengeProgress: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.gray900,
  },
  challengeProgressBar: {
    height: 8,
    backgroundColor: COLORS.gray100,
    borderRadius: 4,
    overflow: "hidden",
  },
  challengeProgressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  achievementCard: {
    width: "30%",
    backgroundColor: COLORS.white,
    borderRadius: 7,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  achievementIcon: {
    width: 32,
    height: 32,
    backgroundColor: "rgba(234,179,8,0.2)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.gray900,
    textAlign: "center",
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 10,
    color: COLORS.gray600,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 7,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray600,
  },

  aiInsight: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    padding: 12,
    backgroundColor: "rgba(234,88,12,0.1)",
    borderRadius: 8,
    gap: 8,
  },
  aiInsightText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "500",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.gray100,
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.gray600,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: "600",
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
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.gray600,
    marginTop: 2,
  },
  tokenPill: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tokenText: {
    color: COLORS.white,
    fontWeight: "600",
    marginLeft: 4,
  },
  challengeDescription: {
    fontSize: 12,
    color: COLORS.gray600,
    marginTop: 2,
    marginBottom: 4,
  },
  challengeReward: {
    fontSize: 11,
    color: COLORS.yellow500,
    fontWeight: "500",
    marginBottom: 4,
  },
});
