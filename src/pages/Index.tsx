import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MobileContainer } from "../components/layout/MobileContainer";
import { TabBar } from "../components/layout/TabBar";
import { HomeScreen } from "../components/home/HomeScreen";
import { ExploreScreen } from "../components/explore/ExploreScreen";
import { AIRoutePlanner } from "../components/planner/AIRoutePlanner";
import { BudgetTracker } from "../components/budget/BudgetTracker";
import { ProfileScreen } from "../components/profile/ProfileScreen";
import { ExploriaScreen } from "../components/gamification/ExploriaScreen";
import { WayoraAssistant } from "../components/assistant/WayoraAssistant";
import { TripAtlas } from "../components/atlas/TripAtlas";
import { SplashScreen } from "../components/ui/SplashScreen";
import { OnboardingFlow } from "../components/onboarding/OnboardingFlow";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [subScreen, setSubScreen] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Check if onboarding is needed
      const onboardingDone = localStorage.getItem("wayora_onboarding_done");
      if (!onboardingDone) {
        setShowOnboarding(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (screen: string) => {
    if (["home", "explore", "planner", "budget", "profile"].includes(screen)) {
      setActiveTab(screen);
      setSubScreen(null);
    } else {
      setSubScreen(screen);
    }
  };

  const handleBack = () => {
    setSubScreen(null);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const renderScreen = () => {
    // Handle sub-screens first
    if (subScreen === "exploria") {
      return <ExploriaScreen onBack={handleBack} />;
    }
    if (subScreen === "assistant") {
      return <WayoraAssistant onBack={handleBack} />;
    }
    if (subScreen === "atlas") {
      return <TripAtlas onBack={handleBack} />;
    }

    // Main tab screens
    switch (activeTab) {
      case "home":
        return <HomeScreen onNavigate={handleNavigate} />;
      case "explore":
        return <ExploreScreen onNavigate={handleNavigate} />;
      case "planner":
        return <AIRoutePlanner onBack={() => setActiveTab("home")} onNavigate={handleNavigate} />;
      case "budget":
        return <BudgetTracker onBack={() => setActiveTab("home")} />;
      case "profile":
        return <ProfileScreen />;
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <MobileContainer>
      <AnimatePresence mode="wait">
        {isLoading && <SplashScreen key="splash" />}
        {!isLoading && showOnboarding && (
          <OnboardingFlow key="onboarding" onComplete={handleOnboardingComplete} />
        )}
      </AnimatePresence>

      {!isLoading && !showOnboarding && (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={subScreen || activeTab}
              initial={{ opacity: 0, x: subScreen ? 20 : 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: subScreen ? -20 : 0 }}
              transition={{ duration: 0.2 }}
              className="min-h-screen"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </>
      )}
    </MobileContainer>
  );
};

export default Index;
