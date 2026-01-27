import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Clock, Star, Info } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
            "Temple closes 1 PM - 4 PM",
        ],
        dynasty: "Chola",
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
            "Carry water - can get hot",
            "Shore temple is a must-see at sunrise",
        ],
        dynasty: "Pallava",
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
            "Temple closes 1 PM - 4 PM",
        ],
        dynasty: "Pandya/Nayak",
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
            "Carry warm clothing",
        ],
        dynasty: "British Era",
    },
    {
        id: 5,
        name: "Gangaikonda Cholapuram",
        tamilName: "கங்கைகொண்ட சோழபுரம்",
        location: "Ariyalur",
        lat: 11.2067,
        lng: 79.4500,
        type: "unesco",
        circuit: "spiritual",
        rating: 4.7,
        timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
        tips: [
            "Part of Great Living Chola Temples",
            "Less crowded than Thanjavur",
            "Temple closes 12 PM - 4 PM",
        ],
        dynasty: "Chola",
    },
    {
        id: 6,
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
            "Agni Theertham at sunrise is divine",
        ],
        dynasty: "Various",
    },
    {
        id: 7,
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
            "Best during April-June",
            "Try the homemade chocolates",
        ],
        dynasty: "Natural",
    },
    {
        id: 8,
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
            "Try the beach-side snacks",
            "Don't swim - currents are strong",
        ],
        dynasty: "Natural",
    },
];

// Custom marker icons
const createCustomIcon = (type: string) => {
    const iconColors: Record<string, string> = {
        unesco: "#D4AF37", // Kanchipuram Gold
        spiritual: "#FF6B35",
        heritage: "#4A90D9",
        nature: "#2ECC71",
    };

    const color = iconColors[type] || iconColors.heritage;

    return L.divIcon({
        className: "custom-marker",
        html: `
      <div style="
        width: 32px;
        height: 32px;
        background: ${color};
        border: 2px solid #1a1a1a;
        border-radius: 7px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 3px 3px 0px 0px #1a1a1a;
        font-size: 16px;
      ">
        ${type === 'unesco' ? '🏛️' : type === 'spiritual' ? '🕌' : type === 'nature' ? '🌿' : '📍'}
      </div>
    `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });
};

// Center map on Tamil Nadu
const tamilNaduCenter: [number, number] = [11.1271, 78.6569];
const defaultZoom = 7;

interface TripAtlasProps {
    onBack: () => void;
}

// Component to handle map events
const MapController = () => {
    const map = useMap();

    useEffect(() => {
        // Fix for Leaflet tiles not loading properly
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }, [map]);

    return null;
};

export const TripAtlas = ({ onBack }: TripAtlasProps) => {
    return (
        <div className="min-h-full bg-background pb-24">
            <motion.header
                className="flex items-center gap-3 px-5 py-4 bg-card border-b-[1.5px] border-foreground z-50 relative"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <button onClick={onBack} className="brutalist-btn-secondary p-2">
                    <ArrowLeft size={20} strokeWidth={2.5} />
                </button>
                <div>
                    <h1 className="text-xl font-bold">Trip Atlas</h1>
                    <p className="text-xs text-muted-foreground font-tamil">பயண வரைபடம்</p>
                </div>
            </motion.header>

            {/* Legend */}
            <motion.div
                className="px-5 py-3 bg-card border-b-[1.5px] border-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex gap-4 text-xs overflow-x-auto">
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-[4px] bg-[#D4AF37] border border-foreground" />
                        <span>UNESCO Sites</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-[4px] bg-[#FF6B35] border border-foreground" />
                        <span>Temples</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-[4px] bg-[#2ECC71] border border-foreground" />
                        <span>Nature</span>
                    </div>
                </div>
            </motion.div>

            {/* Map Container */}
            <motion.div
                className="h-[calc(100vh-200px)] relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <MapContainer
                    center={tamilNaduCenter}
                    zoom={defaultZoom}
                    style={{ height: "100%", width: "100%" }}
                    zoomControl={false}
                >
                    <MapController />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {destinations.map((dest) => (
                        <Marker
                            key={dest.id}
                            position={[dest.lat, dest.lng]}
                            icon={createCustomIcon(dest.type)}
                        >
                            <Popup className="brutalist-popup">
                                <div className="min-w-[220px] p-1">
                                    {/* Header */}
                                    <div className="mb-2">
                                        <h3 className="font-bold text-sm">{dest.name}</h3>
                                        <p className="text-[10px] text-muted-foreground font-tamil">{dest.tamilName}</p>
                                    </div>

                                    {/* Info Row */}
                                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-2">
                                        <span className="flex items-center gap-1">
                                            <MapPin size={10} /> {dest.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Star size={10} className="text-primary fill-primary" /> {dest.rating}
                                        </span>
                                    </div>

                                    {/* Timings */}
                                    <div className="flex items-start gap-2 bg-muted/50 p-2 rounded-[5px] mb-2">
                                        <Clock size={12} className="mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-[10px] font-bold">Timings</p>
                                            <p className="text-[10px]">{dest.timings}</p>
                                        </div>
                                    </div>

                                    {/* Local Intelligence */}
                                    <div className="bg-foreground text-background p-2 rounded-[5px]">
                                        <p className="text-[10px] font-bold flex items-center gap-1 mb-1">
                                            <Info size={10} /> Local Intelligence
                                        </p>
                                        <ul className="text-[10px] space-y-0.5">
                                            {dest.tips.map((tip, i) => (
                                                <li key={i}>• {tip}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Dynasty Badge */}
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="text-[9px] px-2 py-0.5 bg-primary rounded-[4px] font-bold">
                                            {dest.dynasty}
                                        </span>
                                        <span className="text-[9px] px-2 py-0.5 bg-muted rounded-[4px] capitalize">
                                            {dest.circuit}
                                        </span>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
                className="px-5 py-3 bg-card border-t-[1.5px] border-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <div className="flex justify-around text-center">
                    <div>
                        <p className="text-lg font-bold">8</p>
                        <p className="text-[10px] text-muted-foreground">Destinations</p>
                    </div>
                    <div>
                        <p className="text-lg font-bold">3</p>
                        <p className="text-[10px] text-muted-foreground">UNESCO Sites</p>
                    </div>
                    <div>
                        <p className="text-lg font-bold">3</p>
                        <p className="text-[10px] text-muted-foreground">Circuits</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
