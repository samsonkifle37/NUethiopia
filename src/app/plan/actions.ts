"use server";

import prisma from "@/lib/prisma";
import { normalizeIntent } from "@/lib/planner/intent";
import { rankCandidates } from "@/lib/planner/ranking";
import { buildItinerary } from "@/lib/planner/skeleton";
import { enrichWithOpenAI } from "@/lib/planner/openai";
import type { PlannerResponse, Confidence, Budget, Pace, GroupType } from "@/lib/planner/types";

export async function generateItinerary(query: string, overrides: any = {}): Promise<PlannerResponse | { error: string }> {
  if (!query || query.trim().length < 3) {
    return { error: "Query is too short. Please describe what you love." };
  }

  try {
    // ── Step 1: Normalize intent ────────────
    const ctx = normalizeIntent(query, {
      destination: overrides.destination,
      days: overrides.days ?? overrides.nights,
      budget: overrides.budget as Budget | undefined,
      interests: overrides.interests,
      pace: overrides.pace as Pace | undefined,
      groupType: overrides.groupType as GroupType | undefined,
      arrivalTime: overrides.arrivalTime,
      needsAirportPickup: overrides.needsAirportPickup,
      preferredArea: overrides.preferredArea,
    });

    // ── Step 2: Retrieve candidates from NU DB ────────────
    const cityFilter = ctx.destination.toLowerCase().includes("addis")
      ? { contains: "Addis", mode: "insensitive" as const }
      : { contains: ctx.destination, mode: "insensitive" as const };

    const ACCOMMODATION_TYPES = ["hotel", "guesthouse", "apartment", "hostel", "lodge", "resort"];

    const rawPlaces = await prisma.place.findMany({
      where: {
        isActive: true,
        status: "APPROVED",
        city: cityFilter,
        NOT: {
          type: { in: ACCOMMODATION_TYPES },
        },
      },
      include: {
        images: {
          where: { status: "APPROVED" },
          orderBy: { priority: "asc" },
          take: 3,
        },
      },
      take: 200, // cap to keep DB query fast
    });

    // ── Step 3: Rank candidates ────────────
    const ranked = rankCandidates(rawPlaces as any[], ctx);

    // ── Step 4: Build itinerary skeleton + compose ────────────
    let days = buildItinerary(ranked, ctx);

    // ── Step 4.5: OpenAI Narrative Enrichment ────────────
    // Use try/catch because OpenAI can fail or be slow
    try {
        const enriched = await enrichWithOpenAI(days, ctx);
        if (enriched && enriched.length > 0) {
            days = enriched;
        }
    } catch (e) {
        console.error("[NU Planner] OpenAI Enrichment failed, falling back to skeleton:", e);
    }

    // ── Step 5: Confidence assessment ────────────
    const groundedCount = days
      .flatMap((d) => d.blocks)
      .filter((b) => b.isGrounded).length;
    const totalSlots = days.flatMap((d) => d.blocks).length;
    const coverageRatio = totalSlots > 0 ? groundedCount / totalSlots : 0;

    const coverageNotes: string[] = [];
    if (coverageRatio < 0.5) {
      coverageNotes.push("Database coverage is limited for this query — some slots use general suggestions.");
    }
    if (ranked.length < 10) {
      coverageNotes.push(`Only ${ranked.length} matching places found in NU database for this destination.`);
    }

    const overallConfidence: Confidence =
      coverageRatio >= 0.8 ? "high" : coverageRatio >= 0.5 ? "medium" : "low";

    // ── Step 6: Arrival support flags ────────────
    const isArriving =
      ctx.arrivalHour !== undefined || ctx.needsAirportPickup;

    // ── Step 7: Assemble response ────────────
    return {
      tripSummary: {
        destination: ctx.destination,
        days: ctx.days,
        travelStyle: ctx.travelStyle,
        budget: ctx.budget,
        assumptions: ctx.assumptions,
      },
      arrivalSupport: {
        airportPickupRecommended: ctx.needsAirportPickup || isArriving,
        simRecommended: isArriving,
        currencyExchangeRecommended: isArriving,
        notes: isArriving
          ? [
              "Bole Airport has official currency exchange desks in Arrivals. Use them over street changers.",
              "Ethio Telecom SIM available at airport kiosk — bring passport.",
            ]
          : [],
      },
      days,
      warnings: coverageNotes,
      confidenceSummary: {
        overall: overallConfidence,
        coverageNotes,
        groundedPlaceCount: groundedCount,
        totalSlots,
      },
    };
  } catch (error) {
    console.error("[NU Planner Server Action] Error:", error);
    return { error: "Failed to build your itinerary. Our server might be busy. Please try again." };
  }
}
