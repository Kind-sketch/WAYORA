import { motion } from "framer-motion";
import { Header } from "../layout/Header";
import { QuickActionsHub } from "./QuickActionsHub";
import { CurrentTripCard } from "./CurrentTripCard";
import { UpcomingGems } from "./UpcomingGems";
import { CulturalTipCard } from "./CulturalTipCard";

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export const HomeScreen = ({ onNavigate }: HomeScreenProps) => {
  const handleActionClick = (action: string) => {
    // Pass all action IDs to the navigation handler
    onNavigate(action);
  };

  return (
    <motion.div
      className="min-h-full bg-gradient-to-b from-background via-background to-secondary pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header title="Wayora" tamilTitle="வயோரா" onNavigate={onNavigate} />

      {/* Welcome Section */}
      <motion.section
        className="px-5 pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-foreground">
          Vanakkam! <span className="inline-block animate-pulse">🙏</span>
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Ready to explore Tamil Nadu?</p>
      </motion.section>

      <CulturalTipCard />
      <QuickActionsHub onActionClick={handleActionClick} />
      <CurrentTripCard />
      <UpcomingGems />
    </motion.div>
  );
};
