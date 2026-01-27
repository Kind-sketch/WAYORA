import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MobileContainerProps {
  children: ReactNode;
}

export const MobileContainer = ({ children }: MobileContainerProps) => {
  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <motion.div 
        className="mobile-container shadow-brutal-lg border-[1.5px] border-foreground rounded-[32px] overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  );
};
