import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Phone, Shield, AlertTriangle, MapPin, Share2, Ambulance, Flame, Users, Car, HelpCircle, X, ExternalLink } from "lucide-react";

interface EmergencyContact {
    id: string;
    name: string;
    tamilName: string;
    number: string;
    icon: typeof Phone;
    color: string;
    description: string;
}

const emergencyContacts: EmergencyContact[] = [
    {
        id: "police",
        name: "Police",
        tamilName: "காவல்துறை",
        number: "100",
        icon: Shield,
        color: "bg-blue-600",
        description: "Emergency police assistance",
    },
    {
        id: "ambulance",
        name: "Ambulance",
        tamilName: "அம்புலன்ஸ்",
        number: "108",
        icon: Ambulance,
        color: "bg-red-600",
        description: "Medical emergency services",
    },
    {
        id: "fire",
        name: "Fire Brigade",
        tamilName: "தீயணைப்பு",
        number: "101",
        icon: Flame,
        color: "bg-orange-600",
        description: "Fire emergency services",
    },
    {
        id: "women",
        name: "Women Helpline",
        tamilName: "பெண்கள் உதவி",
        number: "181",
        icon: Users,
        color: "bg-pink-600",
        description: "Women safety helpline",
    },
    {
        id: "tourist",
        name: "Tourist Helpline",
        tamilName: "சுற்றுலா உதவி",
        number: "1363",
        icon: HelpCircle,
        color: "bg-primary",
        description: "24x7 tourist assistance",
    },
    {
        id: "highway",
        name: "Highway Patrol",
        tamilName: "நெடுஞ்சாலை உதவி",
        number: "1073",
        icon: Car,
        color: "bg-green-600",
        description: "Road accident assistance",
    },
];

interface Hospital {
    name: string;
    location: string;
    phone: string;
    distance?: string;
}

const nearbyHospitals: Hospital[] = [
    { name: "Apollo Hospitals", location: "Chennai", phone: "044-28290200", distance: "Based on location" },
    { name: "MIOT Hospital", location: "Chennai", phone: "044-42002288", distance: "Based on location" },
    { name: "Meenakshi Mission Hospital", location: "Madurai", phone: "0452-4882345", distance: "Based on location" },
    { name: "Kovai Medical Center", location: "Coimbatore", phone: "0422-4323800", distance: "Based on location" },
];

interface EmergencyScreenProps {
    onBack: () => void;
}

export const EmergencyScreen = ({ onBack }: EmergencyScreenProps) => {
    const [showSOSModal, setShowSOSModal] = useState(false);
    const [isSharing, setIsSharing] = useState(false);

    const handleCall = (number: string) => {
        window.open(`tel:${number}`, "_self");
    };

    const handleShareLocation = async () => {
        setIsSharing(true);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
                    const message = `🆘 EMERGENCY! I need help!\n\nMy current location:\n${locationUrl}\n\nSent from Wayora Travel App`;

                    if (navigator.share) {
                        try {
                            await navigator.share({
                                title: "Emergency - Share Location",
                                text: message,
                                url: locationUrl,
                            });
                        } catch {
                            // User cancelled or error
                            navigator.clipboard.writeText(message);
                            alert("Location copied to clipboard!");
                        }
                    } else {
                        navigator.clipboard.writeText(message);
                        alert("Location copied to clipboard! Share it with your emergency contacts.");
                    }
                    setIsSharing(false);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    alert("Unable to get location. Please enable location services.");
                    setIsSharing(false);
                }
            );
        } else {
            alert("Geolocation not supported by your browser.");
            setIsSharing(false);
        }
    };

    return (
        <div className="min-h-full bg-background pb-24">
            {/* Header */}
            <motion.header
                className="flex items-center gap-3 px-5 py-4 bg-destructive text-white border-b border-destructive/50 sticky top-0 z-50"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <button onClick={onBack} className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                    <ArrowLeft size={20} strokeWidth={2} />
                </button>
                <div className="flex-1">
                    <h1 className="text-xl font-bold">Emergency</h1>
                    <p className="text-xs font-tamil opacity-80">அவசர உதவி</p>
                </div>
                <AlertTriangle size={24} />
            </motion.header>

            {/* SOS Button */}
            <motion.section
                className="px-5 py-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <motion.button
                    className="w-full py-6 bg-destructive hover:bg-destructive/90 rounded-2xl flex flex-col items-center gap-2 shadow-lg"
                    onClick={() => setShowSOSModal(true)}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                        <AlertTriangle size={32} className="text-destructive" />
                    </div>
                    <span className="text-white text-xl font-bold">SOS Emergency</span>
                    <span className="text-white/70 text-xs">Tap for immediate help</span>
                </motion.button>
            </motion.section>

            {/* Share Location */}
            <motion.section
                className="px-5 py-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <button
                    onClick={handleShareLocation}
                    disabled={isSharing}
                    className="w-full glass-card p-4 flex items-center gap-4 hover:border-primary/50 transition-all"
                >
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                        {isSharing ? (
                            <motion.div
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            />
                        ) : (
                            <Share2 size={20} className="text-foreground" />
                        )}
                    </div>
                    <div className="flex-1 text-left">
                        <h3 className="font-bold text-foreground">Share My Location</h3>
                        <p className="text-xs text-muted-foreground">Send your GPS location to emergency contacts</p>
                    </div>
                    <MapPin size={18} className="text-muted-foreground" />
                </button>
            </motion.section>

            {/* Emergency Numbers */}
            <motion.section
                className="px-5 py-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
            >
                <h2 className="text-sm font-bold text-muted-foreground mb-3">EMERGENCY NUMBERS</h2>
                <div className="grid grid-cols-2 gap-3">
                    {emergencyContacts.map((contact, index) => {
                        const Icon = contact.icon;
                        return (
                            <motion.button
                                key={contact.id}
                                className="glass-card p-4 text-left hover:border-primary/50 transition-all"
                                onClick={() => handleCall(contact.number)}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`w-10 h-10 rounded-xl ${contact.color} flex items-center justify-center`}>
                                        <Icon size={18} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-foreground text-sm">{contact.name}</p>
                                        <p className="text-[10px] text-muted-foreground font-tamil">{contact.tamilName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">{contact.description}</span>
                                    <span className="text-lg font-bold text-primary">{contact.number}</span>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </motion.section>

            {/* Nearby Hospitals */}
            <motion.section
                className="px-5 py-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <h2 className="text-sm font-bold text-muted-foreground mb-3">MAJOR HOSPITALS</h2>
                <div className="space-y-2">
                    {nearbyHospitals.map((hospital, index) => (
                        <motion.div
                            key={hospital.name}
                            className="glass-card p-3 flex items-center gap-3"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.35 + index * 0.05 }}
                        >
                            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                                <Ambulance size={18} className="text-red-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-foreground truncate">{hospital.name}</p>
                                <p className="text-xs text-muted-foreground">{hospital.location}</p>
                            </div>
                            <button
                                onClick={() => handleCall(hospital.phone)}
                                className="px-3 py-1.5 bg-destructive/10 hover:bg-destructive/20 rounded-lg transition-colors"
                            >
                                <Phone size={14} className="text-destructive" />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Safety Tips */}
            <motion.section
                className="px-5 py-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700">
                    <div className="flex items-start gap-2">
                        <AlertTriangle size={18} className="text-yellow-600 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-yellow-800 dark:text-yellow-200">Safety Tips</p>
                            <ul className="text-xs text-yellow-700 dark:text-yellow-300 mt-1 space-y-1">
                                <li>• Keep your phone charged at all times</li>
                                <li>• Save emergency contacts offline</li>
                                <li>• Share live location with family while traveling</li>
                                <li>• Keep a printed copy of important documents</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* SOS Modal */}
            <AnimatePresence>
                {showSOSModal && (
                    <motion.div
                        className="fixed inset-0 bg-foreground/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowSOSModal(false)}
                    >
                        <motion.div
                            className="w-full max-w-sm bg-card rounded-2xl p-6"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-foreground">Quick Emergency Access</h3>
                                <button onClick={() => setShowSOSModal(false)} className="p-2 hover:bg-muted rounded-lg">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => handleCall("100")}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                                >
                                    <Shield size={20} />
                                    Call Police (100)
                                </button>
                                <button
                                    onClick={() => handleCall("108")}
                                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                                >
                                    <Ambulance size={20} />
                                    Call Ambulance (108)
                                </button>
                                <button
                                    onClick={() => handleCall("1363")}
                                    className="w-full py-4 bg-primary hover:opacity-90 text-foreground rounded-xl font-bold flex items-center justify-center gap-2"
                                >
                                    <HelpCircle size={20} />
                                    Tourist Helpline (1363)
                                </button>
                                <button
                                    onClick={handleShareLocation}
                                    className="w-full py-4 brutalist-btn-secondary rounded-xl font-bold flex items-center justify-center gap-2"
                                >
                                    <Share2 size={20} />
                                    Share My Location
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
