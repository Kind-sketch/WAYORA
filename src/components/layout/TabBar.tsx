import { Home, Compass, Map, Wallet, User } from "lucide-react";
import { motion } from "framer-motion";

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "home", icon: Home, label: "Home" },
  { id: "explore", icon: Compass, label: "Explore" },
  { id: "planner", icon: Map, label: "Plan" },
  { id: "budget", icon: Wallet, label: "Budget" },
  { id: "profile", icon: User, label: "Profile" },
];

export const TabBar = ({ activeTab, onTabChange }: TabBarProps) => {
  return (
    <nav className="tab-bar">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              className={`tab-item relative ${isActive ? "active" : ""}`}
              onClick={() => onTabChange(tab.id)}
              whileTap={{ scale: 0.9 }}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-primary rounded-xl"
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10">
                <Icon size={20} strokeWidth={2} />
              </span>
              <span className={`text-[10px] font-medium relative z-10 ${isActive ? 'text-primary-foreground' : ''}`}>
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
