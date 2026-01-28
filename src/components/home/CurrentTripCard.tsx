import { MapPin, ArrowRight, Clock, Plus, Navigation } from "lucide-react";
import { motion } from "framer-motion";
import { useTrips } from "@/hooks/useTrips";
import { TripCardSkeleton } from "@/components/ui/Skeletons";
import { useState, useEffect } from "react";

export const CurrentTripCard = () => {
  const { activeTrip, trips } = useTrips();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <section className="px-5 py-2">
        <h2 className="text-lg font-bold mb-1 text-foreground">Current Trip</h2>
        <p className="text-xs text-muted-foreground font-tamil mb-3">தற்போதைய பயணம்</p>
        <TripCardSkeleton />
      </section>
    );
  }

  // If no active trip, show placeholder
  if (!activeTrip && trips.length === 0) {
    return (
      <motion.section
        className="px-5 py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-bold mb-1 text-foreground">Current Trip</h2>
        <p className="text-xs text-muted-foreground font-tamil mb-3">தற்போதைய பயணம்</p>

        <motion.div
          className="glass-card p-6 text-center cursor-pointer"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Plus size={24} className="text-primary" />
          </div>
          <p className="text-sm font-bold text-foreground mb-1">No Active Trip</p>
          <p className="text-xs text-muted-foreground font-tamil mb-1">செயலில் பயணம் இல்லை</p>
          <p className="text-xs text-muted-foreground">Tap to plan your first adventure!</p>
        </motion.div>
      </motion.section>
    );
  }

  // Use active trip or first saved trip
  const trip = activeTrip || trips[0];
  const totalStops = trip.stops.length;
  const completedStops = 1;
  const progress = (completedStops / totalStops) * 100;
  const currentDay = 1;

  return (
    <motion.section
      className="px-5 py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-lg font-bold mb-1 text-foreground">Current Trip</h2>
      <p className="text-xs text-muted-foreground font-tamil mb-3">தற்போதைய பயணம்</p>

      <motion.div
        className="glass-card overflow-hidden"
        whileHover={{ y: -2 }}
      >
        {/* Header with gradient */}
        <div className="gradient-primary p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-foreground/20 flex items-center justify-center">
                <Navigation size={18} className="text-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <span>{trip.source}</span>
                  <ArrowRight size={14} />
                  <span>{trip.destination}</span>
                </div>
                <p className="text-xs text-foreground/70">{trip.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs bg-foreground/20 text-foreground px-2.5 py-1.5 rounded-lg">
              <Clock size={12} />
              <span className="font-semibold">Day {currentDay}</span>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="p-4 bg-card">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-muted-foreground">Journey Progress</span>
            <span className="font-bold text-primary">{progress.toFixed(0)}%</span>
          </div>
          <div className="brutalist-progress">
            <motion.div
              className="brutalist-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
            {trip.stops.slice(0, 3).map((stop, i) => (
              <span
                key={i}
                className={`flex items-center gap-1 ${i < completedStops
                    ? 'text-primary'
                    : i === completedStops
                      ? 'text-foreground font-medium'
                      : 'opacity-50'
                  }`}
              >
                {i < completedStops && '✓ '}
                {i === completedStops && <MapPin size={10} />}
                {stop.name.split(' - ')[0]}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};
