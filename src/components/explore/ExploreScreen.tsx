import { useState } from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, ChevronRight, Heart, Sparkles } from "lucide-react";
import { toggleFavorite, isFavorite } from "@/lib/storageService";
import { useUserStats } from "@/hooks/useUserStats";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { id: "all", label: "All", emoji: "✨" },
  { id: "temples", label: "Temples", emoji: "🕌" },
  { id: "beaches", label: "Beaches", emoji: "🏖️" },
  { id: "hills", label: "Hills", emoji: "⛰️" },
  { id: "heritage", label: "Heritage", emoji: "🏛️" },
];

const destinations = [
  {
    id: "1",
    name: "Brihadeeswarar Temple",
    tamilName: "பெருவுடையார் கோயில்",
    location: "Thanjavur",
    rating: 4.9,
    duration: "2-3 hours",
    image: "🕌",
    tags: ["UNESCO", "Chola"],
    featured: true,
    category: "temples",
  },
  {
    id: "2",
    name: "Ooty Botanical Gardens",
    tamilName: "ஊட்டி தாவரவியல் பூங்கா",
    location: "Nilgiris",
    rating: 4.7,
    duration: "3-4 hours",
    image: "🌺",
    tags: ["Nature", "Family"],
    featured: false,
    category: "hills",
  },
  {
    id: "3",
    name: "Mahabalipuram Monuments",
    tamilName: "மாமல்லபுரம் சிற்பங்கள்",
    location: "Chengalpattu",
    rating: 4.8,
    duration: "4-5 hours",
    image: "🏛️",
    tags: ["UNESCO", "Pallava"],
    featured: true,
    category: "heritage",
  },
  {
    id: "4",
    name: "Marina Beach",
    tamilName: "மெரினா கடற்கரை",
    location: "Chennai",
    rating: 4.5,
    duration: "2-3 hours",
    image: "🏖️",
    tags: ["Beach", "Iconic"],
    featured: false,
    category: "beaches",
  },
  {
    id: "5",
    name: "Meenakshi Temple",
    tamilName: "மீனாட்சி கோயில்",
    location: "Madurai",
    rating: 4.9,
    duration: "3-4 hours",
    image: "🕌",
    tags: ["Iconic", "Must-Visit"],
    featured: true,
    category: "temples",
  },
  {
    id: "6",
    name: "Kodaikanal Lake",
    tamilName: "கொடைக்கானல் ஏரி",
    location: "Kodaikanal",
    rating: 4.6,
    duration: "2-3 hours",
    image: "🏔️",
    tags: ["Nature", "Scenic"],
    featured: false,
    category: "hills",
  },
];

interface ExploreScreenProps {
  onNavigate: (screen: string) => void;
}

export const ExploreScreen = ({ onNavigate }: ExploreScreenProps) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [favorites, setFavorites] = useState<Record<string, boolean>>(() => {
    return destinations.reduce((acc, dest) => {
      acc[dest.id] = isFavorite(dest.id);
      return acc;
    }, {} as Record<string, boolean>);
  });
  const [searchQuery, setSearchQuery] = useState("");

  const { addFavoriteXP } = useUserStats();
  const { toast } = useToast();

  const handleToggleFavorite = (destId: string, destName: string) => {
    const isNowFavorite = toggleFavorite(destId);
    setFavorites(prev => ({ ...prev, [destId]: isNowFavorite }));

    if (isNowFavorite) {
      addFavoriteXP();
      toast({
        title: "❤️ Added to Favorites",
        description: `${destName} saved to your list`,
        duration: 2000,
      });
    } else {
      toast({
        title: "Removed from Favorites",
        description: `${destName} removed from your list`,
        duration: 2000,
      });
    }
  };

  // Filter destinations
  const filteredDestinations = destinations.filter(dest => {
    const matchesCategory = activeCategory === "all" || dest.category === activeCategory;
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <motion.div
      className="min-h-full bg-background pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="px-5 py-4 bg-card border-b-[1.5px] border-foreground">
        <h1 className="text-2xl font-bold">Explore</h1>
        <p className="text-xs text-muted-foreground font-tamil">தமிழ்நாட்டை ஆராயுங்கள்</p>
      </div>

      {/* Search */}
      <div className="px-5 py-4">
        <div className="brutalist-card p-1">
          <input
            type="text"
            placeholder="Search destinations..."
            className="w-full px-4 py-3 bg-transparent outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-5 pb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
          {categories.map((cat, index) => (
            <motion.button
              key={cat.id}
              className={`brutalist-btn-secondary px-4 py-2 whitespace-nowrap text-sm ${activeCategory === cat.id ? "bg-foreground text-background" : ""
                }`}
              onClick={() => setActiveCategory(cat.id)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <span className="mr-1">{cat.emoji}</span> {cat.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* AI Suggestion Banner */}
      <motion.div
        className="mx-5 mb-4 brutalist-card p-4 bg-primary cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onNavigate("planner")}
      >
        <div className="flex items-center gap-3">
          <Sparkles size={24} />
          <div className="flex-1">
            <p className="font-bold text-sm">Get AI-powered recommendations</p>
            <p className="text-xs opacity-80">Based on your interests and travel style</p>
          </div>
          <ChevronRight size={20} />
        </div>
      </motion.div>

      {/* Destinations */}
      <div className="px-5 space-y-4">
        <h2 className="text-lg font-bold">
          {activeCategory === "all" ? "Popular Destinations" : categories.find(c => c.id === activeCategory)?.label}
        </h2>

        {filteredDestinations.length > 0 ? (
          filteredDestinations.map((dest, index) => (
            <motion.div
              key={dest.id}
              className="brutalist-card overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <div className="flex">
                <div className="w-24 h-24 bg-muted flex items-center justify-center text-4xl border-r-[1.5px] border-foreground">
                  {dest.image}
                </div>
                <div className="flex-1 p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-sm">{dest.name}</h3>
                      <p className="text-[10px] font-tamil text-muted-foreground">{dest.tamilName}</p>
                    </div>
                    <button
                      className={`p-1.5 rounded-[7px] border-[1.5px] border-foreground transition-colors ${favorites[dest.id]
                          ? 'bg-destructive border-destructive text-background'
                          : 'hover:bg-destructive hover:border-destructive'
                        }`}
                      onClick={() => handleToggleFavorite(dest.id, dest.name)}
                    >
                      <Heart size={14} className={favorites[dest.id] ? 'fill-current' : ''} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {dest.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {dest.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-1">
                      {dest.tags.map((tag) => (
                        <span key={tag} className="brutalist-badge bg-muted text-[10px]">{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="fill-primary text-primary" />
                      <span className="text-xs font-bold">{dest.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="brutalist-card p-8 text-center">
            <p className="text-muted-foreground">No destinations found</p>
            <p className="text-xs text-muted-foreground mt-1">Try a different search or category</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
