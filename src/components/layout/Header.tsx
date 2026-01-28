import { Bell, Menu, Sparkles, Zap, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStats } from "@/hooks/useUserStats";
import { useState, useEffect } from "react";

interface HeaderProps {
  title: string;
  tamilTitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  onNavigate?: (screen: string) => void;
}

export const Header = ({ title, tamilTitle, showBack, onBack, onNavigate }: HeaderProps) => {
  const { stats } = useUserStats();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved preference
    const savedTheme = localStorage.getItem("wayora_theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("wayora_theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("wayora_theme", "dark");
    }
    setIsDark(!isDark);
  };

  return (
    <motion.header
      className="flex items-center justify-between px-5 py-4 bg-card/80 backdrop-blur-xl border-b border-foreground/10 sticky top-0 z-40"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        <button className="brutalist-btn-secondary p-2.5 rounded-xl">
          <Menu size={20} strokeWidth={2} />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
          {tamilTitle && (
            <p className="text-xs text-primary font-tamil">{tamilTitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* XP Badge */}
        <motion.button
          className="brutalist-btn-secondary px-3 py-2 flex items-center gap-1.5 rounded-xl"
          onClick={() => onNavigate?.("exploria")}
          whileTap={{ scale: 0.95 }}
        >
          <Zap size={14} className="text-primary" />
          <span className="text-xs font-bold">{stats.xp}</span>
        </motion.button>

        {/* AI Assistant */}
        <motion.button
          className="brutalist-btn-primary p-2.5 rounded-xl"
          onClick={() => onNavigate?.("assistant")}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles size={18} strokeWidth={2} />
        </motion.button>

        {/* Theme Toggle */}
        <motion.button
          className="brutalist-btn-secondary p-2.5 rounded-xl"
          onClick={toggleTheme}
          whileTap={{ scale: 0.95 }}
        >
          {isDark ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
        </motion.button>

        {/* Notifications */}
        <button className="brutalist-btn-secondary p-2.5 rounded-xl relative">
          <Bell size={18} strokeWidth={2} />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-accent rounded-full border-2 border-card" />
        </button>
      </div>
    </motion.header>
  );
};
