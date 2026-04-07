"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function JournalRedirect() {
    const router = useRouter();
    
    useEffect(() => {
        router.replace("/profile?tab=journal");
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAF8] space-y-6">
            <div className="w-12 h-12 border-4 border-[#C9973B]/20 border-t-[#C9973B] rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Moving to Profile Hub...</p>
        </div>
    );
}
