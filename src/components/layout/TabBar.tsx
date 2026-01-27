import { Home, Compass, Route, Wallet, User } from "lucide-react";
import { motion } from "framer-motion";

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "home", icon: Home, label: "Home", tamilLabel: "வீடு" },
  { id: "explore", icon: Compass, label: "Explore", tamilLabel: "ஆராய்க" },
  { id: "planner", icon: Route, label: "AI Plan", tamilLabel: "திட்டம்" },
  { id: "budget", icon: Wallet, label: "Budget", tamilLabel: "பட்ஜெட்" },
  { id: "profile", icon: User, label: "Profile", tamilLabel: "சுயவிவரம்" },
];

export const TabBar = ({ activeTab, onTabChange }: TabBarProps) => {
  return (
    <div className="tab-bar">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              className={`tab-item ${isActive ? "active" : ""}`}
              onClick={() => onTabChange(tab.id)}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={20} strokeWidth={2.5} />
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
