import { Map, Route, CalendarCheck, Phone } from "lucide-react";
import { motion } from "framer-motion";

const actions = [
  { id: "atlas", icon: Map, label: "Trip Atlas", tamilLabel: "பயண வரைபடம்", color: "bg-primary" },
  { id: "route", icon: Route, label: "AI Route", tamilLabel: "AI வழி", color: "bg-foreground text-background" },
  { id: "bookings", icon: CalendarCheck, label: "Bookings", tamilLabel: "முன்பதிவுகள்", color: "bg-card" },
  { id: "emergency", icon: Phone, label: "Emergency", tamilLabel: "அவசரம்", color: "bg-destructive text-background" },
];

interface QuickActionsHubProps {
  onActionClick: (action: string) => void;
}

export const QuickActionsHub = ({ onActionClick }: QuickActionsHubProps) => {
  return (
    <motion.section 
      className="px-5 py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h2 className="text-lg font-bold mb-1">Quick Actions</h2>
      <p className="text-xs text-muted-foreground font-tamil mb-3">விரைவான செயல்கள்</p>
      
      <div className="grid grid-cols-4 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              className={`quick-action ${action.color}`}
              onClick={() => onActionClick(action.id)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={24} strokeWidth={2} />
              <span className="text-[10px] font-semibold text-center leading-tight">{action.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
};
