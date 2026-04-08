"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get("code");
            const callbackUrl = searchParams.get("callbackUrl") || "/profile";

            // 1. Handle PKCE code flow (Server-side exchange prefered, but we can do it here too)
            if (code) {
                window.location.href = `/api/auth/callback?code=${code}&callbackUrl=${encodeURIComponent(callbackUrl)}`;
                return;
            }

            // 2. Handle Implicit flow (Hash tokens)
            // Supabase client automatically picks up the hash fragment
            const { data, error } = await supabase.auth.getSession();
            
            if (data?.session) {
                router.push(callbackUrl);
            } else if (error) {
                console.error("Callback error:", error);
                router.push("/auth?error=callback_failed");
            } else {
                // If no session and no code, might be an old or invalid link
                router.push("/auth");
            }
        };

        handleCallback();
    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAF8]">
            <Loader2 className="w-10 h-10 text-[#C9973B] animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Verifying your secure link...</p>
        </div>
    );
}
