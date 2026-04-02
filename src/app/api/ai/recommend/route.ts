import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { normalizeIntent } from "@/lib/planner/intent";
import { rankCandidates } from "@/lib/planner/ranking";
import { buildItinerary } from "@/lib/planner/skeleton";
import { enrichWithOpenAI } from "@/lib/planner/openai";
import type { PlannerResponse, Confidence, Budget, Pace, GroupType } from "@/lib/planner/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ── Step 1: Normalize intent ────────────
    const ctx = normalizeIntent(body.query || "", {
      destination: body.destination,
      days: body.days ?? body.nights,
      budget: body.budget as Budget | undefined,
      interests: body.interests,
      pace: body.pace as Pace | undefined,
      groupType: body.groupType as GroupType | undefined,
      arrivalTime: body.arrivalTime,
      needsAirportPickup: body.needsAirportPickup,
      preferredArea: body.preferredArea,
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
      take: 300, // cap to avoid slow queries
    });

    // ── Step 3: Rank candidates ────────────
    const ranked = rankCandidates(rawPlaces as any[], ctx);

    // ── Step 4: Build itinerary skeleton + compose ────────────
    let days = buildItinerary(ranked, ctx);

    // ── Step 4.5: OpenAI Narrative Enrichment ────────────
    days = await enrichWithOpenAI(days, ctx);

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
    const response: PlannerResponse = {
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

    // Server-side telemetry
    console.log(
      `[NU Planner] dest=${ctx.destination} days=${ctx.days} interests=${ctx.interests.join(",")} candidates=${ranked.length} grounded=${groundedCount}/${totalSlots} confidence=${overallConfidence}`
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("[NU Planner] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate itinerary. Please try again." },
      { status: 500 }
    );
  }
}