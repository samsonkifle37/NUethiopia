// NU Planner — Intent Normalization
// Converts raw user prompt + optional structured inputs into a PlanningContext.

import type { Budget, GroupType, Pace, PlanningContext } from "./types";

const INTEREST_MAP: Record<string, string[]> = {
  coffee:    ["coffee", "cafe", "buna", "café", "espresso"],
  culture:   ["culture", "cultural", "tradition", "ceremony"],
  museum:    ["museum", "national museum", "ethnological"],
  history:   ["history", "heritage", "historical", "ancient", "ruins"],
  nature:    ["nature", "park", "hike", "mountain", "outdoor", "entoto"],
  food:      ["food", "restaurant", "eat", "dining", "cuisine", "injera"],
  nightlife: ["nightlife", "bar", "club", "night", "jazz", "live music"],
  market:    ["market", "shopping", "mercato", "shola"],
  religious: ["church", "orthodox", "religious", "timkat", "lalibela"],
  tour:      ["tour", "guided", "experience", "explore"],
  luxury:    ["luxury", "upscale", "high-end", "fine dining"],
  family:    ["family", "kids", "children", "child-friendly"],
  hidden:    ["hidden", "gems", "off the beaten", "local secret"],
};

const DAY_THEMES: Record<string, string> = {
  coffee:    "Coffee & Café Culture",
  culture:   "Culture & Traditions",
  museum:    "History & Heritage",
  history:   "Historical Addis",
  nature:    "Nature & Escapes",
  food:      "Flavours of Ethiopia",
  nightlife: "Addis After Dark",
  market:    "Markets & Local Life",
  tour:      "Guided Discovery",
  luxury:    "Luxury Addis",
  hidden:    "Hidden Gems",
};

function detectInterests(q: string): string[] {
  const lower = q.toLowerCase();
  const found: string[] = [];
  for (const [interest, keywords] of Object.entries(INTEREST_MAP)) {
    if (keywords.some((k) => lower.includes(k))) found.push(interest);
  }
  if (found.length === 0) found.push("culture", "food");
  return [...new Set(found)];
}

function detectDays(q: string, explicit?: number): number {
  if (explicit && explicit >= 1 && explicit <= 7) return explicit;
  const match = q.match(/(\d+)\s*(?:day|night)/i);
  if (match) return Math.min(parseInt(match[1]), 7);
  if (/weekend/i.test(q)) return 2;
  if (/layover/i.test(q)) return 1;
  return 3; // default
}

function detectBudget(q: string, explicit?: Budget): Budget {
  if (explicit) return explicit;
  if (/luxury|upscale|fine dining|high.end/i.test(q)) return "luxury";
  if (/cheap|budget|affordable|low.cost/i.test(q)) return "budget";
  return "mid-range";
}

function detectPace(q: string, explicit?: Pace): Pace {
  if (explicit) return explicit;
  if (/relaxed|slow|easy|leisurely/i.test(q)) return "slow";
  if (/packed|intense|busy|full|jam.?packed/i.test(q)) return "packed";
  return "balanced";
}

function detectGroupType(q: string, explicit?: GroupType): GroupType {
  if (explicit) return explicit;
  if (/family|kids|children/i.test(q)) return "family";
  if (/couple|romantic|anniversary|honeymoon/i.test(q)) return "couple";
  if (/group|friends/i.test(q)) return "group";
  return "solo";
}

function detectArrivalHour(q: string, isoTime?: string): number | undefined {
  if (isoTime) {
    const d = new Date(isoTime);
    if (!isNaN(d.getTime())) return d.getHours();
  }
  const match = q.match(/land(?:ing|ed|s)?\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (match) {
    let h = parseInt(match[1]);
    const meridiem = match[3]?.toLowerCase();
    if (meridiem === "pm" && h < 12) h += 12;
    if (meridiem === "am" && h === 12) h = 0;
    return h;
  }
  return undefined;
}

export function normalizeIntent(
  rawQuery: string,
  opts?: {
    destination?: string;
    days?: number;
    budget?: Budget;
    interests?: string[];
    pace?: Pace;
    groupType?: GroupType;
    arrivalTime?: string;
    needsAirportPickup?: boolean;
    preferredArea?: string;
  }
): PlanningContext {
  const q = rawQuery.trim();
  const assumptions: string[] = [];

  const destination = opts?.destination || "Addis Ababa";
  const days = detectDays(q, opts?.days);
  const budget = detectBudget(q, opts?.budget);
  const pace = detectPace(q, opts?.pace);
  const groupType = detectGroupType(q, opts?.groupType);
  const interests = opts?.interests?.length ? opts.interests : detectInterests(q);
  const arrivalHour = detectArrivalHour(q, opts?.arrivalTime);
  const needsAirportPickup = opts?.needsAirportPickup ?? /airport|bole|land/i.test(q);
  const preferredArea = opts?.preferredArea;
  const isLayover = /layover/i.test(q);

  // Build travel-style label
  const themeKeys = interests.filter((i) => DAY_THEMES[i]);
  const travelStyle = themeKeys.length
    ? themeKeys.map((k) => DAY_THEMES[k]).join(" + ")
    : "Balanced Ethiopia Experience";

  // Record assumptions
  if (!opts?.budget) assumptions.push(`Assumed ${budget} budget`);
  if (!opts?.days && !q.match(/\d+\s*day/i)) assumptions.push(`Defaulted to ${days} days`);
  if (!preferredArea) assumptions.push("Hotel area not specified — showing city-wide picks");
  if (groupType === "solo" && !opts?.groupType) assumptions.push("Assumed solo travel");

  return {
    destination,
    days,
    budget,
    interests,
    pace,
    groupType,
    arrivalHour,
    needsAirportPickup,
    preferredArea,
    travelStyle,
    assumptions,
    isLayover,
    rawQuery: q,
  };
}

export { DAY_THEMES };
