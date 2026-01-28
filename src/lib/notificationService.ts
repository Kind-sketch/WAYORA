import { Notification } from './storageService';

// Sample notifications for travel app
const travelNotifications: Omit<Notification, 'id' | 'timestamp'>[] = [
    {
        type: 'trip',
        title: 'Trip Reminder',
        message: 'Your trip to Madurai starts tomorrow! Don\'t forget to pack traditional attire for temple visits.',
        read: false,
    },
    {
        type: 'deal',
        title: 'Special Offer 🎉',
        message: '20% off on Nilgiri Mountain Railway tickets this weekend. Book now!',
        read: false,
    },
    {
        type: 'weather',
        title: 'Weather Alert',
        message: 'Light rain expected in Ooty today. Carry an umbrella!',
        read: false,
    },
    {
        type: 'xp',
        title: 'Level Up! 🏆',
        message: 'You\'ve earned 500 XP this week. Keep exploring!',
        read: false,
    },
    {
        type: 'tip',
        title: 'Cultural Tip',
        message: 'Pongal festival is next week. Expect temple closures on specific days.',
        read: false,
    },
];

const STORAGE_KEY = 'wayora_notifications';

// Get all notifications
export const getNotifications = (): Notification[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    // Initialize with sample notifications if empty
    const initial = travelNotifications.map((n, i) => ({
        ...n,
        id: `notif_${i + 1}`,
        timestamp: new Date(Date.now() - i * 3600000).toISOString(), // Stagger times
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
};

// Add a new notification
export const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>): Notification => {
    const notifications = getNotifications();
    const newNotification: Notification = {
        ...notification,
        id: `notif_${Date.now()}`,
        timestamp: new Date().toISOString(),
    };
    notifications.unshift(newNotification);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    return newNotification;
};

// Mark notification as read
export const markAsRead = (id: string): void => {
    const notifications = getNotifications();
    const updated = notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

// Mark all as read
export const markAllAsRead = (): void => {
    const notifications = getNotifications();
    const updated = notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

// Delete a notification
export const deleteNotification = (id: string): void => {
    const notifications = getNotifications();
    const filtered = notifications.filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

// Get unread count
export const getUnreadCount = (): number => {
    const notifications = getNotifications();
    return notifications.filter(n => !n.read).length;
};

// Clear all notifications
export const clearNotifications = (): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
};
