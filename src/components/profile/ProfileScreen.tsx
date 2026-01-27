import { motion } from "framer-motion";
import { Settings, ChevronRight, Award, MapPin, Camera, LogOut, Moon, Bell, Shield } from "lucide-react";

const stats = [
  { label: "Trips", value: "12", icon: MapPin },
  { label: "Photos", value: "247", icon: Camera },
  { label: "Badges", value: "8", icon: Award },
];

const menuItems = [
  { icon: Bell, label: "Notifications", sublabel: "Manage alerts" },
  { icon: Moon, label: "Dark Mode", sublabel: "Coming soon", disabled: true },
  { icon: Shield, label: "Privacy", sublabel: "Data & permissions" },
  { icon: Settings, label: "Settings", sublabel: "App preferences" },
];

export const ProfileScreen = () => {
  return (
    <motion.div 
      className="min-h-full bg-background pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Profile Header */}
      <div className="bg-foreground text-background px-5 py-8">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-[7px] border-[2px] border-primary bg-primary/20 flex items-center justify-center text-3xl">
            🧑‍💼
          </div>
          <div>
            <h1 className="text-2xl font-bold">Arjun Kumar</h1>
            <p className="text-xs font-tamil opacity-70">அர்ஜுன் குமார்</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="brutalist-badge bg-primary text-foreground text-xs">Level 12</span>
              <span className="text-xs opacity-70">Wanderer</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="bg-card/10 rounded-[7px] border-[1.5px] border-primary/50 p-3 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <Icon size={20} className="mx-auto mb-1 text-primary" />
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-[10px] opacity-70">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Menu */}
      <div className="p-5 space-y-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.label}
              className={`brutalist-card w-full p-4 flex items-center justify-between ${
                item.disabled ? "opacity-50" : ""
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: item.disabled ? 0.5 : 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              disabled={item.disabled}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[7px] bg-muted flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.sublabel}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-muted-foreground" />
            </motion.button>
          );
        })}

        <motion.button
          className="brutalist-card w-full p-4 flex items-center justify-between bg-destructive/10 border-destructive"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[7px] bg-destructive/20 flex items-center justify-center">
              <LogOut size={20} className="text-destructive" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm text-destructive">Log Out</p>
              <p className="text-xs text-muted-foreground">Sign out of your account</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-destructive" />
        </motion.button>
      </div>

      {/* App Version */}
      <div className="text-center text-xs text-muted-foreground mt-4">
        <p>Wayora v1.0.0</p>
        <p className="font-tamil">வயோரா - தமிழ்நாடு சுற்றுலா</p>
      </div>
    </motion.div>
  );
};
