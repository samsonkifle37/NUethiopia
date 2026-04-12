export const runtime = 'nodejs';

import { PlaceGrid } from "@/components/PlaceGrid";
import { getPlacesServer } from "@/lib/data/places";
import { translations, tr as translate } from "@/lib/i18n";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Tours & Experiences | NU Ethiopia",
  description: "Discover authentic Ethiopian tours, dining, and nightlife curated by NU.",
};

import { DiscoverySection } from "@/components/discovery/DiscoverySection";

async function ToursContent() {
  const lang = "en";
  const tr = (section: keyof typeof translations["en"], key: string) => translate(lang, section, key);

  let initialData;
  try {
    initialData = await getPlacesServer({
      types: "tour,tour_operator,guide,experience,restaurant,coffee,cafe,bar,club,nightlife,lounge,food",
      limit: 18
    });
  } catch (error) {
    console.error("Tours SSR data fetch failed:", error);
    initialData = { places: [], total: 0, limit: 18, offset: 0 };
  }

  return (
    <PlaceGrid
      title={tr("sections", "toursDining")}
      types="tour,tour_operator,guide,experience,restaurant,coffee,cafe,bar,club,nightlife,lounge,food"
      filterOptions={[
        { value: "", label: tr("grid", "allAreas") },
        { value: "tour,tour_operator,guide,experience", label: tr("nav", "tours") },
        { value: "restaurant,coffee,cafe,bar,club,nightlife,lounge,food", label: tr("sections", "diningNightlife") },
        { value: "gems", label: "GEMS" },
      ]}
      searchPlaceholder={tr("sections", "toursSearch")}
      accentColor="orange-500"
      initialData={initialData}
    />
  );
}

export default function ToursPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-24">
      <Suspense fallback={
        <div className="space-y-6 pt-4 px-4 animate-pulse">
          <div className="flex justify-between items-center px-1">
            <div className="h-8 w-56 bg-gray-200 rounded-xl" />
          </div>
          <div className="h-12 bg-gray-200 rounded-2xl" />
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-8 w-28 bg-gray-200 rounded-xl shrink-0" />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-100 h-72 rounded-[2rem]" />
            ))}
          </div>
        </div>
      }>
        <ToursContent />
      </Suspense>
    </div>
  );
}
