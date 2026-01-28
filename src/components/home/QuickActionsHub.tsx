import { Map, Route, CalendarCheck, Phone } from "lucide-react";
import { motion } from "framer-motion";

const actions = [
  { id: "atlas", icon: Map, label: "Trip Atlas", tamilLabel: "பயண வரைபடம்", color: "gradient-primary" },
  { id: "route", icon: Route, label: "AI Route", tamilLabel: "AI வழி", color: "bg-foreground text-background" },
  { id: "bookings", icon: CalendarCheck, label: "Bookings", tamilLabel: "முன்பதிவுகள்", color: "bg-card" },
  { id: "emergency", icon: Phone, label: "Emergency", tamilLabel: "அவசரம்", color: "bg-accent" },
];

interface QuickActionsHubProps {
  onActionClick?: (action: string) => void;
}

export const QuickActionsHub = ({ onActionClick }: QuickActionsHubProps) => {
  return (
    <motion.section
      className="px-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <div className="grid grid-cols-4 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              className={`quick-action rounded-2xl ${action.color}`}
              onClick={() => onActionClick?.(action.id)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color === "bg-foreground text-background" ? "bg-primary/20" : "bg-background/20"
                }`}>
                <Icon size={20} strokeWidth={2} />
              </div>
              <span className="text-[11px] font-semibold leading-tight">{action.label}</span>
              <span className="text-[9px] font-tamil opacity-70">{action.tamilLabel}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
};
