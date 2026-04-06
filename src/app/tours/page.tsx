import { PlaceGrid } from "@/components/PlaceGrid";
import { getPlacesServer } from "@/lib/data/places";
import { translations, tr as translate } from "@/lib/i18n";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tours & Experiences | NU Ethiopia",
  description: "Discover authentic Ethiopian tours, dining, and nightlife curated by NU.",
};

export default async function ToursPage() {
  const lang = "en";
  const tr = (section: keyof typeof translations["en"], key: string) => translate(lang, section, key);

  const initialData = await getPlacesServer({
    types: "tour,tour_operator,guide,experience,restaurant,coffee,cafe,bar,club,nightlife,lounge,food",
    limit: 18
  });

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-24">
      <PlaceGrid
        title={tr("sections", "toursDining")}
        types="tour,tour_operator,guide,experience,restaurant,coffee,cafe,bar,club,nightlife,lounge,food"
        filterOptions={[
          { value: "", label: tr("grid", "allAreas") },
          { value: "tour,tour_operator,guide,experience", label: tr("nav", "tours") },
          { value: "restaurant,coffee,cafe,bar,club,nightlife,lounge,food", label: tr("sections", "diningNightlife") },
        ]}
        searchPlaceholder={tr("sections", "toursSearch")}
        accentColor="orange-500"
        initialData={initialData}
      />
    </div>
  );
}
