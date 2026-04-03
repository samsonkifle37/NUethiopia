"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

/**
 * Planner Item - Structure for both Events and Places in the plan
 */
export interface SavedItem {
    id: string;
    slug?: string;
    title: string;
    type: "event" | "place";
    category?: string;
    imageUrl?: string | null;
    shortDescription?: string;
    startTime?: string | Date;
    placeId?: string | null;
    placeSlug?: string | null;
    savedAt: string;
}

interface PlannerContextType {
    activeItineraryId: string | null;
    setActiveItineraryId: (id: string | null) => void;
    savedItems: SavedItem[];
    addToPlanner: (item: Omit<SavedItem, "savedAt">) => Promise<boolean>;
    isItemInPlan: (id: string) => boolean;
    isLoading: boolean;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export function PlannerProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [activeItineraryId, setActiveItineraryId] = useState<string | null>(null);
    const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initial load from LocalStorage for guest/local sync
    useEffect(() => {
        const localSaves = localStorage.getItem("nu_itinerary_saves");
        if (localSaves) {
            try {
                setSavedItems(JSON.parse(localSaves));
            } catch (err) {
                console.error("Failed to parse local saves", err);
            }
        }
        
        const activeId = localStorage.getItem("nu_active_itinerary_id");
        if (activeId) {
            setActiveItineraryId(activeId);
        }
        
        setIsLoading(false);
    }, []);

    // Sync saved items to LocalStorage
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem("nu_itinerary_saves", JSON.stringify(savedItems));
        }
    }, [savedItems, isLoading]);

    // Sync active itinerary to LocalStorage
    useEffect(() => {
        if (!isLoading) {
            if (activeItineraryId) {
                localStorage.setItem("nu_active_itinerary_id", activeItineraryId);
            } else {
                localStorage.removeItem("nu_active_itinerary_id");
            }
        }
    }, [activeItineraryId, isLoading]);

    /**
     * Add an item to the planner
     */
    const addToPlanner = async (item: Omit<SavedItem, "savedAt">): Promise<boolean> => {
        // Prevent duplicates
        if (isItemInPlan(item.id)) return true;

        const newItem: SavedItem = {
            ...item,
            savedAt: new Date().toISOString()
        };

        // 1. If user is logged in and has an active itinerary, we'd ideally sync to DB
        // For now, we'll maintain local state and sync logic can be added to useItineraries
        
        setSavedItems(prev => [newItem, ...prev]);
        
        // Success feedback
        return true;
    };

    const isItemInPlan = (id: string) => {
        return savedItems.some(i => i.id === id);
    };

    return (
        <PlannerContext.Provider value={{
            activeItineraryId,
            setActiveItineraryId,
            savedItems,
            addToPlanner,
            isItemInPlan,
            isLoading
        }}>
            {children}
        </PlannerContext.Provider>
    );
}

export function usePlanner() {
    const context = useContext(PlannerContext);
    if (context === undefined) {
        throw new Error("usePlanner must be used within a PlannerProvider");
    }
    return context;
}
