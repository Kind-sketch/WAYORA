import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { getTipOfTheDay } from "@/lib/storageService";

export const CulturalTipCard = () => {
    const tip = getTipOfTheDay();

    return (
        <motion.section
            className="px-5 py-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
        >
            <motion.div
                className="brutalist-card p-4 bg-primary/20 border-primary"
                whileHover={{ x: -2, y: -2 }}
            >
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-[7px] bg-primary flex items-center justify-center flex-shrink-0">
                        <Lightbulb size={20} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-primary mb-1">Cultural Tip of the Day</p>
                        <p className="text-sm font-medium leading-snug">{tip.tip}</p>
                        <p className="text-xs text-muted-foreground font-tamil mt-1 leading-snug">{tip.tamilTip}</p>
                    </div>
                </div>
            </motion.div>
        </motion.section>
    );
};
