import { motion } from "framer-motion";
import { Lightbulb, ChevronRight } from "lucide-react";
import { getTipOfTheDay } from "@/lib/storageService";

export const CulturalTipCard = () => {
    const tip = getTipOfTheDay();

    return (
        <motion.section
            className="px-5 py-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
        >
            <motion.div
                className="glass-card p-4 border-l-4 border-l-primary"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
            >
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-primary">
                        <Lightbulb size={18} strokeWidth={2} className="text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-primary uppercase tracking-wide">Cultural Tip</span>
                            <span className="text-[10px] text-muted-foreground">• Daily</span>
                        </div>
                        <p className="text-sm font-medium text-foreground leading-relaxed">{tip.tip}</p>
                        <p className="text-xs text-muted-foreground font-tamil mt-1.5 leading-relaxed">{tip.tamilTip}</p>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground flex-shrink-0 mt-2" />
                </div>
            </motion.div>
        </motion.section>
    );
};
