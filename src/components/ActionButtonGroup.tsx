"use client";

import React, { useState } from "react";
import { Plus, Share2, Loader2, Check } from "lucide-react";
import { shareContent, getCanonicalUrl } from "@/lib/share";
import { usePlanner, SavedItem } from "@/contexts/PlannerContext";
import { useToast } from "@/components/Toast";

interface ActionButtonGroupProps {
    item: Omit<SavedItem, "savedAt">;
    variant?: "compact" | "full" | "header-transparent";
    showLabel?: boolean;
}

export function ActionButtonGroup({ 
    item, 
    variant = "full",
    showLabel = true 
}: ActionButtonGroupProps) {
    const { addToPlanner, isItemInPlan } = usePlanner();
    const { showToast } = useToast();
    const [isSharing, setIsSharing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    
    const inPlan = isItemInPlan(item.id);

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsSharing(true);
        
        const data = {
            title: item.title,
            text: item.shortDescription?.split('.')[0] + '.' || "",
            url: getCanonicalUrl(item.type === "event" ? `/events/${item.slug}` : `/place/${item.slug}`)
        };

        const result = await shareContent(data);
        
        if (result.success && result.method === "clipboard") {
            showToast("Link copied to clipboard", "success");
        }
        
        setIsSharing(false);
    };

    const handleAddToPlan = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (inPlan) {
            showToast("Already in your plan", "success");
            return;
        }

        setIsAdding(true);
        
        const success = await addToPlanner(item);

        if (success) {
            showToast(`Added ${item.title} to your plan`, "success");
        } else {
            showToast("Failed to add to plan", "error");
        }

        setIsAdding(false);
    };

    if (variant === "header-transparent") {
        return (
            <div className="flex gap-2">
                <button 
                   onClick={handleShare}
                   className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 active:scale-95 transition-all hover:bg-white/30"
                >
                   <Share2 className="w-5 h-5 text-white" />
                </button>
                <button 
                   onClick={handleAddToPlan}
                   className={`w-10 h-10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 active:scale-95 transition-all ${
                       inPlan ? "bg-[#D4AF37] text-white" : "bg-white/20 text-white hover:bg-white/30"
                   }`}
                >
                   {inPlan ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </button>
            </div>
        );
    }

    if (variant === "compact") {
        return (
            <div className="flex gap-2">
                <button 
                   onClick={handleShare}
                   className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-all hover:bg-white/20"
                >
                   <Share2 className="w-3.5 h-3.5" />
                </button>
                <button 
                   onClick={handleAddToPlan}
                   className={`w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-all ${
                       inPlan ? "bg-[#D4AF37] text-white" : "bg-white/10 backdrop-blur-md text-white hover:bg-white/20"
                   }`}
                >
                   {inPlan ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </button>
            </div>
        );
    }

    return (
        <div className="flex gap-3 relative z-10">
            <button 
                onClick={handleShare}
                disabled={isSharing}
                className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#1A1A2E] active:scale-90 transition-all ${isSharing ? 'opacity-50' : 'hover:bg-gray-100 shadow-sm'}`}
            >
                {isSharing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button 
                onClick={handleAddToPlan}
                disabled={isAdding}
                className={`h-11 px-6 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-[#1A1A2E]/20 ${
                    inPlan 
                    ? "bg-[#D4AF37] text-white" 
                    : "bg-[#1A1A2E] text-white hover:bg-[#252545]"
                }`}
            >
                {isAdding ? (
                    <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        {showLabel && "Adding..."}
                    </>
                ) : inPlan ? (
                    <>
                        <Check className="w-3 h-3" />
                        {showLabel && "Added"}
                    </>
                ) : (
                    <>
                        <Plus className="w-3 h-3" />
                        {showLabel && "Add to Plan"}
                    </>
                )}
            </button>
        </div>
    );
}
