export const runtime = 'nodejs';

import { PlaceGrid } from "@/components/PlaceGrid";
import { getPlacesServer } from "@/lib/data/places";
import { translations, tr as translate } from "@/lib/i18n";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stays | NU Ethiopia",
  description: "Find the best hotels, guesthouses, and apartments in Ethiopia.",
};

export default async function StaysPage() {
  // Current language default to "en" for SSR
  const lang = "en";
  const tr = (section: keyof typeof translations["en"], key: string) => translate(lang, section, key);

  const initialData = await getPlacesServer({
    types: "hotel,guesthouse,apartment,resort",
    limit: 18
  });

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-24">
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
        initialData={initialData}
      />
    </div>
  );
}
