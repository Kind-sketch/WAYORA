/**
 * Wayora Storage Service
 * LocalStorage-based persistence layer for the Tamil Nadu Travel Companion
 */

// ============================================================================
// TYPES
// ============================================================================

export interface UserStats {
    xp: number;
    level: number;
    rank: string;
    badges: Badge[];
    createdAt: string;
    lastUpdated: string;
}

export interface Badge {
    id: string;
    name: string;
    tamilName: string;
    description: string;
    icon: string;
    unlockedAt: string | null;
    requiredXP: number;
}

export interface Expense {
    id: string;
    category: 'food' | 'transport' | 'stay' | 'shopping' | 'tickets' | 'other';
    amount: number;
    description: string;
    date: string;
    location?: string;
}

export interface TripStop {
    name: string;
    tamilName?: string;
    day: number;
    duration: string;
    highlight: boolean;
    tips: string[];
    coordinates?: { lat: number; lng: number };
}

export interface SavedTrip {
    id: string;
    name: string;
    tamilName: string;
    source: string;
    destination: string;
    circuit: 'spiritual' | 'heritage' | 'nature';
    budget: number;
    stops: TripStop[];
    localIntelligence: string[];
    createdAt: string;
    isActive: boolean;
}

export interface CulturalTip {
    id: string;
    tip: string;
    tamilTip: string;
    category: 'temple' | 'general' | 'food' | 'transport';
}

export interface Notification {
    id: string;
    type: 'trip' | 'deal' | 'weather' | 'xp' | 'tip' | 'system';
    title: string;
    message: string;
    read: boolean;
    timestamp: string;
}

// ============================================================================
// STORAGE KEYS
// ============================================================================

const STORAGE_KEYS = {
    USER_STATS: 'wayora_user_stats',
    EXPENSES: 'wayora_expenses',
    SAVED_TRIPS: 'wayora_saved_trips',
    FAVORITES: 'wayora_favorites',
    SETTINGS: 'wayora_settings',
} as const;

// ============================================================================
// BADGES CONFIGURATION
// ============================================================================

export const AVAILABLE_BADGES: Badge[] = [
    {
        id: 'first_steps',
        name: 'First Steps',
        tamilName: 'முதல் அடிகள்',
        description: 'Started your Wayora journey',
        icon: '🚶',
        unlockedAt: null,
        requiredXP: 0,
    },
    {
        id: 'budget_tracker',
        name: 'Budget Tracker',
        tamilName: 'பட்ஜெட் கண்காணிப்பாளர்',
        description: 'Tracked 10 expenses',
        icon: '💰',
        unlockedAt: null,
        requiredXP: 250,
    },
    {
        id: 'gopuram_gallivant',
        name: 'Gopuram Gallivant',
        tamilName: 'கோபுர சுற்றுலா',
        description: 'Generated 5 spiritual routes',
        icon: '🕌',
        unlockedAt: null,
        requiredXP: 500,
    },
    {
        id: 'hill_station_hero',
        name: 'Hill Station Hero',
        tamilName: 'மலை வீரர்',
        description: 'Explored nature circuits',
        icon: '⛰️',
        unlockedAt: null,
        requiredXP: 750,
    },
    {
        id: 'heritage_hunter',
        name: 'Heritage Hunter',
        tamilName: 'பாரம்பரிய வேட்டைக்காரர்',
        description: 'Discovered UNESCO heritage sites',
        icon: '🏛️',
        unlockedAt: null,
        requiredXP: 1000,
    },
    {
        id: 'wanderer',
        name: 'Wanderer',
        tamilName: 'சுற்றுலாவாளர்',
        description: 'Reached Level 5',
        icon: '🧭',
        unlockedAt: null,
        requiredXP: 2500,
    },
    {
        id: 'explorer',
        name: 'Explorer',
        tamilName: 'ஆய்வாளர்',
        description: 'Reached Level 10',
        icon: '🗺️',
        unlockedAt: null,
        requiredXP: 5000,
    },
    {
        id: 'tamil_traveler',
        name: 'Tamil Traveler',
        tamilName: 'தமிழ் பயணி',
        description: 'Saved 10 trips',
        icon: '🌟',
        unlockedAt: null,
        requiredXP: 7500,
    },
];

// ============================================================================
// RANKS CONFIGURATION
// ============================================================================

export const RANKS = [
    { minLevel: 1, name: 'Beginner', tamilName: 'தொடக்கநிலை' },
    { minLevel: 3, name: 'Traveler', tamilName: 'பயணி' },
    { minLevel: 5, name: 'Wanderer', tamilName: 'சுற்றுலாவாளர்' },
    { minLevel: 8, name: 'Explorer', tamilName: 'ஆய்வாளர்' },
    { minLevel: 12, name: 'Voyager', tamilName: 'பயணக்காரர்' },
    { minLevel: 15, name: 'Globetrotter', tamilName: 'உலக சுற்றி' },
    { minLevel: 20, name: 'Legend', tamilName: 'புராண நாயகன்' },
];

// ============================================================================
// XP CONFIGURATION
// ============================================================================

export const XP_REWARDS = {
    ADD_EXPENSE: 25,
    SCAN_RECEIPT: 50,
    GENERATE_ROUTE: 100,
    SAVE_TRIP: 75,
    FAVORITE_DESTINATION: 15,
    COMPLETE_TRIP: 500,
    DAILY_LOGIN: 10,
} as const;

export const XP_PER_LEVEL = 1000;

// ============================================================================
// CULTURAL TIPS
// ============================================================================

export const CULTURAL_TIPS: CulturalTip[] = [
    {
        id: '1',
        tip: 'Always remove footwear before entering temple premises.',
        tamilTip: 'கோயில் வளாகத்திற்குள் செல்லும் முன் காலணிகளை கழற்றவும்.',
        category: 'temple',
    },
    {
        id: '2',
        tip: 'Most temples close between 1 PM - 4 PM for afternoon break.',
        tamilTip: 'பெரும்பாலான கோயில்கள் மதியம் 1 - 4 மணி வரை மூடப்படும்.',
        category: 'temple',
    },
    {
        id: '3',
        tip: 'Dress modestly when visiting religious sites - cover shoulders and knees.',
        tamilTip: 'புனித தலங்களுக்குச் செல்லும்போது அடக்கமான உடை அணியவும்.',
        category: 'temple',
    },
    {
        id: '4',
        tip: 'Filter coffee is a must-try - ask for "degree coffee" for the authentic taste.',
        tamilTip: 'ஃபில்டர் காபி முயற்சிக்க வேண்டும் - "டிகிரி காபி" கேளுங்கள்.',
        category: 'food',
    },
    {
        id: '5',
        tip: 'Carry cash in smaller denominations - many local shops prefer it.',
        tamilTip: 'சிறிய நோட்டுகளில் பணம் வைத்திருங்கள் - உள்ளூர் கடைகள் விரும்புகின்றன.',
        category: 'general',
    },
    {
        id: '6',
        tip: 'Government buses (TNSTC) are reliable and budget-friendly for intercity travel.',
        tamilTip: 'அரசு பேருந்துகள் (TNSTC) நம்பகமானவை மற்றும் மலிவானவை.',
        category: 'transport',
    },
    {
        id: '7',
        tip: 'Start Darshan early morning (before 7 AM) to avoid crowds at popular temples.',
        tamilTip: 'கூட்டத்தைத் தவிர்க்க காலை 7 மணிக்கு முன் தரிசனம் தொடங்குங்கள்.',
        category: 'temple',
    },
    {
        id: '8',
        tip: 'Try local banana leaf meals (சாப்பாடு) for an authentic Tamil dining experience.',
        tamilTip: 'வாழை இலை சாப்பாடு முயற்சிக்கவும் - உண்மையான தமிழ் உணவு அனுபவம்.',
        category: 'food',
    },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const getFromStorage = <T>(key: string, defaultValue: T): T => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage [${key}]:`, error);
        return defaultValue;
    }
};

const saveToStorage = <T>(key: string, value: T): void => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving to localStorage [${key}]:`, error);
    }
};

// ============================================================================
// XP & LEVEL CALCULATIONS
// ============================================================================

export const calculateLevel = (xp: number): number => {
    return Math.floor(xp / XP_PER_LEVEL) + 1;
};

export const calculateXPProgress = (xp: number): { current: number; needed: number; percent: number } => {
    const currentLevelXP = xp % XP_PER_LEVEL;
    return {
        current: currentLevelXP,
        needed: XP_PER_LEVEL,
        percent: (currentLevelXP / XP_PER_LEVEL) * 100,
    };
};

export const getRankForLevel = (level: number): { name: string; tamilName: string } => {
    let rank = RANKS[0];
    for (const r of RANKS) {
        if (level >= r.minLevel) {
            rank = r;
        }
    }
    return { name: rank.name, tamilName: rank.tamilName };
};

// ============================================================================
// USER STATS OPERATIONS
// ============================================================================

const getDefaultUserStats = (): UserStats => {
    const now = new Date().toISOString();
    return {
        xp: 0,
        level: 1,
        rank: 'Beginner',
        badges: AVAILABLE_BADGES.map(b => ({ ...b })),
        createdAt: now,
        lastUpdated: now,
    };
};

export const getUserStats = (): UserStats => {
    const stats = getFromStorage<UserStats | null>(STORAGE_KEYS.USER_STATS, null);
    if (!stats) {
        const defaultStats = getDefaultUserStats();
        saveToStorage(STORAGE_KEYS.USER_STATS, defaultStats);
        return defaultStats;
    }
    return stats;
};

export const addXP = (amount: number): { newXP: number; leveledUp: boolean; newBadges: Badge[] } => {
    const stats = getUserStats();
    const oldLevel = stats.level;

    stats.xp += amount;
    stats.level = calculateLevel(stats.xp);
    stats.rank = getRankForLevel(stats.level).name;
    stats.lastUpdated = new Date().toISOString();

    // Check for newly unlocked badges
    const newBadges: Badge[] = [];
    stats.badges = stats.badges.map(badge => {
        if (!badge.unlockedAt && stats.xp >= badge.requiredXP) {
            const unlockedBadge = { ...badge, unlockedAt: new Date().toISOString() };
            newBadges.push(unlockedBadge);
            return unlockedBadge;
        }
        return badge;
    });

    saveToStorage(STORAGE_KEYS.USER_STATS, stats);

    return {
        newXP: stats.xp,
        leveledUp: stats.level > oldLevel,
        newBadges,
    };
};

export const resetUserStats = (): void => {
    saveToStorage(STORAGE_KEYS.USER_STATS, getDefaultUserStats());
};

// ============================================================================
// EXPENSES OPERATIONS
// ============================================================================

export const getExpenses = (): Expense[] => {
    return getFromStorage<Expense[]>(STORAGE_KEYS.EXPENSES, []);
};

export const addExpense = (expense: Omit<Expense, 'id'>): Expense => {
    const expenses = getExpenses();
    const newExpense: Expense = {
        ...expense,
        id: generateId(),
    };
    expenses.unshift(newExpense); // Add to beginning
    saveToStorage(STORAGE_KEYS.EXPENSES, expenses);
    return newExpense;
};

export const updateExpense = (id: string, updates: Partial<Expense>): Expense | null => {
    const expenses = getExpenses();
    const index = expenses.findIndex(e => e.id === id);
    if (index === -1) return null;

    expenses[index] = { ...expenses[index], ...updates };
    saveToStorage(STORAGE_KEYS.EXPENSES, expenses);
    return expenses[index];
};

export const deleteExpense = (id: string): boolean => {
    const expenses = getExpenses();
    const filtered = expenses.filter(e => e.id !== id);
    if (filtered.length === expenses.length) return false;

    saveToStorage(STORAGE_KEYS.EXPENSES, filtered);
    return true;
};

export const getExpenseSummary = (): { total: number; byCategory: Record<string, number> } => {
    const expenses = getExpenses();
    const byCategory: Record<string, number> = {};
    let total = 0;

    expenses.forEach(exp => {
        total += exp.amount;
        byCategory[exp.category] = (byCategory[exp.category] || 0) + exp.amount;
    });

    return { total, byCategory };
};

export const clearExpenses = (): void => {
    saveToStorage(STORAGE_KEYS.EXPENSES, []);
};

// ============================================================================
// SAVED TRIPS OPERATIONS
// ============================================================================

export const getSavedTrips = (): SavedTrip[] => {
    return getFromStorage<SavedTrip[]>(STORAGE_KEYS.SAVED_TRIPS, []);
};

export const saveTrip = (trip: Omit<SavedTrip, 'id' | 'createdAt'>): SavedTrip => {
    const trips = getSavedTrips();
    const newTrip: SavedTrip = {
        ...trip,
        id: generateId(),
        createdAt: new Date().toISOString(),
    };
    trips.unshift(newTrip);
    saveToStorage(STORAGE_KEYS.SAVED_TRIPS, trips);
    return newTrip;
};

export const getActiveTrip = (): SavedTrip | null => {
    const trips = getSavedTrips();
    return trips.find(t => t.isActive) || null;
};

export const setActiveTrip = (id: string): SavedTrip | null => {
    const trips = getSavedTrips();
    const updatedTrips = trips.map(trip => ({
        ...trip,
        isActive: trip.id === id,
    }));
    saveToStorage(STORAGE_KEYS.SAVED_TRIPS, updatedTrips);
    return updatedTrips.find(t => t.id === id) || null;
};

export const deleteTrip = (id: string): boolean => {
    const trips = getSavedTrips();
    const filtered = trips.filter(t => t.id !== id);
    if (filtered.length === trips.length) return false;

    saveToStorage(STORAGE_KEYS.SAVED_TRIPS, filtered);
    return true;
};

// ============================================================================
// FAVORITES OPERATIONS
// ============================================================================

export const getFavorites = (): string[] => {
    return getFromStorage<string[]>(STORAGE_KEYS.FAVORITES, []);
};

export const toggleFavorite = (destinationId: string): boolean => {
    const favorites = getFavorites();
    const index = favorites.indexOf(destinationId);

    if (index === -1) {
        favorites.push(destinationId);
        saveToStorage(STORAGE_KEYS.FAVORITES, favorites);
        return true; // Added
    } else {
        favorites.splice(index, 1);
        saveToStorage(STORAGE_KEYS.FAVORITES, favorites);
        return false; // Removed
    }
};

export const isFavorite = (destinationId: string): boolean => {
    return getFavorites().includes(destinationId);
};

// ============================================================================
// CULTURAL TIP OF THE DAY
// ============================================================================

export const getTipOfTheDay = (): CulturalTip => {
    const today = new Date();
    const dayOfYear = Math.floor(
        (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    const tipIndex = dayOfYear % CULTURAL_TIPS.length;
    return CULTURAL_TIPS[tipIndex];
};

// ============================================================================
// CURRENCY FORMATTING
// ============================================================================

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

// ============================================================================
// STORAGE EVENT LISTENER (for cross-tab sync)
// ============================================================================

export const createStorageListener = (callback: () => void): (() => void) => {
    const handler = (event: StorageEvent) => {
        if (event.key?.startsWith('wayora_')) {
            callback();
        }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
};
