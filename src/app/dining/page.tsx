import { PlaceGrid } from "@/components/PlaceGrid";
import { Suspense } from "react";

export const metadata = {
    title: "Dining — NU",
    description: "Find the best restaurants, cafes, and nightlife in Ethiopia.",
};

export default function DiningPage() {
    return (
        <div className="min-h-screen bg-[#FAFAF8] pb-24">
            <Suspense fallback={
                <div className="space-y-6 pt-4 px-4 animate-pulse">
                    <div className="h-8 w-48 bg-gray-200 rounded-xl" />
                    <div className="h-12 bg-gray-200 rounded-2xl" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-gray-100 h-72 rounded-[2rem]" />
                        ))}
                    </div>
                </div>
            }>
                <PlaceGrid
                    title="Dining & Nightlife"
                    types="restaurant,coffee,club,nightlife"
                    filterOptions={[
                        { value: "", label: "All Dining" },
                        { value: "restaurant", label: "Restaurants" },
                        { value: "coffee", label: "Coffee Shops" },
                        { value: "club", label: "Nightlife" },
                    ]}
                    searchPlaceholder="Bole, restaurants, coffee..."
                    accentColor="ethiopia-red"
                />
            </Suspense>
        </div>
    );
}
