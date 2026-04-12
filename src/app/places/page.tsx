import { PlaceGrid } from "@/components/PlaceGrid";
import { Suspense } from "react";

export const metadata = {
    title: "Places — NU",
    description: "Discover parks, markets, museums, and points of interest in Ethiopia.",
};

export default function PlacesPage() {
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
                    title="Explore Places"
                    types="park,market,museum,culture,landmark,place,religious,religious site"
                    filterOptions={[
                        { value: "", label: "All Places" },
                        { value: "museum", label: "Museums" },
                        { value: "park", label: "Parks & Nature" },
                        { value: "market", label: "Markets" },
                        { value: "landmark", label: "Landmarks" },
                        { value: "religious", label: "Religious" },
                    ]}
                    searchPlaceholder="National Museum, Parks..."
                    accentColor="ethiopia-yellow"
                />
            </Suspense>
        </div>
    );
}
