"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface OfflineContextType {
    isOnline: boolean;
    storageUsed: string;
    refreshStorage: () => void;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export function OfflineProvider({ children }: { children: ReactNode }) {
    const [isOnline, setIsOnline] = useState<boolean>(true);
    const [storageUsed, setStorageUsed] = useState<string>("0 MB");

    useEffect(() => {
        // Sync connectivity state
        setIsOnline(navigator.onLine);

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        refreshStorage();

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    const refreshStorage = async () => {
        if (typeof navigator !== "undefined" && navigator.storage && navigator.storage.estimate) {
            const { usage } = await navigator.storage.estimate();
            if (usage) {
                setStorageUsed(`${Math.round(usage / (1024 * 1024))} MB`);
            }
        }
    };

    return (
        <OfflineContext.Provider value={{ isOnline, storageUsed, refreshStorage }}>
            {children}
            {!isOnline && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5 duration-500">
                    <div className="bg-[#1A1612]/95 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            You're browsing offline
                        </span>
                    </div>
                </div>
            )}
        </OfflineContext.Provider>
    );
}

export const useOffline = () => {
    const context = useContext(OfflineContext);
    if (context === undefined) {
        throw new Error("useOffline must be used within an OfflineProvider");
    }
    return context;
};
