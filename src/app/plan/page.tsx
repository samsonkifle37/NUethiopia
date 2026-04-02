"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles, MapPin, ArrowRight, Loader2, CheckCircle,
  AlertCircle, Info, Plane, CreditCard, Wifi, Clock,
  RefreshCw, ChevronDown, ChevronUp, Shield
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { VerifiedImage } from "@/components/media/VerifiedImage";
import type { PlannerResponse, PlannerBlock, PlannerDay } from "@/lib/planner/types";

// ── Preset queries ────────────────────────────────
const PRESETS = [
  { label: "Just Landed at Bole", query: "I just landed at Bole airport, help me tonight and tomorrow" },
  { label: "Weekend in Addis", query: "Weekend in Addis Ababa — coffee, culture, nightlife" },
  { label: "Coffee Lover", query: "2 days focused on coffee culture and cafes in Addis" },
  { label: "7-hr Layover", query: "I have a 7 hour layover in Addis, what should I do?" },
];

// ── Trust badge colours ────────────────────────────────
function TrustBadge({ label }: { label: string }) {
  const config: Record<string, string> = {
    "Verified":        "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Owner Verified":  "bg-blue-100 text-blue-700 border-blue-200",
    "High Confidence": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Real Photos":     "bg-purple-100 text-purple-700 border-purple-200",
    "Popular Choice":  "bg-amber-100 text-amber-700 border-amber-200",
    "Limited Data":    "bg-gray-100 text-gray-500 border-gray-200",
  };
  const cls = config[label] ?? "bg-gray-100 text-gray-500 border-gray-200";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${cls}`}>
      {label}
    </span>
  );
}

// ── Confidence indicator ────────────────────────────────
function ConfidenceDot({ level }: { level: "high" | "medium" | "low" }) {
  const c = level === "high" ? "bg-emerald-400" : level === "medium" ? "bg-amber-400" : "bg-red-400";
  return <span className={`inline-block w-2 h-2 rounded-full ${c} shrink-0`} />;
}

// ── Time badge ────────────────────────────────
const TIME_LABELS: Record<string, { label: string; color: string }> = {
  arrival:   { label: "Arrival",   color: "bg-blue-600" },
  morning:   { label: "Morning",   color: "bg-amber-500" },
  lunch:     { label: "Lunch",     color: "bg-orange-500" },
  afternoon: { label: "Afternoon", color: "bg-[#C9973B]" },
  sunset:    { label: "Sunset",    color: "bg-rose-500" },
  dinner:    { label: "Dinner",    color: "bg-red-600" },
  nightlife: { label: "Night",     color: "bg-indigo-600" },
};

// ── Single activity block card ────────────────────────────────
function BlockCard({ block }: { block: PlannerBlock }) {
  const [expanded, setExpanded] = useState(false);
  const timeMeta = TIME_LABELS[block.time] ?? { label: block.time, color: "bg-gray-500" };

  if (!block.isGrounded) {
    return (
      <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest">{timeMeta.label}</p>
          <p className="text-sm font-bold text-gray-600 mt-0.5">{block.title}</p>
          <p className="text-[10px] text-gray-400 mt-1 font-medium">{block.reason}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Colour bar */}
      <div className={`h-0.5 ${timeMeta.color}`} />

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Image */}
          {block.heroImage && block.slug && (
            <Link href={`/place/${block.slug}`} className="shrink-0">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 relative">
                <VerifiedImage
                  src={block.heroImage}
                  alt={block.title}
                  entityType={block.type as any}
                  showBadge={false}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          )}

          <div className="flex-1 min-w-0">
            {/* Time + confidence */}
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[9px] font-black text-white uppercase tracking-widest ${timeMeta.color} px-2 py-0.5 rounded-full`}>
                {timeMeta.label}
              </span>
              <ConfidenceDot level={block.confidence} />
            </div>

            {/* Title */}
            {block.slug ? (
              <Link href={`/place/${block.slug}`}>
                <h4 className="text-sm font-black text-[#1A1612] leading-tight hover:text-[#C9973B] transition-colors line-clamp-1">
                  {block.title}
                </h4>
              </Link>
            ) : (
              <h4 className="text-sm font-black text-[#1A1612] leading-tight">{block.title}</h4>
            )}

            {/* Area */}
            {block.area && (
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">{block.area}</span>
              </div>
            )}

            {/* Trust badges */}
            {block.trustBadges.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {block.trustBadges.map((b) => <TrustBadge key={b} label={b} />)}
              </div>
            )}
          </div>

          {/* Expand button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="shrink-0 w-7 h-7 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#C9973B] transition-colors"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Expanded reason */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-50">
            <div className="flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-[#C9973B] shrink-0 mt-0.5" />
              <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{block.reason}</p>
            </div>
            {block.shortDescription && (
              <p className="text-[11px] text-gray-400 mt-2 italic leading-relaxed">"{block.shortDescription}"</p>
            )}
            {block.slug && (
              <Link
                href={`/place/${block.slug}`}
                className="inline-flex items-center gap-1 mt-2 text-[10px] font-black text-[#C9973B] uppercase tracking-widest hover:gap-2 transition-all"
              >
                View Place <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Day card ────────────────────────────────
function DayCard({ day }: { day: PlannerDay }) {
  const [showAlts, setShowAlts] = useState(false);
  return (
    <div className="space-y-3">
      {/* Day header */}
      <div className="flex items-center gap-3 pt-2">
        <div className="w-8 h-8 rounded-2xl bg-[#1A1612] flex items-center justify-center shrink-0 shadow-sm">
          <span className="text-[#C9973B] text-xs font-black">{day.dayNumber}</span>
        </div>
        <div>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Day {day.dayNumber}</p>
          <h3 className="text-sm font-black text-[#1A1612] tracking-tight">{day.theme}</h3>
        </div>
      </div>

      {/* Blocks */}
      <div className="space-y-2 pl-2 border-l-2 border-[#C9973B]/20 ml-4">
        {day.blocks.map((block, i) => (
          <BlockCard key={i} block={block} />
        ))}
      </div>

      {/* Alternatives */}
      {day.alternatives.length > 0 && (
        <div className="ml-4 pl-2">
          <button
            onClick={() => setShowAlts(!showAlts)}
            className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#C9973B] transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            {showAlts ? "Hide alternatives" : `${day.alternatives.length} alternative${day.alternatives.length > 1 ? "s" : ""}`}
          </button>
          {showAlts && (
            <div className="mt-2 space-y-2 opacity-70">
              {day.alternatives.map((block, i) => (
                <BlockCard key={i} block={block} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Arrival support card ────────────────────────────────
function ArrivalCard({ support }: { support: PlannerResponse["arrivalSupport"] }) {
  if (!support.airportPickupRecommended && !support.simRecommended && !support.currencyExchangeRecommended) return null;
  return (
    <div className="bg-[#1A1612] rounded-3xl p-5 space-y-3 border border-[#C9973B]/20">
      <div className="flex items-center gap-2 mb-1">
        <Plane className="w-4 h-4 text-[#C9973B]" />
        <h3 className="text-[10px] font-black text-[#C9973B] uppercase tracking-widest">Arrival Essentials</h3>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {support.airportPickupRecommended && (
          <div className="bg-white/5 rounded-xl p-2.5 flex flex-col items-center gap-1 text-center">
            <Plane className="w-4 h-4 text-[#C9973B]" />
            <span className="text-[9px] font-bold text-white">Airport Pickup</span>
          </div>
        )}
        {support.simRecommended && (
          <div className="bg-white/5 rounded-xl p-2.5 flex flex-col items-center gap-1 text-center">
            <Wifi className="w-4 h-4 text-[#C9973B]" />
            <span className="text-[9px] font-bold text-white">Get SIM</span>
          </div>
        )}
        {support.currencyExchangeRecommended && (
          <div className="bg-white/5 rounded-xl p-2.5 flex flex-col items-center gap-1 text-center">
            <CreditCard className="w-4 h-4 text-[#C9973B]" />
            <span className="text-[9px] font-bold text-white">Exchange ETB</span>
          </div>
        )}
      </div>
      {support.notes.map((note, i) => (
        <p key={i} className="text-[10px] text-gray-400 font-medium leading-relaxed">{note}</p>
      ))}
    </div>
  );
}

// ── Main page content ────────────────────────────────
function PlanPageContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const [query, setQuery] = useState(q);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlannerResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [showAssumptionsEditor, setShowAssumptionsEditor] = useState(false);
  const [manualOverrides, setManualOverrides] = useState({
    days: 3,
    budget: "mid-range",
    pace: "balanced",
    groupType: "solo",
  });

  useEffect(() => {
    if (q) handleGenerate(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const handleGenerate = async (searchQuery: string, overrides: any = {}) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const payload = { query: searchQuery, ...overrides };
      const res = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Server error");
      const data: PlannerResponse = await res.json();
      setResult(data);
    } catch (e: any) {
      setError(`Error: ${e?.message || String(e)}`);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-24 font-sans">
      {/* Header */}
      <div className="bg-[#1A1612] px-5 pt-12 pb-10 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9973B]/10 rounded-full blur-[80px]" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-gradient-to-br from-[#C9973B] to-[#E8C07A] rounded-2xl flex items-center justify-center shadow-lg shadow-[#C9973B]/20">
              <Sparkles className="w-6 h-6 text-[#1A1612]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">AI Trip Planner</h1>
              <p className="text-[#E8C07A] text-[9px] font-bold uppercase tracking-widest mt-0.5">
                Grounded in real NU data · Ethiopia-first
              </p>
            </div>
          </div>

          {/* Input */}
          <div className="bg-white/10 backdrop-blur-sm p-1.5 rounded-2xl border border-white/10 flex items-center gap-2">
            <input
              type="text"
              placeholder="E.g. 3 days coffee and culture..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate(query)}
              className="flex-1 px-4 py-3 text-sm font-medium text-white bg-transparent focus:outline-none placeholder-white/40"
            />
            <button
              onClick={() => handleGenerate(query)}
              disabled={loading || !query.trim()}
              className="bg-[#C9973B] text-[#1A1612] p-3.5 rounded-xl disabled:opacity-50 hover:bg-[#E8C07A] transition shadow-lg font-black"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
            </button>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap gap-2 mt-3">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => { setQuery(p.query); handleGenerate(p.query); }}
                className="bg-white/5 hover:bg-[#C9973B]/20 border border-white/10 hover:border-[#C9973B]/50 text-gray-300 hover:text-white px-3 py-1.5 rounded-full text-[9px] font-bold transition-all"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 mt-6 space-y-5">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-14 h-14 border-4 border-[#C9973B]/20 border-t-[#C9973B] rounded-full animate-spin" />
            <div className="text-center">
              <p className="text-sm font-black text-[#1A1612] uppercase tracking-widest">Building your itinerary</p>
              <p className="text-xs text-gray-400 font-medium mt-1">Ranking from {">"}300 verified NU places…</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-5">
            {/* Trip summary */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[9px] font-black text-[#C9973B] uppercase tracking-widest mb-1">Your Plan</p>
                  <h2 className="text-lg font-black text-[#1A1612] tracking-tight leading-tight">
                    {result.tripSummary.days}-Day {result.tripSummary.travelStyle}
                  </h2>
                  <p className="text-xs text-gray-500 font-medium mt-0.5 capitalize">
                    {result.tripSummary.destination} · {result.tripSummary.budget}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 rounded-xl px-2.5 py-1.5 border border-gray-100">
                  <ConfidenceDot level={result.confidenceSummary.overall} />
                  <span className="text-[9px] font-black text-gray-600 uppercase tracking-wider capitalize">
                    {result.confidenceSummary.overall} confidence
                  </span>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-gray-50 rounded-xl p-2 text-center border border-gray-100">
                  <p className="text-lg font-black text-[#1A1612]">{result.tripSummary.days}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Days</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-2 text-center border border-gray-100">
                  <p className="text-lg font-black text-[#1A1612]">{result.confidenceSummary.groundedPlaceCount}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">NU Places</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-2 text-center border border-gray-100">
                  <p className="text-lg font-black text-[#1A1612]">{result.confidenceSummary.totalSlots}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Slots</p>
                </div>
              </div>

              {/* Assumptions */}
              {result.tripSummary.assumptions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Assumptions</p>
                    <button 
                      onClick={() => {
                        setManualOverrides({
                          days: result.tripSummary.days || 3,
                          budget: result.tripSummary.budget || "mid-range",
                          pace: "balanced",
                          groupType: "solo"
                        });
                        setShowAssumptionsEditor(!showAssumptionsEditor);
                      }}
                      className="text-[9px] font-bold text-[#C9973B] uppercase tracking-widest hover:underline"
                    >
                      {showAssumptionsEditor ? "Cancel" : "Change"}
                    </button>
                  </div>
                  {!showAssumptionsEditor && result.tripSummary.assumptions.map((a, i) => (
                    <div key={i} className="flex items-start gap-1.5 mt-1">
                      <Info className="w-3 h-3 text-gray-300 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-gray-500 font-medium">{a}</p>
                    </div>
                  ))}

                  {/* Settings Editor Form */}
                  {showAssumptionsEditor && (
                    <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-2xl animate-in fade-in slide-in-from-top-2">
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                          <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">Duration (Days)</label>
                          <input type="number" min="1" max="14" value={manualOverrides.days} onChange={e => setManualOverrides({...manualOverrides, days: parseInt(e.target.value) || 1 })} className="w-full p-2 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-[#C9973B] focus:ring-1 focus:ring-[#C9973B]" />
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">Budget</label>
                          <select value={manualOverrides.budget} onChange={e => setManualOverrides({...manualOverrides, budget: e.target.value})} className="w-full p-2 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-[#C9973B] focus:ring-1 focus:ring-[#C9973B]">
                            <option value="budget">Backpacker</option>
                            <option value="mid-range">Mid-range</option>
                            <option value="luxury">Luxury</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">Pace</label>
                          <select value={manualOverrides.pace} onChange={e => setManualOverrides({...manualOverrides, pace: e.target.value})} className="w-full p-2 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-[#C9973B] focus:ring-1 focus:ring-[#C9973B]">
                            <option value="slow">Relaxed</option>
                            <option value="balanced">Balanced</option>
                            <option value="packed">Action-packed</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">Group</label>
                          <select value={manualOverrides.groupType} onChange={e => setManualOverrides({...manualOverrides, groupType: e.target.value})} className="w-full p-2 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-[#C9973B] focus:ring-1 focus:ring-[#C9973B]">
                            <option value="solo">Solo</option>
                            <option value="couple">Couple</option>
                            <option value="friends">Friends</option>
                            <option value="family">Family</option>
                          </select>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setShowAssumptionsEditor(false);
                          handleGenerate(query, manualOverrides);
                        }}
                        className="w-full py-2.5 bg-[#1A1612] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Apply & Re-plan
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Arrival essentials */}
            <ArrivalCard support={result.arrivalSupport} />

            {/* Warnings */}
            {result.warnings.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-1">
                {result.warnings.map((w, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-700 font-medium">{w}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Days */}
            <div className="space-y-8">
              {result.days.map((day) => (
                <DayCard key={day.dayNumber} day={day} />
              ))}
            </div>

            {/* Refinement Actions */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mt-6">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Refine this plan</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "cheaper", label: "Make it cheaper", icon: "💰" },
                  { id: "luxury", label: "Upgrade to luxury", icon: "✨" },
                  { id: "family", label: "Family friendly", icon: "👨‍👩‍👧‍👦" },
                  { id: "relaxed", label: "More relaxed pace", icon: "☕" },
                  { id: "hidden", label: "Hidden gems", icon: "🗺️" },
                  { id: "nightlife", label: "Add nightlife", icon: "🍷" }
                ].map((act) => (
                  <button
                    key={act.id}
                    onClick={() => {
                      const suffix = ` (Focus: ${act.label})`;
                      const newQuery = query + suffix;
                      setQuery(newQuery);
                      handleGenerate(newQuery);
                    }}
                    className="bg-gray-50 hover:bg-[#C9973B]/10 border border-gray-200 hover:border-[#C9973B]/50 px-3 py-2 rounded-xl text-[10px] font-bold text-gray-600 hover:text-[#C9973B] transition-colors flex items-center gap-1.5"
                  >
                    <span>{act.icon}</span> {act.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust footer */}
            <div className="bg-[#1A1612] rounded-3xl p-5 flex items-start gap-3 mt-4">
              <Shield className="w-5 h-5 text-[#C9973B] shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-black text-[#C9973B] uppercase tracking-widest mb-1">NU Trust Promise</p>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                  Every grounded recommendation comes directly from the NU verified database.
                  We never invent places — if coverage is limited we say so clearly.
                </p>
                {/* AI specific callout */}
                <p className="text-[10px] text-gray-500 font-medium mt-2 italic">
                  Descriptions generated by AI for a personalized experience, built strictly on NU facts.
                </p>
              </div>
            </div>

            {/* Re-plan CTA */}
            <button
              onClick={() => { setResult(null); setQuery(""); }}
              className="w-full py-3.5 border-2 border-[#C9973B]/30 rounded-2xl text-[10px] font-black text-[#C9973B] uppercase tracking-widest hover:bg-[#C9973B]/5 transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Plan a Different Trip
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !result && !error && (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-[#C9973B]/10 rounded-3xl flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-[#C9973B]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#1A1612]">Plan any Ethiopia Trip</h3>
              <p className="text-xs text-gray-400 font-medium mt-1 max-w-xs mx-auto leading-relaxed">
                Type your trip idea above or choose a preset — plans are built from 300+ verified NU places.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => { setQuery(p.query); handleGenerate(p.query); }}
                  className="bg-white border border-gray-100 rounded-2xl p-4 text-left shadow-sm hover:border-[#C9973B]/30 hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <p className="text-xs font-black text-[#1A1612]">{p.label}</p>
                  <p className="text-[9px] text-gray-400 font-medium mt-0.5 line-clamp-2">{p.query}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#C9973B] animate-spin" />
        </div>
      }
    >
      <PlanPageContent />
    </Suspense>
  );
}
