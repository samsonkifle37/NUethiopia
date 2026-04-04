"use client";

import { PlaceGrid } from "@/components/PlaceGrid";
import { useLanguage } from "@/contexts/LanguageContext";

export default function StaysPage() {
    const { tr } = useLanguage();

    return (
        <PlaceGrid
            title={tr("sections", "discoverStays")}
            types="hotel,guesthouse,apartment,resort"
            filterOptions={[
                { value: "", label: tr("sections", "allStays") },
                { value: "hotel", label: tr("sections", "hotels") },
                { value: "guesthouse", label: tr("sections", "guesthouses") },
                { value: "apartment", label: tr("sections", "apartments") },
                { value: "resort", label: tr("sections", "resorts") },
            ]}
            searchPlaceholder={tr("sections", "staysSearch")}
            accentColor="ethiopia-green"
        />
    );
}
