import { Star, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const gems = [
  {
    id: 1,
    name: "Meenakshi Temple",
    tamilName: "மீனாட்சி கோயில்",
    location: "Madurai",
    rating: 4.9,
    image: "https://picsum.photos/seed/meenakshi/300/200",
    tag: "Spiritual",
  },
  {
    id: 2,
    name: "Nilgiri Mountain Railway",
    tamilName: "நீலகிரி மலை ரயில்",
    location: "Ooty",
    rating: 4.8,
    image: "https://picsum.photos/seed/nilgiri/300/200",
    tag: "Heritage",
  },
  {
    id: 3,
    name: "Rameswaram Temple",
    tamilName: "ராமேஸ்வரம் கோயில்",
    location: "Rameswaram",
    rating: 4.9,
    image: "https://picsum.photos/seed/rameswaram/300/200",
    tag: "Pilgrimage",
  },
];

export const UpcomingGems = () => {
  return (
    <motion.section
      className="px-5 py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Hidden Gems</h2>
          <p className="text-xs text-muted-foreground font-tamil">மறைந்த அழகுகள்</p>
        </div>
        <button className="flex items-center gap-1 text-xs text-primary font-medium">
          View all <ChevronRight size={14} />
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
        {gems.map((gem, index) => (
          <motion.div
            key={gem.id}
            className="flex-shrink-0 w-44 glass-card overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative h-28 overflow-hidden bg-muted">
              <img
                src={gem.image}
                alt={gem.name}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://via.placeholder.com/300x200/2DD4BF/ffffff?text=${encodeURIComponent(gem.name)}`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <span className="px-2 py-0.5 rounded-md text-[9px] font-bold gradient-primary text-foreground">
                  {gem.tag}
                </span>
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-bold text-sm text-foreground truncate">{gem.name}</h3>
              <p className="text-[10px] font-tamil text-muted-foreground truncate">{gem.tamilName}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-muted-foreground">{gem.location}</span>
                <div className="flex items-center gap-1">
                  <Star size={10} className="fill-primary text-primary" />
                  <span className="text-[10px] font-bold text-foreground">{gem.rating}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};
