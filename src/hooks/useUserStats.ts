import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
    UserStats,
    Badge,
    getUserStats,
    addXP,
    resetUserStats,
    calculateXPProgress,
    getRankForLevel,
    XP_REWARDS,
    createStorageListener,
} from '@/lib/storageService';

interface UseUserStatsReturn {
    stats: UserStats;
    xpProgress: { current: number; needed: number; percent: number };
    rankInfo: { name: string; tamilName: string };
    unlockedBadges: Badge[];
    lockedBadges: Badge[];
    addXP: (amount: number, reason?: string) => void;
    addExpenseXP: () => void;
    addRouteXP: () => void;
    addScanXP: () => void;
    addTripXP: () => void;
    addFavoriteXP: () => void;
    resetStats: () => void;
    refresh: () => void;
}

export const useUserStats = (): UseUserStatsReturn => {
    const [stats, setStats] = useState<UserStats>(getUserStats);
    const { toast } = useToast();

    // Refresh stats from storage
    const refresh = useCallback(() => {
        setStats(getUserStats());
    }, []);

    // Listen for storage changes (cross-tab sync)
    useEffect(() => {
        const cleanup = createStorageListener(refresh);
        return cleanup;
    }, [refresh]);

    // Add XP with toast notification
    const handleAddXP = useCallback((amount: number, reason?: string) => {
        const result = addXP(amount);
        setStats(getUserStats());

        // Show XP toast
        toast({
            title: `+${amount} XP`,
            description: reason || 'Experience gained!',
            duration: 2000,
        });

        // Show level up toast
        if (result.leveledUp) {
            const newStats = getUserStats();
            toast({
                title: '🎉 Level Up!',
                description: `You reached Level ${newStats.level} - ${newStats.rank}`,
                duration: 4000,
            });
        }

        // Show badge unlock toasts
        result.newBadges.forEach(badge => {
            setTimeout(() => {
                toast({
                    title: `🏆 Badge Unlocked!`,
                    description: `${badge.icon} ${badge.name} - ${badge.description}`,
                    duration: 5000,
                });
            }, 500);
        });
    }, [toast]);

    // Convenience methods for common XP actions
    const addExpenseXP = useCallback(() => {
        handleAddXP(XP_REWARDS.ADD_EXPENSE, 'Expense tracked');
    }, [handleAddXP]);

    const addRouteXP = useCallback(() => {
        handleAddXP(XP_REWARDS.GENERATE_ROUTE, 'Route generated');
    }, [handleAddXP]);

    const addScanXP = useCallback(() => {
        handleAddXP(XP_REWARDS.SCAN_RECEIPT, 'Receipt scanned');
    }, [handleAddXP]);

    const addTripXP = useCallback(() => {
        handleAddXP(XP_REWARDS.SAVE_TRIP, 'Trip saved');
    }, [handleAddXP]);

    const addFavoriteXP = useCallback(() => {
        handleAddXP(XP_REWARDS.FAVORITE_DESTINATION, 'Destination favorited');
    }, [handleAddXP]);

    const handleReset = useCallback(() => {
        resetUserStats();
        setStats(getUserStats());
        toast({
            title: 'Stats Reset',
            description: 'Your progress has been reset',
            duration: 2000,
        });
    }, [toast]);

    // Computed values
    const xpProgress = calculateXPProgress(stats.xp);
    const rankInfo = getRankForLevel(stats.level);
    const unlockedBadges = stats.badges.filter(b => b.unlockedAt !== null);
    const lockedBadges = stats.badges.filter(b => b.unlockedAt === null);

    return {
        stats,
        xpProgress,
        rankInfo,
        unlockedBadges,
        lockedBadges,
        addXP: handleAddXP,
        addExpenseXP,
        addRouteXP,
        addScanXP,
        addTripXP,
        addFavoriteXP,
        resetStats: handleReset,
        refresh,
    };
};
