import { MapPin, ArrowRight, Clock, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useTrips } from "@/hooks/useTrips";

export const CurrentTripCard = () => {
  const { activeTrip, trips } = useTrips();

  // If no active trip, show placeholder
  if (!activeTrip && trips.length === 0) {
    return (
      <motion.section
        className="px-5 py-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-bold mb-1">Current Trip</h2>
        <p className="text-xs text-muted-foreground font-tamil mb-3">தற்போதைய பயணம்</p>

        <motion.div
          className="brutalist-card p-6 text-center"
          whileHover={{ x: -2, y: -2 }}
        >
          <div className="w-12 h-12 mx-auto mb-3 rounded-[7px] bg-muted flex items-center justify-center">
            <Plus size={24} className="text-muted-foreground" />
          </div>
          <p className="text-sm font-bold mb-1">No Active Trip</p>
          <p className="text-xs text-muted-foreground font-tamil">செயலில் பயணம் இல்லை</p>
          <p className="text-xs text-muted-foreground mt-2">Use AI Route Planner to create your first trip!</p>
        </motion.div>
      </motion.section>
    );
  }

  // Use active trip or first saved trip
  const trip = activeTrip || trips[0];
  const totalStops = trip.stops.length;
  const completedStops = 1; // This would come from actual tracking
  const progress = (completedStops / totalStops) * 100;
  const currentDay = 1; // This would be calculated from trip start date

  return (
    <motion.section
      className="px-5 py-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-lg font-bold mb-1">Current Trip</h2>
      <p className="text-xs text-muted-foreground font-tamil mb-3">தற்போதைய பயணம்</p>

      <motion.div
        className="brutalist-card p-4 bg-foreground text-background"
        whileHover={{ x: -2, y: -2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-[7px] bg-primary flex items-center justify-center">
              <MapPin size={20} className="text-foreground" strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-bold">
                <span>{trip.source}</span>
                <ArrowRight size={14} />
                <span>{trip.destination}</span>
              </div>
              <p className="text-xs text-muted">{trip.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs bg-primary text-foreground px-2 py-1 rounded-[7px]">
            <Clock size={12} />
            <span className="font-semibold">Day {currentDay}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted">Journey Progress</span>
            <span className="font-bold text-primary">{progress.toFixed(0)}%</span>
          </div>
          <div className="brutalist-progress bg-card/20 border-primary">
            <motion.div
              className="brutalist-progress-fill bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted">
            {trip.stops.slice(0, 3).map((stop, i) => (
              <span
                key={i}
                className={i < completedStops ? '' : i === completedStops ? 'text-primary font-bold' : 'opacity-50'}
              >
                {i < completedStops ? '✓ ' : i === completedStops ? '→ ' : ''}{stop.name.split(' - ')[0]}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};
