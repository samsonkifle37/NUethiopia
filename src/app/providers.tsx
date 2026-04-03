"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/lib/auth-context";
import { InAppBrowserProvider } from "@/components/InAppBrowser";
import { useState } from "react";
import { ToastProvider } from "@/components/Toast";
import { PlannerProvider } from "@/contexts/PlannerContext";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ToastProvider>
                    <PlannerProvider>
                        <InAppBrowserProvider>{children}</InAppBrowserProvider>
                    </PlannerProvider>
                </ToastProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
