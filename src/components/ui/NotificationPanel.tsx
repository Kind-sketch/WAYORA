import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Check, CheckCheck, Trash2, MapPin, Tag, Cloud, Trophy, Lightbulb, Settings } from "lucide-react";
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount
} from "@/lib/notificationService";
import { Notification } from "@/lib/storageService";

const typeIcons: Record<string, typeof Bell> = {
    trip: MapPin,
    deal: Tag,
    weather: Cloud,
    xp: Trophy,
    tip: Lightbulb,
    system: Settings,
};

const typeColors: Record<string, string> = {
    trip: "bg-primary",
    deal: "bg-accent",
    weather: "bg-blue-400",
    xp: "bg-yellow-400",
    tip: "bg-green-400",
    system: "bg-muted",
};

interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NotificationPanel = ({ isOpen, onClose }: NotificationPanelProps) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (isOpen) {
            refreshNotifications();
        }
    }, [isOpen]);

    const refreshNotifications = () => {
        setNotifications(getNotifications());
        setUnreadCount(getUnreadCount());
    };

    const handleMarkAsRead = (id: string) => {
        markAsRead(id);
        refreshNotifications();
    };

    const handleMarkAllRead = () => {
        markAllAsRead();
        refreshNotifications();
    };

    const handleDelete = (id: string) => {
        deleteNotification(id);
        refreshNotifications();
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-[100]"
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="fixed top-16 right-4 left-4 max-w-[400px] mx-auto bg-card border border-foreground/10 rounded-2xl shadow-soft-lg overflow-hidden z-[101]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-secondary/50 border-b border-foreground/10">
                            <div className="flex items-center gap-2">
                                <Bell size={18} className="text-primary" />
                                <h3 className="font-bold text-foreground">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="px-2 py-0.5 bg-primary text-foreground text-xs font-bold rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                                        title="Mark all as read"
                                    >
                                        <CheckCheck size={16} className="text-muted-foreground" />
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                >
                                    <X size={16} className="text-muted-foreground" />
                                </button>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-[60vh] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Bell size={40} className="mx-auto text-muted-foreground/50 mb-2" />
                                    <p className="text-muted-foreground text-sm">No notifications yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-foreground/5">
                                    {notifications.map((notif) => {
                                        const Icon = typeIcons[notif.type] || Bell;
                                        const colorClass = typeColors[notif.type] || "bg-muted";

                                        return (
                                            <motion.div
                                                key={notif.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className={`p-4 hover:bg-secondary/30 transition-colors ${!notif.read ? "bg-primary/5" : ""
                                                    }`}
                                            >
                                                <div className="flex gap-3">
                                                    <div className={`w-9 h-9 rounded-xl ${colorClass} flex items-center justify-center flex-shrink-0`}>
                                                        <Icon size={16} className="text-foreground" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <h4 className={`text-sm font-medium ${!notif.read ? "font-bold" : ""}`}>
                                                                {notif.title}
                                                            </h4>
                                                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                                                {formatTime(notif.timestamp)}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                                            {notif.message}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            {!notif.read && (
                                                                <button
                                                                    onClick={() => handleMarkAsRead(notif.id)}
                                                                    className="text-[10px] text-primary hover:underline flex items-center gap-1"
                                                                >
                                                                    <Check size={10} /> Mark read
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleDelete(notif.id)}
                                                                className="text-[10px] text-muted-foreground hover:text-destructive flex items-center gap-1"
                                                            >
                                                                <Trash2 size={10} /> Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// Bell icon with badge for header
interface NotificationBellProps {
    onClick: () => void;
}

export const NotificationBell = ({ onClick }: NotificationBellProps) => {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        setUnreadCount(getUnreadCount());

        // Refresh count every 30 seconds
        const interval = setInterval(() => {
            setUnreadCount(getUnreadCount());
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <button
            onClick={onClick}
            className="relative p-2.5 rounded-xl bg-card border border-foreground/10 hover:bg-secondary transition-colors"
        >
            <Bell size={18} className="text-foreground" />
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                </span>
            )}
        </button>
    );
};
