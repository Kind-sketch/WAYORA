import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Train, Bus, Hotel, Plane, ExternalLink, Clock, MapPin, Star } from "lucide-react";

interface BookingService {
    id: string;
    name: string;
    description: string;
    icon: typeof Train;
    color: string;
    url: string;
    popular: boolean;
}

const bookingServices: BookingService[] = [
    {
        id: "irctc",
        name: "IRCTC Rail",
        description: "Book train tickets across India",
        icon: Train,
        color: "bg-blue-500",
        url: "https://www.irctc.co.in/",
        popular: true,
    },
    {
        id: "redbus",
        name: "RedBus",
        description: "Bus tickets for Tamil Nadu routes",
        icon: Bus,
        color: "bg-red-500",
        url: "https://www.redbus.in/",
        popular: true,
    },
    {
        id: "oyo",
        name: "OYO Rooms",
        description: "Budget hotels and stays",
        icon: Hotel,
        color: "bg-orange-500",
        url: "https://www.oyorooms.com/",
        popular: true,
    },
    {
        id: "makemytrip",
        name: "MakeMyTrip",
        description: "Flights, hotels, and packages",
        icon: Plane,
        color: "bg-primary",
        url: "https://www.makemytrip.com/",
        popular: false,
    },
    {
        id: "tnstc",
        name: "TNSTC",
        description: "Tamil Nadu State Transport",
        icon: Bus,
        color: "bg-green-600",
        url: "https://www.tnstc.in/",
        popular: false,
    },
    {
        id: "booking",
        name: "Booking.com",
        description: "International hotel bookings",
        icon: Hotel,
        color: "bg-blue-700",
        url: "https://www.booking.com/",
        popular: false,
    },
];

interface PopularRoute {
    from: string;
    to: string;
    duration: string;
    price: string;
    type: "train" | "bus";
}

const popularRoutes: PopularRoute[] = [
    { from: "Chennai", to: "Madurai", duration: "7-8 hrs", price: "₹350+", type: "train" },
    { from: "Chennai", to: "Thanjavur", duration: "5 hrs", price: "₹300+", type: "train" },
    { from: "Madurai", to: "Rameswaram", duration: "3 hrs", price: "₹150+", type: "bus" },
    { from: "Coimbatore", to: "Ooty", duration: "3 hrs", price: "₹150+", type: "bus" },
];

interface BookingScreenProps {
    onBack: () => void;
}

export const BookingScreen = ({ onBack }: BookingScreenProps) => {
    const [activeTab, setActiveTab] = useState<"services" | "routes">("services");

    const handleBookingClick = (service: BookingService) => {
        window.open(service.url, "_blank", "noopener,noreferrer");
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
                    <h1 className="text-xl font-bold text-foreground">Bookings</h1>
                    <p className="text-xs text-primary font-tamil">முன்பதிவுகள்</p>
                </div>
            </motion.header>

            {/* Tabs */}
            <div className="px-5 py-3">
                <div className="flex gap-2 p-1 bg-secondary rounded-xl">
                    <button
                        onClick={() => setActiveTab("services")}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === "services"
                                ? "bg-primary text-foreground shadow-sm"
                                : "text-muted-foreground"
                            }`}
                    >
                        Booking Services
                    </button>
                    <button
                        onClick={() => setActiveTab("routes")}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === "routes"
                                ? "bg-primary text-foreground shadow-sm"
                                : "text-muted-foreground"
                            }`}
                    >
                        Popular Routes
                    </button>
                </div>
            </div>

            {activeTab === "services" && (
                <motion.div
                    className="px-5 py-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Popular Services */}
                    <h2 className="text-sm font-bold text-muted-foreground mb-3">POPULAR SERVICES</h2>
                    <div className="grid grid-cols-1 gap-3 mb-6">
                        {bookingServices.filter(s => s.popular).map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <motion.button
                                    key={service.id}
                                    className="glass-card p-4 flex items-center gap-4 text-left hover:border-primary/50 transition-all"
                                    onClick={() => handleBookingClick(service)}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center`}>
                                        <Icon size={24} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-foreground">{service.name}</h3>
                                        <p className="text-xs text-muted-foreground">{service.description}</p>
                                    </div>
                                    <ExternalLink size={18} className="text-muted-foreground" />
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Other Services */}
                    <h2 className="text-sm font-bold text-muted-foreground mb-3">MORE OPTIONS</h2>
                    <div className="grid grid-cols-3 gap-3">
                        {bookingServices.filter(s => !s.popular).map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <motion.button
                                    key={service.id}
                                    className="glass-card p-3 flex flex-col items-center gap-2 text-center hover:border-primary/50 transition-all"
                                    onClick={() => handleBookingClick(service)}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className={`w-10 h-10 rounded-xl ${service.color} flex items-center justify-center`}>
                                        <Icon size={18} className="text-white" />
                                    </div>
                                    <span className="text-xs font-medium text-foreground">{service.name}</span>
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {activeTab === "routes" && (
                <motion.div
                    className="px-5 py-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2 className="text-sm font-bold text-muted-foreground mb-3">POPULAR TAMIL NADU ROUTES</h2>
                    <div className="space-y-3">
                        {popularRoutes.map((route, index) => (
                            <motion.div
                                key={`${route.from}-${route.to}`}
                                className="glass-card p-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} className="text-primary" />
                                        <span className="font-bold text-foreground">{route.from}</span>
                                        <span className="text-muted-foreground">→</span>
                                        <span className="font-bold text-foreground">{route.to}</span>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${route.type === "train" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                                        }`}>
                                        {route.type.toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} /> {route.duration}
                                        </span>
                                    </div>
                                    <span className="font-bold text-primary">{route.price}</span>
                                </div>
                                <button
                                    onClick={() => window.open(
                                        route.type === "train"
                                            ? `https://www.irctc.co.in/nget/train-search`
                                            : `https://www.redbus.in/bus-tickets/${route.from.toLowerCase()}-to-${route.to.toLowerCase()}`,
                                        "_blank"
                                    )}
                                    className="mt-3 w-full brutalist-btn-secondary py-2 rounded-lg text-xs font-bold"
                                >
                                    Search {route.type === "train" ? "Trains" : "Buses"}
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    {/* Quick Tip */}
                    <motion.div
                        className="mt-4 p-4 bg-primary/10 rounded-xl border border-primary/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="flex items-start gap-2">
                            <Star size={16} className="text-primary mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-foreground">Travel Tip</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Book train tickets 30-60 days in advance for confirmed seats.
                                    TNSTC buses are budget-friendly for inter-city travel.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};
