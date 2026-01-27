import { motion } from "framer-motion";
import { Trophy, Star, Zap, ArrowLeft, Lock } from "lucide-react";
import { useUserStats } from "@/hooks/useUserStats";
import { formatCurrency } from "@/lib/storageService";

interface ExploriaScreenProps {
  onBack: () => void;
}

export const ExploriaScreen = ({ onBack }: ExploriaScreenProps) => {
  const { stats, xpProgress, rankInfo, unlockedBadges, lockedBadges } = useUserStats();

  return (
    <div className="min-h-full bg-background pb-24">
      <motion.header
        className="bg-foreground text-background px-5 py-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="p-2 rounded-[7px] border-[1.5px] border-primary hover:bg-primary/20 transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Exploria</h1>
            <p className="text-xs font-tamil opacity-70">சாகச வேட்டை</p>
          </div>
          <div className="brutalist-card bg-primary text-foreground p-2 px-3">
            <div className="flex items-center gap-1">
              <Zap size={16} />
              <span className="font-bold">{stats.xp.toLocaleString()} XP</span>
            </div>
          </div>
        </div>

        {/* Level Card */}
        <motion.div
          className="brutalist-card bg-card text-foreground p-4"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-[7px] border-[1.5px] border-foreground bg-primary flex items-center justify-center">
              <Trophy size={32} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">Level {stats.level}</span>
                <span className="brutalist-badge bg-foreground text-background text-[10px]">
                  {rankInfo.name}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-2 font-tamil">
                நிலை {stats.level} - {rankInfo.tamilName}
              </p>
              <div className="brutalist-progress">
                <motion.div
                  className="brutalist-progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress.percent}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                {xpProgress.current.toLocaleString()} / {xpProgress.needed.toLocaleString()} XP to Level {stats.level + 1}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.header>

      <div className="p-5 space-y-6">
        {/* XP Rewards Info */}
        <motion.div
          className="brutalist-card p-4 bg-primary/20 border-primary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-bold text-sm mb-2">Earn XP</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="brutalist-badge bg-primary">+25</span>
              <span>Track Expense</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="brutalist-badge bg-primary">+50</span>
              <span>Scan Receipt</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="brutalist-badge bg-primary">+100</span>
              <span>Generate Route</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="brutalist-badge bg-primary">+75</span>
              <span>Save Trip</span>
            </div>
          </div>
        </motion.div>

        {/* Unlocked Badges */}
        {unlockedBadges.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-1">Unlocked Badges</h2>
            <p className="text-xs text-muted-foreground font-tamil mb-3">திறக்கப்பட்ட பேட்ஜ்கள்</p>

            <div className="grid grid-cols-4 gap-3">
              {unlockedBadges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  className="brutalist-card p-3 text-center bg-primary"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  title={badge.description}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <p className="text-[9px] font-bold mt-1 leading-tight">{badge.name}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Locked Badges (Progress) */}
        <section>
          <h2 className="text-lg font-bold mb-1">Badges to Unlock</h2>
          <p className="text-xs text-muted-foreground font-tamil mb-3">திறக்க வேண்டிய பேட்ஜ்கள்</p>

          <div className="space-y-3">
            {lockedBadges.slice(0, 5).map((badge, index) => {
              const progress = Math.min((stats.xp / badge.requiredXP) * 100, 100);

              return (
                <motion.div
                  key={badge.id}
                  className="brutalist-card p-4 opacity-80"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 0.8, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-[7px] border-[1.5px] border-foreground bg-muted flex items-center justify-center relative">
                      <span className="text-2xl grayscale opacity-50">{badge.icon}</span>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-foreground rounded-full flex items-center justify-center">
                        <Lock size={10} className="text-background" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{badge.name}</h3>
                      </div>
                      <p className="text-[10px] font-tamil text-muted-foreground">{badge.tamilName}</p>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold">
                          {stats.xp.toLocaleString()}/{badge.requiredXP.toLocaleString()} XP
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Stats Summary */}
        <section>
          <h2 className="text-lg font-bold mb-1">Your Journey</h2>
          <p className="text-xs text-muted-foreground font-tamil mb-3">உங்கள் பயணம்</p>

          <div className="grid grid-cols-3 gap-3">
            <motion.div
              className="brutalist-card p-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Zap className="mx-auto mb-2 text-primary" size={24} />
              <p className="text-xl font-bold">{stats.xp.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">Total XP</p>
            </motion.div>

            <motion.div
              className="brutalist-card p-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <Trophy className="mx-auto mb-2 text-primary" size={24} />
              <p className="text-xl font-bold">{stats.level}</p>
              <p className="text-[10px] text-muted-foreground">Level</p>
            </motion.div>

            <motion.div
              className="brutalist-card p-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Star className="mx-auto mb-2 text-primary" size={24} />
              <p className="text-xl font-bold">{unlockedBadges.length}</p>
              <p className="text-[10px] text-muted-foreground">Badges</p>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};
