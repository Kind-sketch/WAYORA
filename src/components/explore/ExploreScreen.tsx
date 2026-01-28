import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, ChevronRight, Heart, Sparkles, Search } from "lucide-react";
import { toggleFavorite, isFavorite } from "@/lib/storageService";
import { useUserStats } from "@/hooks/useUserStats";
import { useToast } from "@/hooks/use-toast";
import { DestinationCardSkeleton } from "@/components/ui/Skeletons";

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
    image: "https://picsum.photos/seed/thanjavur/400/400",
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
    image: "https://picsum.photos/seed/ooty/400/400",
    tags: ["Nature", "Family"],
    featured: false,
    category: "hills",
  },
  {
    id: "3",
    name: "Mahabalipuram Shore Temple",
    tamilName: "மாமல்லபுரம் கடற்கரை கோயில்",
    location: "Chengalpattu",
    rating: 4.8,
    duration: "4-5 hours",
    image: "https://picsum.photos/seed/mahabalipuram/400/400",
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
    image: "https://picsum.photos/seed/marina/400/400",
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
    image: "https://picsum.photos/seed/meenakshi/400/400",
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
    image: "https://picsum.photos/seed/kodaikanal/400/400",
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
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const { addFavoriteXP } = useUserStats();
  const { toast } = useToast();

  useEffect(() => {
    // Initialize favorites
    const favs = destinations.reduce((acc, dest) => {
      acc[dest.id] = isFavorite(dest.id);
      return acc;
    }, {} as Record<string, boolean>);
    setFavorites(favs);

    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

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
      className="min-h-full bg-gradient-to-b from-background to-secondary pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="px-5 py-4 bg-card/80 backdrop-blur-xl border-b border-foreground/10 sticky top-0 z-40">
        <h1 className="text-2xl font-bold text-foreground">Explore</h1>
        <p className="text-xs text-primary font-tamil">தமிழ்நாட்டை ஆராயுங்கள்</p>
      </div>

      {/* Search */}
      <div className="px-5 py-4">
        <div className="glass-card flex items-center gap-3 px-4 py-3">
          <Search size={18} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search destinations..."
            className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground"
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
              className={`px-4 py-2.5 rounded-xl whitespace-nowrap text-sm font-medium transition-all duration-300 ${activeCategory === cat.id
                ? "gradient-primary text-foreground shadow-primary"
                : "bg-card border border-foreground/10 text-foreground hover:border-primary/30"
                }`}
              onClick={() => setActiveCategory(cat.id)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-1.5">{cat.emoji}</span>{cat.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* AI Suggestion Banner */}
      <motion.div
        className="mx-5 mb-4 glass-card p-4 cursor-pointer border-l-4 border-l-primary overflow-hidden relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onNavigate("planner")}
      >
        <div className="absolute top-0 right-0 w-32 h-32 gradient-primary opacity-10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center shadow-primary">
            <Sparkles size={20} className="text-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm text-foreground">AI-Powered Recommendations</p>
            <p className="text-xs text-muted-foreground">Get personalized routes based on your style</p>
          </div>
          <ChevronRight size={20} className="text-muted-foreground" />
        </div>
      </motion.div>

      {/* Destinations */}
      <div className="px-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">
            {activeCategory === "all" ? "Popular Destinations" : categories.find(c => c.id === activeCategory)?.label}
          </h2>
          <span className="text-xs text-muted-foreground">{filteredDestinations.length} places</span>
        </div>

        {isLoading ? (
          // Skeleton loading
          <>
            <DestinationCardSkeleton />
            <DestinationCardSkeleton />
            <DestinationCardSkeleton />
          </>
        ) : filteredDestinations.length > 0 ? (
          filteredDestinations.map((dest, index) => (
            <motion.div
              key={dest.id}
              className="glass-card overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ y: -2 }}
            >
              <div className="flex">
                <div className="w-28 h-28 relative overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {dest.featured && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-bold gradient-primary text-foreground">
                      FEATURED
                    </div>
                  )}
                </div>
                <div className="flex-1 p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-foreground truncate">{dest.name}</h3>
                      <p className="text-[10px] font-tamil text-muted-foreground truncate">{dest.tamilName}</p>
                    </div>
                    <motion.button
                      className={`p-2 rounded-xl transition-all ml-2 ${favorites[dest.id]
                        ? 'bg-accent/20 text-accent'
                        : 'bg-muted/50 text-muted-foreground hover:text-accent'
                        }`}
                      onClick={() => handleToggleFavorite(dest.id, dest.name)}
                      whileTap={{ scale: 0.85 }}
                    >
                      <Heart size={16} className={favorites[dest.id] ? 'fill-current' : ''} />
                    </motion.button>
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
                    <div className="flex gap-1.5">
                      {dest.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-md bg-secondary text-[10px] font-medium text-foreground/80">{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="fill-primary text-primary" />
                      <span className="text-xs font-bold text-foreground">{dest.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            className="glass-card p-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
              <Search size={24} className="text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium">No destinations found</p>
            <p className="text-xs text-muted-foreground mt-1">Try a different search or category</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
