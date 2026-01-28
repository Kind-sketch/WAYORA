import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Clock, Star, Info, Navigation, ChevronRight, ExternalLink } from "lucide-react";

// UNESCO World Heritage Sites and major destinations in Tamil Nadu
const destinations = [
    {
        id: 1,
        name: "Brihadeeswarar Temple",
        tamilName: "பெருவுடையார் கோயில்",
        location: "Thanjavur",
        lat: 10.7825,
        lng: 79.1318,
        type: "unesco",
        circuit: "spiritual",
        rating: 4.9,
        timings: "6:00 AM - 12:30 PM, 4:00 PM - 8:30 PM",
        tips: [
            "Wear traditional attire for entry",
            "Photography allowed in outer areas only",
        ],
        dynasty: "Chola",
        image: "https://picsum.photos/seed/temple1/200/150",
    },
    {
        id: 2,
        name: "Mahabalipuram Monuments",
        tamilName: "மாமல்லபுரம் சிற்பங்கள்",
        location: "Mahabalipuram",
        lat: 12.6172,
        lng: 80.1927,
        type: "unesco",
        circuit: "heritage",
        rating: 4.8,
        timings: "6:00 AM - 6:00 PM",
        tips: [
            "Best visited early morning for photos",
            "Shore temple is a must-see at sunrise",
        ],
        dynasty: "Pallava",
        image: "https://picsum.photos/seed/mahabalipuram/200/150",
    },
    {
        id: 3,
        name: "Meenakshi Temple",
        tamilName: "மீனாட்சி கோயில்",
        location: "Madurai",
        lat: 9.9195,
        lng: 78.1193,
        type: "spiritual",
        circuit: "spiritual",
        rating: 4.9,
        timings: "5:00 AM - 12:30 PM, 4:00 PM - 10:00 PM",
        tips: [
            "Evening ceremony at 9 PM is spectacular",
            "Hire a guide for detailed history",
        ],
        dynasty: "Pandya/Nayak",
        image: "https://picsum.photos/seed/meenakshi/200/150",
    },
    {
        id: 4,
        name: "Nilgiri Mountain Railway",
        tamilName: "நீலகிரி மலை ரயில்",
        location: "Ooty",
        lat: 11.4102,
        lng: 76.6950,
        type: "unesco",
        circuit: "nature",
        rating: 4.8,
        timings: "Trains: 7:10 AM, 9:15 AM",
        tips: [
            "Book tickets 30 days in advance",
            "Sit on the right side for best views",
        ],
        dynasty: "British Era",
        image: "https://picsum.photos/seed/nilgiri/200/150",
    },
    {
        id: 5,
        name: "Rameswaram Temple",
        tamilName: "ராமேஸ்வரம் கோயில்",
        location: "Rameswaram",
        lat: 9.2885,
        lng: 79.3129,
        type: "spiritual",
        circuit: "spiritual",
        rating: 4.9,
        timings: "5:00 AM - 1:00 PM, 3:00 PM - 9:00 PM",
        tips: [
            "22 Theerthams bath starts 4:30 AM",
            "Wear dhoti/saree for temple entry",
        ],
        dynasty: "Various",
        image: "https://picsum.photos/seed/rameswaram/200/150",
    },
    {
        id: 6,
        name: "Kodaikanal Lake",
        tamilName: "கொடைக்கானல் ஏரி",
        location: "Kodaikanal",
        lat: 10.2381,
        lng: 77.4892,
        type: "nature",
        circuit: "nature",
        rating: 4.6,
        timings: "6:00 AM - 6:00 PM",
        tips: [
            "Boat rides available",
            "Try the homemade chocolates",
        ],
        dynasty: "Natural",
        image: "https://picsum.photos/seed/kodaikanal/200/150",
    },
    {
        id: 7,
        name: "Marina Beach",
        tamilName: "மெரினா கடற்கரை",
        location: "Chennai",
        lat: 13.0499,
        lng: 80.2824,
        type: "nature",
        circuit: "nature",
        rating: 4.5,
        timings: "Open 24 hours",
        tips: [
            "Best at sunrise and sunset",
            "Don't swim - currents are strong",
        ],
        dynasty: "Natural",
        image: "https://picsum.photos/seed/marina/200/150",
    },
];

interface TripAtlasProps {
    onBack: () => void;
}

type DestinationType = typeof destinations[0];

export const TripAtlas = ({ onBack }: TripAtlasProps) => {
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [selectedDest, setSelectedDest] = useState<DestinationType | null>(null);

    const filteredDestinations = activeFilter
        ? destinations.filter((d) => d.type === activeFilter)
        : destinations;

    const filters = [
        { id: null, label: "All", color: "#2DD4BF" },
        { id: "unesco", label: "UNESCO", color: "#2DD4BF" },
        { id: "spiritual", label: "Temples", color: "#F0826C" },
        { id: "nature", label: "Nature", color: "#22C55E" },
    ];

    const getTypeColor = (type: string) => {
        switch (type) {
            case "unesco": return "#2DD4BF";
            case "spiritual": return "#F0826C";
            case "nature": return "#22C55E";
            default: return "#4A90D9";
        }
    };

    const openInMaps = (dest: DestinationType) => {
        window.open(`https://www.google.com/maps/search/?api=1&query=${dest.lat},${dest.lng}`, '_blank');
    };

    return (
        <div className="min-h-full bg-background pb-24">
            {/* Header */}
            <motion.header
                className="flex items-center gap-3 px-5 py-4 bg-card/80 backdrop-blur-xl border-b border-foreground/10 sticky top-0 z-50"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <button onClick={onBack} className="brutalist-btn-secondary p-2.5 rounded-xl">
                    <ArrowLeft size={20} strokeWidth={2} />
                </button>
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-foreground">Trip Atlas</h1>
                    <p className="text-xs text-primary font-tamil">பயண வரைபடம்</p>
                </div>
                <div className="brutalist-btn-secondary px-3 py-2 rounded-xl flex items-center gap-1.5">
                    <Navigation size={14} className="text-primary" />
                    <span className="text-xs font-bold">{filteredDestinations.length}</span>
                </div>
            </motion.header>

            {/* Filter Pills */}
            <motion.div
                className="px-5 py-3 bg-card/50 border-b border-foreground/5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {filters.map((filter) => (
                        <button
                            key={filter.id ?? "all"}
                            onClick={() => setActiveFilter(filter.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${activeFilter === filter.id
                                ? "text-foreground shadow-sm"
                                : "bg-secondary text-foreground/70 hover:bg-muted"
                                }`}
                            style={{
                                background: activeFilter === filter.id ? filter.color : undefined,
                            }}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Map Preview */}
            <motion.div
                className="mx-5 mt-4 rounded-xl overflow-hidden border border-foreground/10 shadow-soft"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
            >
                <iframe
                    src="https://www.openstreetmap.org/export/embed.html?bbox=76.0,8.0,81.0,14.0&layer=mapnik"
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    title="Tamil Nadu Map"
                    loading="lazy"
                />
                <div className="bg-card p-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Tamil Nadu, India</span>
                    <a
                        href="https://www.openstreetmap.org/#map=7/11.1/78.6"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary flex items-center gap-1"
                    >
                        Open full map <ExternalLink size={12} />
                    </a>
                </div>
            </motion.div>

            {/* Destinations List */}
            <div className="px-5 py-4">
                <h2 className="text-lg font-bold text-foreground mb-3">Destinations</h2>
                <div className="space-y-3">
                    {filteredDestinations.map((dest, index) => (
                        <motion.div
                            key={dest.id}
                            className="glass-card overflow-hidden cursor-pointer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                            onClick={() => setSelectedDest(selectedDest?.id === dest.id ? null : dest)}
                        >
                            <div className="flex">
                                <div className="relative w-24 h-24 flex-shrink-0">
                                    <img
                                        src={dest.image}
                                        alt={dest.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    <div
                                        className="absolute top-2 left-2 w-3 h-3 rounded-full border-2 border-white"
                                        style={{ backgroundColor: getTypeColor(dest.type) }}
                                    />
                                </div>
                                <div className="flex-1 p-3 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-sm text-foreground truncate">{dest.name}</h3>
                                            <p className="text-[10px] font-tamil text-muted-foreground truncate">{dest.tamilName}</p>
                                        </div>
                                        <ChevronRight
                                            size={16}
                                            className={`text-muted-foreground transition-transform flex-shrink-0 ml-2 ${selectedDest?.id === dest.id ? 'rotate-90' : ''
                                                }`}
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <MapPin size={10} /> {dest.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Star size={10} className="text-primary fill-primary" /> {dest.rating}
                                        </span>
                                    </div>
                                    <div className="flex gap-1.5 mt-2">
                                        <span
                                            className="px-2 py-0.5 rounded text-[9px] font-bold text-foreground"
                                            style={{ backgroundColor: `${getTypeColor(dest.type)}40` }}
                                        >
                                            {dest.dynasty}
                                        </span>
                                        <span className="px-2 py-0.5 rounded text-[9px] bg-secondary text-foreground/70 capitalize">
                                            {dest.circuit}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {selectedDest?.id === dest.id && (
                                <motion.div
                                    className="p-3 bg-secondary/50 border-t border-foreground/5"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                >
                                    {/* Timings */}
                                    <div className="flex items-start gap-2 mb-3">
                                        <Clock size={14} className="text-primary mt-0.5" />
                                        <div>
                                            <p className="text-xs font-bold text-foreground">Timings</p>
                                            <p className="text-[11px] text-muted-foreground">{dest.timings}</p>
                                        </div>
                                    </div>

                                    {/* Tips */}
                                    <div className="flex items-start gap-2 mb-3">
                                        <Info size={14} className="text-primary mt-0.5" />
                                        <div>
                                            <p className="text-xs font-bold text-foreground">Local Tips</p>
                                            <ul className="text-[11px] text-muted-foreground space-y-0.5">
                                                {dest.tips.map((tip, i) => (
                                                    <li key={i}>• {tip}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Open in Maps Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openInMaps(dest);
                                        }}
                                        className="w-full brutalist-btn-primary py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2"
                                    >
                                        <Navigation size={14} />
                                        Open in Google Maps
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Quick Stats */}
            <motion.div
                className="mx-5 mb-4 glass-card p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-foreground">{filteredDestinations.length}</p>
                        <p className="text-[10px] text-muted-foreground">Places</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-primary">4</p>
                        <p className="text-[10px] text-muted-foreground">UNESCO</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-foreground">3</p>
                        <p className="text-[10px] text-muted-foreground">Circuits</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
