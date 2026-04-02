// NU Planner — Shared Types & Schema
// All planner modules import from here.

export type Budget = "budget" | "mid-range" | "luxury";
export type Pace = "slow" | "balanced" | "packed";
export type GroupType = "solo" | "couple" | "family" | "group";
export type Confidence = "high" | "medium" | "low";
export type TimeBlock =
  | "arrival"
  | "morning"
  | "lunch"
  | "afternoon"
  | "sunset"
  | "dinner"
  | "nightlife";
export type BlockType =
  | "transport"
  | "dining"
  | "coffee"
  | "attraction"
  | "tour"
  | "nightlife"
  | "utility";

// ── Planning Context (normalised from raw user input) ────────────
export interface PlanningContext {
  destination: string;
  days: number;
  budget: Budget;
  interests: string[];
  pace: Pace;
  groupType: GroupType;
  arrivalHour?: number;        // 0-23
  needsAirportPickup: boolean;
  preferredArea?: string;
  travelStyle: string;
  assumptions: string[];
  isLayover: boolean;
  rawQuery: string;
}

// ── Ranked candidate (comes out of ranking module) ────────────
export interface RankedPlace {
  id: string;
  name: string;
  slug: string;
  type: string;
  city: string;
  area: string;
  shortDescription: string | null;
  heroImage: string | null;
  verificationScore: number;
  ownerVerified: boolean;
  featured: boolean;
  reviewCount: number;
  sourceCount: number;
  priceLevel: string | null;
  hasRealImage: boolean;
  latitude: number | null;
  longitude: number | null;
  finalScore: number;
  trustScore: number;
  trustBadges: string[];
  confidence: Confidence;
}

// ── Output block ────────────
export interface PlannerBlock {
  time: TimeBlock;
  type: BlockType;
  placeId?: string;
  title: string;
  area?: string;
  heroImage?: string | null;
  slug?: string;
  shortDescription?: string | null;
  reason: string;
  confidence: Confidence;
  trustBadges: string[];
  isGrounded: boolean;
}

// ── Output day ────────────
export interface PlannerDay {
  dayNumber: number;
  theme: string;
  blocks: PlannerBlock[];
  alternatives: PlannerBlock[];
}

// ── Full planner response ────────────
export interface PlannerResponse {
  tripSummary: {
    destination: string;
    days: number;
    travelStyle: string;
    budget: string;
    assumptions: string[];
  };
  arrivalSupport: {
    airportPickupRecommended: boolean;
    simRecommended: boolean;
    currencyExchangeRecommended: boolean;
    notes: string[];
  };
  days: PlannerDay[];
  warnings: string[];
  confidenceSummary: {
    overall: Confidence;
    coverageNotes: string[];
    groundedPlaceCount: number;
    totalSlots: number;
  };
}
