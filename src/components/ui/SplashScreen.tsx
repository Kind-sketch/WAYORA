import { motion } from "framer-motion";

export const SplashScreen = () => {
  return (
    <motion.div 
      className="fixed inset-0 bg-gradient-to-br from-background via-secondary to-background flex items-center justify-center z-[100]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        {/* Logo Animation */}
        <motion.div
          className="relative mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="w-24 h-24 mx-auto rounded-2xl bg-primary flex items-center justify-center shadow-primary">
            <motion.span 
              className="text-4xl"
              animate={{ 
                rotateY: [0, 360],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🧭
            </motion.span>
          </div>
          
          {/* Ripple Effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-primary"
            animate={{ 
              scale: [1, 1.5, 1.5],
              opacity: [0.5, 0, 0]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        </motion.div>

        {/* Brand Name */}
        <motion.h1 
          className="text-4xl font-bold text-foreground mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Wayora
        </motion.h1>
        
        <motion.p 
          className="text-lg font-tamil text-muted-foreground mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          வயோரா
        </motion.p>

        {/* Tagline */}
        <motion.p 
          className="text-sm text-muted-foreground max-w-[200px] mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Your AI-Powered Tamil Nadu Travel Companion
        </motion.p>

        {/* Loading Indicator */}
        <motion.div
          className="mt-8 flex justify-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};
