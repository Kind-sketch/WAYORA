import { Star, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const gems = [
  {
    id: 1,
    name: "Meenakshi Temple",
    tamilName: "மீனாட்சி கோயில்",
    location: "Madurai",
    rating: 4.9,
    image: "🕌",
    tag: "Spiritual",
  },
  {
    id: 2,
    name: "Nilgiri Mountain Railway",
    tamilName: "நீலகிரி மலை ரயில்",
    location: "Ooty",
    rating: 4.8,
    image: "🚂",
    tag: "Heritage",
  },
  {
    id: 3,
    name: "Marina Beach",
    tamilName: "மெரினா கடற்கரை",
    location: "Chennai",
    rating: 4.5,
    image: "🏖️",
    tag: "Nature",
  },
];

export const UpcomingGems = () => {
  return (
    <motion.section 
      className="px-5 py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-bold">Upcoming Gems</h2>
          <p className="text-xs text-muted-foreground font-tamil">வரவிருக்கும் அழகுகள்</p>
        </div>
        <button className="brutalist-btn-secondary px-3 py-1.5 text-xs flex items-center gap-1">
          View All <ChevronRight size={14} />
        </button>
      </div>
      
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
        {gems.map((gem, index) => (
          <motion.div
            key={gem.id}
            className="brutalist-card min-w-[160px] p-3 cursor-pointer"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-4xl mb-2">{gem.image}</div>
            <div className="brutalist-badge bg-primary text-[10px] mb-2">{gem.tag}</div>
            <h3 className="font-bold text-sm leading-tight">{gem.name}</h3>
            <p className="text-[10px] text-muted-foreground font-tamil">{gem.tamilName}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">{gem.location}</span>
              <div className="flex items-center gap-0.5">
                <Star size={12} className="fill-primary text-primary" />
                <span className="text-xs font-bold">{gem.rating}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};
