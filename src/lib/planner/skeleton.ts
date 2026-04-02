// NU Planner — Itinerary Skeleton Builder + Composer
// Turns ranked candidates into a structured PlannerDay[] output.

import type {
  PlanningContext,
  PlannerBlock,
  PlannerDay,
  RankedPlace,
  TimeBlock,
  BlockType,
} from "./types";
import { DAY_THEMES } from "./intent";

// Time-block → preferred place types
const SLOT_TYPES: Record<TimeBlock, string[]> = {
  arrival:   [],  // handled separately
  morning:   ["museum", "church", "landmark", "gallery", "heritage", "park", "viewpoint"],
  lunch:     ["restaurant", "cafe", "coffee"],
  afternoon: ["market", "tour", "park", "attraction", "experience", "coffee"],
  sunset:    ["viewpoint", "park", "cafe", "restaurant"],
  dinner:    ["restaurant", "cafe"],
  nightlife: ["club", "bar", "nightlife", "jazz"],
};

function slotTypeFor(placeType: string): BlockType {
  const t = placeType.toLowerCase();
  if (["cafe", "coffee", "restaurant"].some((x) => t.includes(x))) {
    return t.includes("coffee") || t.includes("cafe") ? "coffee" : "dining";
  }
  if (["club", "bar", "nightlife", "jazz"].some((x) => t.includes(x))) return "nightlife";
  if (["tour", "experience", "guide"].some((x) => t.includes(x))) return "tour";
  if (["transport", "taxi", "pickup"].some((x) => t.includes(x))) return "transport";
  return "attraction";
}

function pickBestForSlot(
  ranked: RankedPlace[],
  used: Set<string>,
  preferredTypes: string[]
): RankedPlace | undefined {
  // Try preferred types first
  let pick = ranked.find(
    (p) => !used.has(p.id) && preferredTypes.some((t) => p.type.toLowerCase().includes(t))
  );
  // Fall back to any unused
  if (!pick) pick = ranked.find((p) => !used.has(p.id));
  if (pick) used.add(pick.id);
  return pick;
}

function makeBlock(
  slot: TimeBlock,
  place: RankedPlace,
  reason: string
): PlannerBlock {
  return {
    time: slot,
    type: slotTypeFor(place.type),
    placeId: place.id,
    title: place.name,
    area: place.area,
    heroImage: place.heroImage,
    slug: place.slug,
    shortDescription: place.shortDescription,
    reason,
    confidence: place.confidence,
    trustBadges: place.trustBadges,
    isGrounded: true,
  };
}

function makeUngroundedBlock(slot: TimeBlock, type: BlockType): PlannerBlock {
  return {
    time: slot,
    type,
    title: "Explore the area",
    reason: "No verified data available for this slot — explore what's nearby.",
    confidence: "low",
    trustBadges: ["Limited Data"],
    isGrounded: false,
  };
}

function dayTheme(interests: string[], dayIndex: number): string {
  const matched = interests.filter((i) => DAY_THEMES[i]);
  if (matched.length === 0) return "Discover Addis Ababa";
  return DAY_THEMES[matched[dayIndex % matched.length]] ?? DAY_THEMES[matched[0]];
}

function interestReason(place: RankedPlace, ctx: PlanningContext): string {
  const t = place.type.toLowerCase();
  if (t.includes("coffee") || t.includes("cafe")) return `A great coffee stop${place.area ? ` in ${place.area}` : ""} — central to Ethiopian culture.`;
  if (t.includes("museum")) return "Museums here are the fastest way into Ethiopian history.";
  if (t.includes("restaurant")) return `Recommended for ${ctx.budget} dining${place.area ? ` in ${place.area}` : ""}.`;
  if (t.includes("park")) return `Green space and local walking — ideal ${ctx.pace === 'slow' ? 'for a relaxed afternoon' : 'to break up the day'}.`;
  if (t.includes("market")) return "Markets are the pulse of Addis — go before 4 PM for best experience.";
  if (t.includes("club") || t.includes("bar")) return "Addis nightlife is vibrant — this is a reliable, popular spot.";
  if (t.includes("tour")) return "Guided experience that adds context and local perspective.";
  if (t.includes("church") || t.includes("religious")) return "Important historical and spiritual site in the city.";
  return `Picked for ${ctx.interests.join(", ")} interests and ${ctx.budget} budget.`;
}

// ── Slots per pace ────────────
const PACE_SLOTS: Record<string, TimeBlock[]> = {
  slow:     ["morning", "lunch", "afternoon"],
  balanced: ["morning", "lunch", "afternoon", "dinner"],
  packed:   ["morning", "lunch", "afternoon", "sunset", "dinner", "nightlife"],
};

export function buildItinerary(
  ranked: RankedPlace[],
  ctx: PlanningContext
): PlannerDay[] {
  const used = new Set<string>();
  const days: PlannerDay[] = [];

  const baseSlots = PACE_SLOTS[ctx.pace] ?? PACE_SLOTS.balanced;
  const addNightlife = ctx.interests.includes("nightlife") && ctx.groupType !== "family";

  for (let day = 1; day <= ctx.days; day++) {
    const blocks: PlannerBlock[] = [];
    const alternatives: PlannerBlock[] = [];
    const isArrivalDay = day === 1 && ctx.arrivalHour !== undefined;

    // ── Arrival day special logic ────────────
    if (isArrivalDay) {
      const arrH = ctx.arrivalHour!;

      // transport block
      if (ctx.needsAirportPickup) {
        blocks.push({
          time: "arrival",
          type: "transport",
          title: "Airport transfer to accommodation",
          reason: "Direct taxi or ride from Bole International — arrange before landing for smooth arrival.",
          confidence: "high",
          trustBadges: [],
          isGrounded: false,
        });
      }

      if (arrH >= 20) {
        // Late night — dinner only
        const dinner = pickBestForSlot(ranked, used, SLOT_TYPES.dinner);
        if (dinner) blocks.push(makeBlock("dinner", dinner, "Close to Bole area — good after a late arrival."));
        else blocks.push(makeUngroundedBlock("dinner", "dining"));
      } else if (arrH >= 16) {
        // Evening arrival — afternoon + dinner
        const af = pickBestForSlot(ranked, used, SLOT_TYPES.afternoon);
        if (af) blocks.push(makeBlock("afternoon", af, interestReason(af, ctx)));
        const dinner = pickBestForSlot(ranked, used, SLOT_TYPES.dinner);
        if (dinner) blocks.push(makeBlock("dinner", dinner, interestReason(dinner, ctx)));
      } else {
        // Day arrival — full day like normal
        for (const slot of baseSlots) {
          const pick = pickBestForSlot(ranked, used, SLOT_TYPES[slot]);
          if (pick) blocks.push(makeBlock(slot, pick, interestReason(pick, ctx)));
          else blocks.push(makeUngroundedBlock(slot, slot === "dinner" ? "dining" : "attraction"));
        }
      }

      days.push({
        dayNumber: 1,
        theme: arrH >= 20 ? "Arrival Night — Rest & Unwind" : "Arrival Day — Easy Introduction to Addis",
        blocks,
        alternatives,
      });
      continue;
    }

    // ── Normal day ────────────
    const slotsForDay = addNightlife && day === ctx.days
      ? [...baseSlots.filter((s) => s !== "nightlife"), "nightlife" as TimeBlock]
      : baseSlots;

    for (const slot of slotsForDay) {
      const pick = pickBestForSlot(ranked, used, SLOT_TYPES[slot]);
      if (pick) {
        blocks.push(makeBlock(slot, pick, interestReason(pick, ctx)));

        // Add an alternative from the same slot if available
        const alt = pickBestForSlot(ranked, new Set([...used]), SLOT_TYPES[slot]);
        if (alt && alt.id !== pick.id) {
          alternatives.push(makeBlock(slot, alt, `Alternative for ${slot}: ${alt.name}`));
        }
      } else {
        blocks.push(makeUngroundedBlock(slot, slot === "dinner" || slot === "lunch" ? "dining" : "attraction"));
      }
    }

    days.push({
      dayNumber: day,
      theme: dayTheme(ctx.interests, day - 1),
      blocks,
      alternatives,
    });
  }

  return days;
}
