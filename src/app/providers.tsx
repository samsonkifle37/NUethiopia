"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/lib/auth-context";
import { InAppBrowserProvider } from "@/components/InAppBrowser";
import { useState } from "react";
import { ToastProvider } from "@/components/Toast";
import { PlannerProvider } from "@/contexts/PlannerContext";

import { OfflineProvider } from "@/contexts/OfflineContext";
import { CalendarProvider } from "@/contexts/CalendarContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";



export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000 * 5, // Increased to 5 mins default for better offline feel
                        refetchOnWindowFocus: false,
                        retry: (failureCount, error: any) => {
                            // Don't retry if offline
                            if (typeof navigator !== 'undefined' && !navigator.onLine) return false;
                            return failureCount < 3;
                        }
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <OfflineProvider>
                    <CalendarProvider>
                        <CurrencyProvider>
                            <ToastProvider>
                                <PlannerProvider>
                                    <InAppBrowserProvider>{children}</InAppBrowserProvider>
                                </PlannerProvider>
                            </ToastProvider>
                        </CurrencyProvider>
                    </CalendarProvider>
                </OfflineProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
