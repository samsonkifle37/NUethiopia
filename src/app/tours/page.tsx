"use client";

import { PlaceGrid } from "@/components/PlaceGrid";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ToursPage() {
    const { tr } = useLanguage();

    return (
        <PlaceGrid
            title={tr("sections", "toursDining")}
            types="tour,tour_operator,guide,experience,restaurant,coffee,club,nightlife"
            filterOptions={[
                { value: "", label: tr("grid", "allAreas") },
                { value: "tour,tour_operator,guide,experience", label: tr("nav", "tours") },
                { value: "restaurant,coffee,club,nightlife", label: tr("sections", "diningNightlife") },
            ]}
            searchPlaceholder={tr("sections", "toursSearch")}
            accentColor="orange-500"
        />
    );
}
