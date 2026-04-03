"use client";
import { usePathname } from "next/navigation";

export function ConditionalMain({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    if (isAdmin) {
        // Admin pages manage their own layout — render children without any wrapper
        return <>{children}</>;
    }

    // Public mobile-first layout
    return (
        <main className="max-w-lg mx-auto min-h-screen pb-24 px-4">
            {children}
        </main>
    );
}
