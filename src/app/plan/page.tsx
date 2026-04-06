import { Suspense } from "react";
import { generateItinerary } from "./actions";
import { PlanClient } from "./PlanClient";
import { CURATED_ADDIS_PLAN } from "@/lib/planner/curated";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Trip Planner | NU Ethiopia",
  description: "Plan your perfect Ethiopia trip in seconds with AI grounded in real local data.",
};

interface PlanPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function PlanPage({ searchParams }: PlanPageProps) {
  const params = await searchParams;
  const q = params.q || "";

  let initialData = null;
  let initialError = null;

  if (q) {
    const result = await generateItinerary(q);
    if ("error" in result) {
      initialError = result.error;
    } else {
      initialData = result;
    }
  } else {
    // Show curated plan by default if no query - makes the page feel full immediately
    initialData = CURATED_ADDIS_PLAN;
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#C9973B]/20 border-t-[#C9973B] rounded-full animate-spin" />
    </div>}>
      <PlanClient initialData={initialData} initialError={initialError} initialQuery={q} />
    </Suspense>
  );
}
