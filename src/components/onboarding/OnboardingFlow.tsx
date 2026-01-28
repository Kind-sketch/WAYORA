import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, MapPin, Sparkles, Wallet, Trophy, Check } from "lucide-react";

interface OnboardingFlowProps {
    onComplete: () => void;
}

const slides = [
    {
        id: 1,
        icon: "🧭",
        title: "Welcome to Wayora",
        tamilTitle: "வயோராவுக்கு வரவேற்கிறோம்",
        description: "Your AI-powered travel companion for exploring the beauty of Tamil Nadu",
        color: "bg-primary",
    },
    {
        id: 2,
        icon: MapPin,
        title: "Discover Hidden Gems",
        tamilTitle: "மறைந்த அழகுகளை கண்டறியுங்கள்",
        description: "From UNESCO heritage sites to secret beaches, explore curated destinations with local intelligence",
        color: "bg-primary",
    },
    {
        id: 3,
        icon: Sparkles,
        title: "AI Route Planning",
        tamilTitle: "AI வழி திட்டமிடல்",
        description: "Get personalized itineraries based on your interests, budget, and travel style",
        color: "gradient-primary",
    },
    {
        id: 4,
        icon: Wallet,
        title: "Smart Budget Tracking",
        tamilTitle: "புத்திசாலி பட்ஜெட் கண்காணிப்பு",
        description: "Scan receipts, track expenses, and stay within your travel budget effortlessly",
        color: "bg-accent",
    },
    {
        id: 5,
        icon: Trophy,
        title: "Earn & Explore",
        tamilTitle: "சம்பாதித்து ஆராயுங்கள்",
        description: "Collect XP, unlock badges, and level up as you discover new places",
        color: "bg-foreground",
    },
];

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            // Mark onboarding as complete
            localStorage.setItem("wayora_onboarding_done", "true");
            onComplete();
        }
    };

    const handleSkip = () => {
        localStorage.setItem("wayora_onboarding_done", "true");
        onComplete();
    };

    const slide = slides[currentSlide];
    const isLastSlide = currentSlide === slides.length - 1;
    const IconComponent = typeof slide.icon === "string" ? null : slide.icon;

    return (
        <motion.div
            className="fixed inset-0 bg-background z-[90] flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Skip Button */}
            {!isLastSlide && (
                <motion.button
                    className="absolute top-6 right-6 text-sm text-muted-foreground hover:text-foreground transition-colors z-10"
                    onClick={handleSkip}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Skip
                </motion.button>
            )}

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={slide.id}
                        className="text-center"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Icon */}
                        <motion.div
                            className={`w-28 h-28 mx-auto rounded-3xl ${slide.color} flex items-center justify-center mb-8 shadow-primary`}
                            initial={{ scale: 0.8, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.1, type: "spring" }}
                        >
                            {IconComponent ? (
                                <IconComponent size={48} className={slide.color === "bg-foreground" ? "text-background" : "text-foreground"} strokeWidth={2} />
                            ) : (
                                <span className="text-5xl">{slide.icon}</span>
                            )}
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            className="text-2xl font-bold text-foreground mb-2"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {slide.title}
                        </motion.h1>

                        {/* Tamil Title */}
                        <motion.p
                            className="text-lg font-tamil text-primary mb-6"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.25 }}
                        >
                            {slide.tamilTitle}
                        </motion.p>

                        {/* Description */}
                        <motion.p
                            className="text-muted-foreground max-w-[280px] mx-auto leading-relaxed"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {slide.description}
                        </motion.p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-8 pb-12">
                {/* Progress Dots */}
                <div className="flex justify-center gap-2 mb-8">
                    {slides.map((_, index) => (
                        <motion.div
                            key={index}
                            className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                                    ? "w-8 bg-primary"
                                    : index < currentSlide
                                        ? "w-2 bg-primary/50"
                                        : "w-2 bg-muted"
                                }`}
                            animate={{ scale: index === currentSlide ? 1.1 : 1 }}
                        />
                    ))}
                </div>

                {/* CTA Button */}
                <motion.button
                    className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${isLastSlide
                            ? "bg-primary text-primary-foreground shadow-primary"
                            : "brutalist-btn-dark"
                        }`}
                    onClick={handleNext}
                    whileTap={{ scale: 0.98 }}
                >
                    {isLastSlide ? (
                        <>
                            <Check size={20} /> Get Started
                        </>
                    ) : (
                        <>
                            Next <ChevronRight size={20} />
                        </>
                    )}
                </motion.button>
            </div>
        </motion.div>
    );
};
