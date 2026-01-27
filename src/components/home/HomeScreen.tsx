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
    if (action === "route") {
      onNavigate("planner");
    } else if (action === "atlas") {
      onNavigate("atlas");
    }
  };

  return (
    <motion.div
      className="min-h-full bg-background pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header title="Wayora" tamilTitle="வயோரா" onNavigate={onNavigate} />
      <CulturalTipCard />
      <QuickActionsHub onActionClick={handleActionClick} />
      <CurrentTripCard />
      <UpcomingGems />
    </motion.div>
  );
};
