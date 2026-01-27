import { useState, useEffect, useCallback } from 'react';
import {
    SavedTrip,
    getSavedTrips,
    saveTrip as saveTripToStorage,
    getActiveTrip as getActiveTripFromStorage,
    setActiveTrip as setActiveTripInStorage,
    deleteTrip as deleteTripFromStorage,
    createStorageListener,
} from '@/lib/storageService';

interface UseTripsReturn {
    trips: SavedTrip[];
    activeTrip: SavedTrip | null;
    saveTrip: (trip: Omit<SavedTrip, 'id' | 'createdAt'>) => SavedTrip;
    setActiveTrip: (id: string) => SavedTrip | null;
    deleteTrip: (id: string) => boolean;
    getTripsByCircuit: (circuit: string) => SavedTrip[];
    refresh: () => void;
}

export const useTrips = (): UseTripsReturn => {
    const [trips, setTrips] = useState<SavedTrip[]>(getSavedTrips);
    const [activeTrip, setActiveTripState] = useState<SavedTrip | null>(getActiveTripFromStorage);

    // Refresh from storage
    const refresh = useCallback(() => {
        setTrips(getSavedTrips());
        setActiveTripState(getActiveTripFromStorage());
    }, []);

    // Listen for storage changes
    useEffect(() => {
        const cleanup = createStorageListener(refresh);
        return cleanup;
    }, [refresh]);

    // Save a new trip
    const handleSaveTrip = useCallback((trip: Omit<SavedTrip, 'id' | 'createdAt'>): SavedTrip => {
        const newTrip = saveTripToStorage(trip);
        setTrips(getSavedTrips());
        return newTrip;
    }, []);

    // Set active trip
    const handleSetActiveTrip = useCallback((id: string): SavedTrip | null => {
        const trip = setActiveTripInStorage(id);
        setTrips(getSavedTrips());
        setActiveTripState(trip);
        return trip;
    }, []);

    // Delete trip
    const handleDeleteTrip = useCallback((id: string): boolean => {
        const success = deleteTripFromStorage(id);
        if (success) {
            setTrips(getSavedTrips());
            setActiveTripState(getActiveTripFromStorage());
        }
        return success;
    }, []);

    // Get trips by circuit type
    const getTripsByCircuit = useCallback((circuit: string): SavedTrip[] => {
        return trips.filter(t => t.circuit === circuit);
    }, [trips]);

    return {
        trips,
        activeTrip,
        saveTrip: handleSaveTrip,
        setActiveTrip: handleSetActiveTrip,
        deleteTrip: handleDeleteTrip,
        getTripsByCircuit,
        refresh,
    };
};
