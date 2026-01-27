import { Bell, Menu, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStats } from "@/hooks/useUserStats";

interface HeaderProps {
  title: string;
  tamilTitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  onNavigate?: (screen: string) => void;
}

export const Header = ({ title, tamilTitle, showBack, onBack, onNavigate }: HeaderProps) => {
  const { stats } = useUserStats();

  return (
    <motion.header
      className="flex items-center justify-between px-5 py-4 bg-card border-b-[1.5px] border-foreground"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        <button className="brutalist-btn-secondary p-2">
          <Menu size={20} strokeWidth={2.5} />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          {tamilTitle && (
            <p className="text-xs text-muted-foreground font-tamil">{tamilTitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* XP Badge */}
        <motion.button
          className="brutalist-btn-secondary px-2 py-1.5 flex items-center gap-1"
          onClick={() => onNavigate?.("exploria")}
          whileTap={{ scale: 0.95 }}
        >
          <Zap size={14} className="text-primary" />
          <span className="text-xs font-bold">{stats.xp}</span>
        </motion.button>

        {/* AI Assistant */}
        <motion.button
          className="brutalist-btn-primary p-2"
          onClick={() => onNavigate?.("assistant")}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles size={20} strokeWidth={2.5} />
        </motion.button>

        {/* Notifications */}
        <button className="brutalist-btn-secondary p-2 relative">
          <Bell size={20} strokeWidth={2.5} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full border border-foreground" />
        </button>
      </div>
    </motion.header>
  );
};
