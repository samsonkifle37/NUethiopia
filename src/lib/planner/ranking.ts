// NU Planner — Composite Ranking Module
// Scores DB place candidates against a PlanningContext.
// Returns sorted RankedPlace[].

import type { PlanningContext, RankedPlace, Confidence } from "./types";

// Interest → place type affinities
const INTEREST_TYPE_MAP: Record<string, string[]> = {
  coffee:    ["cafe", "coffee"],
  food:      ["restaurant", "cafe", "bar"],
  museum:    ["museum"],
  history:   ["museum", "landmark", "heritage site", "ruins", "monument"],
  culture:   ["museum", "landmark", "restaurant", "tour", "gallery", "church"],
  nature:    ["park", "nature", "hiking", "viewpoint"],
  nightlife: ["club", "bar", "nightlife", "jazz"],
  market:    ["market", "shopping"],
  religious: ["church", "religious site", "mosque", "monastery"],
  tour:      ["tour", "tour_operator", "experience", "guide"],
  luxury:    ["restaurant", "hotel"],  // luxury filter is budget-level, not type
  hidden:    [],  // any type, low-featured
};

const PRICE_BUDGET_MAP: Record<string, string[]> = {
  budget:     ["$", "budget", "low"],
  "mid-range": ["$$", "mid", "moderate", "mid-range"],
  luxury:     ["$$$", "$$$$", "luxury", "upscale", "premium"],
};

// Accommodation types never go in itinerary slots
const EXCLUDED_TYPES = new Set([
  "hotel", "guesthouse", "apartment", "hostel", "lodge", "resort", "stay", "home",
]);

function trustScore(p: RawPlace): number {
  let score = 0;
  // verificationScore: 0-100 from DB, map to 0-50 here
  score += Math.min(50, (p.verificationScore ?? 30) * 0.5);
  if (p.ownerVerified) score += 20;
  if (p.featured) score += 10;
  if ((p.sourceCount ?? 0) >= 3) score += 10;
  if ((p.reviewCount ?? 0) >= 5) score += 10;
  return Math.min(100, score);
}

function userFitScore(p: RawPlace, ctx: PlanningContext): number {
  let score = 0;
  const pType = (p.type || "").toLowerCase();
  const pTags = (p.tags || []).map((t: string) => t.toLowerCase());

  for (const interest of ctx.interests) {
    const affTypes = INTEREST_TYPE_MAP[interest] || [];
    if (affTypes.some((t) => pType.includes(t))) score += 30;
    for (const tag of pTags) {
      if (tag.includes(interest) || interest.includes(tag)) score += 20;
    }
  }
  score = Math.min(80, score);

  // Budget match
  const budgetKeywords = PRICE_BUDGET_MAP[ctx.budget] || [];
  if (p.priceLevel && budgetKeywords.some((k) => p.priceLevel!.toLowerCase().includes(k))) {
    score += 20;
  } else if (!p.priceLevel) {
    score += 10; // unknown price = neutral
  }

  // Family bonuses
  if (ctx.groupType === "family") {
    if (["park", "museum", "market", "tour"].some((t) => pType.includes(t))) score += 10;
    if (["club", "bar", "nightlife"].some((t) => pType.includes(t))) score -= 30;
  }

  return Math.min(100, Math.max(0, score));
}

function logisticsScore(p: RawPlace, ctx: PlanningContext): number {
  let score = 0;

  if (ctx.preferredArea && p.area) {
    if (p.area.toLowerCase().includes(ctx.preferredArea.toLowerCase())) score += 40;
    else score += 10;
  } else {
    score += 25; // no area preference = no penalty
  }

  if (p.openingHours && Object.keys(p.openingHours).length > 0) score += 20;
  if (p.latitude && p.longitude) score += 20;
  if (!EXCLUDED_TYPES.has(pType(p))) score += 20;

  return Math.min(100, score);
}

function diversityScore(p: RawPlace, usedTypes: string[]): number {
  const pt = pType(p);
  const count = usedTypes.filter((t) => t === pt).length;
  if (count === 0) return 100;
  if (count === 1) return 70;
  if (count === 2) return 40;
  return 10;
}

function imageConfidenceScore(p: RawPlace): number {
  if (!p.images || p.images.length === 0) return 0;
  const approved = p.images.filter((img: RawImage) => img.status === "APPROVED");
  const realApproved = approved.filter((img: RawImage) => img.imageTruthType === "place_real");
  if (realApproved.length > 0) return 100;
  if (approved.length > 0) return 60;
  return 30;
}

function deriveTrustBadges(p: RawPlace, tScore: number): string[] {
  const badges: string[] = [];
  if (p.ownerVerified) badges.push("Owner Verified");
  if (tScore >= 70) badges.push("Verified");
  if (tScore >= 80) badges.push("High Confidence");
  if (p.featured || (p.reviewCount ?? 0) >= 10) badges.push("Popular Choice");
  const imgs = p.images || [];
  const realImg = imgs.find((i: RawImage) => i.status === "APPROVED" && i.imageTruthType === "place_real");
  if (realImg) badges.push("Real Photos");
  if (tScore < 40) badges.push("Limited Data");
  return badges;
}

function deriveConfidence(tScore: number): Confidence {
  if (tScore >= 60) return "high";
  if (tScore >= 35) return "medium";
  return "low";
}

function pType(p: RawPlace) {
  return (p.type || "").toLowerCase();
}

// ── Raw DB shapes (loosely typed) ────────────
interface RawImage {
  imageUrl: string;
  status?: string;
  imageTruthType?: string;
  priority?: number;
}
interface RawPlace {
  id: string;
  name: string;
  slug: string;
  type?: string | null;
  city?: string | null;
  area?: string | null;
  shortDescription?: string | null;
  verificationScore?: number | null;
  ownerVerified?: boolean | null;
  featured?: boolean | null;
  reviewCount?: number | null;
  sourceCount?: number | null;
  priceLevel?: string | null;
  openingHours?: Record<string, unknown> | null;
  latitude?: number | null;
  longitude?: number | null;
  tags?: string[];
  images?: RawImage[];
}

export function rankCandidates(
  rawPlaces: RawPlace[],
  ctx: PlanningContext,
  usedTypes: string[] = []
): RankedPlace[] {
  const valid = rawPlaces.filter(
    (p) =>
      p.name &&
      p.slug &&
      p.name.trim().length >= 2 &&
      !EXCLUDED_TYPES.has(pType(p))
  );

  const weights = { trust: 0.35, fit: 0.30, logistics: 0.20, diversity: 0.10, image: 0.05 };

  return valid
    .map((p) => {
      const tScore = trustScore(p);
      const fScore = userFitScore(p, ctx);
      const lScore = logisticsScore(p, ctx);
      const dScore = diversityScore(p, usedTypes);
      const iScore = imageConfidenceScore(p);

      const finalScore =
        weights.trust * tScore +
        weights.fit * fScore +
        weights.logistics * lScore +
        weights.diversity * dScore +
        weights.image * iScore;

      const imgs = p.images || [];
      const heroImg =
        imgs
          .filter((i) => i.status === "APPROVED")
          .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))[0]?.imageUrl ||
        imgs.sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))[0]?.imageUrl ||
        null;

      const hasRealImage = imgs.some(
        (i) => i.status === "APPROVED" && i.imageTruthType === "place_real"
      );

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        type: p.type ?? "place",
        city: p.city ?? "Addis Ababa",
        area: p.area ?? "",
        shortDescription: p.shortDescription ?? null,
        heroImage: heroImg,
        verificationScore: p.verificationScore ?? 30,
        ownerVerified: p.ownerVerified ?? false,
        featured: p.featured ?? false,
        reviewCount: p.reviewCount ?? 0,
        sourceCount: p.sourceCount ?? 0,
        priceLevel: p.priceLevel ?? null,
        hasRealImage,
        latitude: p.latitude ?? null,
        longitude: p.longitude ?? null,
        finalScore,
        trustScore: tScore,
        trustBadges: deriveTrustBadges(p, tScore),
        confidence: deriveConfidence(tScore),
      } satisfies RankedPlace;
    })
    .sort((a, b) => {
      if (Math.abs(b.finalScore - a.finalScore) > 0.5) return b.finalScore - a.finalScore;
      return Math.random() - 0.5; // tie-break variety
    });
}
