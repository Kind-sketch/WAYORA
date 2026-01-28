import { motion } from "framer-motion";

interface SkeletonCardProps {
    variant?: "default" | "horizontal" | "small";
}

export const SkeletonCard = ({ variant = "default" }: SkeletonCardProps) => {
    if (variant === "horizontal") {
        return (
            <div className="brutalist-card overflow-hidden animate-pulse">
                <div className="flex">
                    <div className="w-24 h-24 skeleton" />
                    <div className="flex-1 p-3 space-y-2">
                        <div className="h-4 w-3/4 skeleton rounded" />
                        <div className="h-3 w-1/2 skeleton rounded" />
                        <div className="flex gap-2 mt-3">
                            <div className="h-5 w-16 skeleton rounded-lg" />
                            <div className="h-5 w-12 skeleton rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (variant === "small") {
        return (
            <div className="brutalist-card p-3 animate-pulse">
                <div className="w-10 h-10 skeleton-circle mx-auto mb-2" />
                <div className="h-3 w-full skeleton rounded mx-auto" />
            </div>
        );
    }

    return (
        <div className="brutalist-card p-4 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 skeleton-circle" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 skeleton rounded" />
                    <div className="h-3 w-1/2 skeleton rounded" />
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-3 w-full skeleton rounded" />
                <div className="h-3 w-5/6 skeleton rounded" />
                <div className="h-3 w-4/6 skeleton rounded" />
            </div>
        </div>
    );
};

interface SkeletonTextProps {
    lines?: number;
    className?: string;
}

export const SkeletonText = ({ lines = 3, className = "" }: SkeletonTextProps) => {
    return (
        <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <motion.div
                    key={i}
                    className="h-4 skeleton rounded animate-shimmer"
                    style={{ width: `${100 - i * 15}%` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                />
            ))}
        </div>
    );
};

export const SkeletonImage = ({ className = "w-full h-48" }: { className?: string }) => {
    return (
        <div className={`${className} skeleton animate-shimmer rounded-xl`} />
    );
};

export const DestinationCardSkeleton = () => {
    return (
        <motion.div
            className="brutalist-card overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex">
                <div className="w-24 h-24 skeleton" />
                <div className="flex-1 p-3">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                            <div className="h-4 w-3/4 skeleton rounded" />
                            <div className="h-3 w-1/2 skeleton rounded" />
                        </div>
                        <div className="w-8 h-8 skeleton-circle" />
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                        <div className="h-3 w-16 skeleton rounded" />
                        <div className="h-3 w-16 skeleton rounded" />
                    </div>
                    <div className="flex gap-2 mt-2">
                        <div className="h-5 w-14 skeleton rounded-lg" />
                        <div className="h-5 w-10 skeleton rounded-lg" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export const TripCardSkeleton = () => {
    return (
        <div className="brutalist-card p-4 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 skeleton-circle" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 skeleton rounded" />
                    <div className="h-3 w-1/3 skeleton rounded" />
                </div>
                <div className="h-6 w-16 skeleton rounded-lg" />
            </div>
            <div className="h-3 w-full skeleton rounded mb-2" />
            <div className="flex justify-between">
                <div className="h-3 w-16 skeleton rounded" />
                <div className="h-3 w-16 skeleton rounded" />
                <div className="h-3 w-16 skeleton rounded" />
            </div>
        </div>
    );
};
