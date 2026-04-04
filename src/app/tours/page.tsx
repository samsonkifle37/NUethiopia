import { PlaceGrid } from "@/components/PlaceGrid";

export const metadata = {
    title: "Tours & Experiences — NU",
    description: "Discover guided tours, museums, parks, markets, and cultural experiences across Ethiopia.",
};

export default function ToursPage() {
    return (
        <PlaceGrid
            title="Tours & Dining"
            types="tour,tour_operator,guide,experience,restaurant,coffee,club,nightlife"
            filterOptions={[
                { value: "", label: "All" },
                { value: "tour,tour_operator,guide,experience", label: "Tours" },
                { value: "restaurant,coffee,club,nightlife", label: "Dining & Nightlife" },
            ]}
            searchPlaceholder="Tours, restaurants, coffee..."
            accentColor="orange-500"
        />
    );
}
