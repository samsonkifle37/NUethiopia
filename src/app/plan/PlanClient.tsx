"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles, MapPin, ArrowRight, Loader2, CheckCircle,
  AlertCircle, Info, Plane, CreditCard, Wifi, Clock,
  RefreshCw, ChevronDown, ChevronUp, Shield, Share2, Bookmark, Save
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { VerifiedImage } from "@/components/media/VerifiedImage";
import type { PlannerResponse, PlannerBlock, PlannerDay } from "@/lib/planner/types";
import { generateItinerary } from "./actions";
import { PlanSkeleton } from "./Skeleton";
import { saveItineraryAction } from "./save-action";
import { useAuth } from "@/lib/auth-context";

// ── Preset queries ────────────────────────────────
const PRESETS = [
  { label: "Just Landed at Bole", query: "I just landed at Bole airport, help me tonight and tomorrow" },
  { label: "Weekend in Addis", query: "Weekend in Addis Ababa — coffee, culture, nightlife" },
  { label: "Coffee Lover", query: "2 days focused on coffee culture and cafes in Addis" },
  { label: "7-hr Layover", query: "I have a 7 hour layover in Addis, what should I do?" },
];

const TIME_LABELS: Record<string, { label: string; color: string }> = {
  arrival:   { label: "Arrival",   color: "bg-blue-600" },
  morning:   { label: "Morning",   color: "bg-amber-500" },
  lunch:     { label: "Lunch",     color: "bg-orange-500" },
  afternoon: { label: "Afternoon", color: "bg-[#C9973B]" },
  sunset:    { label: "Sunset",    color: "bg-rose-500" },
  dinner:    { label: "Dinner",    color: "bg-red-600" },
  nightlife: { label: "Night",     color: "bg-indigo-600" },
};

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

function ConfidenceDot({ level }: { level: "high" | "medium" | "low" }) {
  const c = level === "high" ? "bg-emerald-400" : level === "medium" ? "bg-amber-400" : "bg-red-400";
  return <span className={`inline-block w-2 h-2 rounded-full ${c} shrink-0`} />;
}

function BlockCard({ block }: { block: PlannerBlock }) {
  const [expanded, setExpanded] = useState(false);
  const timeMeta = TIME_LABELS[block.time] ?? { label: block.time, color: "bg-gray-500" };

  if (!block.isGrounded) {
    return (
      <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest">{timeMeta.label}</p>
          <p className="text-sm font-bold text-gray-600 mt-0.5">{block.title}</p>
          <p className="text-[10px] text-gray-400 mt-1 font-medium">{block.reason}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      <div className={`h-0.5 ${timeMeta.color}`} />
      <div className="p-4">
        <div className="flex items-start gap-3">
          {block.heroImage && block.slug && (
            <Link href={`/place/${block.slug}`} className="shrink-0">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 relative">
                <VerifiedImage
                  src={block.heroImage}
                  alt={block.title}
                  entityType={block.type as any}
                  showBadge={false}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </Link>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[9px] font-black text-white uppercase tracking-widest ${timeMeta.color} px-2 py-0.5 rounded-full`}>
                {timeMeta.label}
              </span>
              <ConfidenceDot level={block.confidence} />
            </div>
            {block.slug ? (
              <Link href={`/place/${block.slug}`}>
                <h4 className="text-sm font-black text-[#1A1612] leading-tight hover:text-[#C9973B] transition-colors line-clamp-1">
                  {block.title}
                </h4>
              </Link>
            ) : (
              <h4 className="text-sm font-black text-[#1A1612] leading-tight">{block.title}</h4>
            )}
            {block.area && (
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">{block.area}</span>
              </div>
            )}
            <div className="flex flex-wrap gap-1 mt-2">
               {block.trustBadges.map((b) => <TrustBadge key={b} label={b} />)}
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="shrink-0 w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#C9973B] transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-50 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-[#C9973B] shrink-0 mt-0.5" />
              <p className="text-[11px] text-gray-600 font-medium leading-relaxed">{block.reason}</p>
            </div>
            {block.shortDescription && (
              <p className="text-[11px] text-gray-400 mt-2 italic leading-relaxed">"{block.shortDescription}"</p>
            )}
            {block.slug && (
              <Link
                href={`/place/${block.slug}`}
                className="inline-flex items-center gap-1 mt-2 text-[10px] font-black text-[#C9973B] uppercase tracking-widest hover:gap-2 transition-all"
              >
                View Place <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DayCard({ day }: { day: PlannerDay }) {
  const [showAlts, setShowAlts] = useState(false);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#1A1612] flex items-center justify-center shrink-0 shadow-lg border border-[#C9973B]/30">
          <span className="text-[#C9973B] text-sm font-black">{day.dayNumber}</span>
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Day {day.dayNumber}</p>
          <h3 className="text-base font-black text-[#1A1612] tracking-tight">{day.theme}</h3>
        </div>
      </div>
      <div className="space-y-3 pl-4 border-l-2 border-[#C9973B]/20 ml-5">
        {day.blocks.map((block, i) => (
          <BlockCard key={i} block={block} />
        ))}
      </div>
      {day.alternatives.length > 0 && (
        <div className="ml-5 pl-4">
          <button
            onClick={() => setShowAlts(!showAlts)}
            className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#C9973B] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {showAlts ? "Hide Alternatives" : `${day.alternatives.length} Alternatives Available`}
          </button>
          {showAlts && (
            <div className="mt-3 space-y-3 opacity-80 animate-in fade-in slide-in-from-left-2 duration-300">
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

function ArrivalCard({ support }: { support: PlannerResponse["arrivalSupport"] }) {
  if (!support.airportPickupRecommended && !support.simRecommended && !support.currencyExchangeRecommended) return null;
  return (
    <div className="bg-gradient-to-br from-[#1A1612] to-[#2D2823] rounded-3xl p-6 space-y-4 border border-[#C9973B]/30 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
         <Plane className="w-20 h-20 text-[#C9973B]" />
      </div>
      <div className="flex items-center gap-2 relative z-10">
        <div className="w-8 h-8 bg-[#C9973B] rounded-xl flex items-center justify-center">
            <Plane className="w-4 h-4 text-[#1A1612]" />
        </div>
        <h3 className="text-xs font-black text-white uppercase tracking-widest">Arrival Essentials</h3>
      </div>
      <div className="grid grid-cols-3 gap-3 relative z-10">
        {[
            { tag: "Pickup", icon: <Plane className="w-4 h-4" />, show: support.airportPickupRecommended, label: "Airport Pickup" },
            { tag: "SIM", icon: <Wifi className="w-4 h-4" />, show: support.simRecommended, label: "Local SIM" },
            { tag: "Cash", icon: <CreditCard className="w-4 h-4" />, show: support.currencyExchangeRecommended, label: "Exchange ETB" }
        ].filter(x => x.show).map((item, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-md rounded-2xl p-3 flex flex-col items-center gap-1.5 text-center border border-white/5">
            <div className="text-[#C9973B]">{item.icon}</div>
            <span className="text-[9px] font-black text-white uppercase tracking-tighter">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="space-y-1 relative z-10">
        {support.notes.map((note, i) => (
          <div key={i} className="flex items-start gap-2">
            <CheckCircle className="w-3 h-3 text-[#C9973B] shrink-0 mt-0.5" />
            <p className="text-[10px] text-gray-300 font-medium leading-relaxed">{note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

interface PlanClientProps {
  initialData: PlannerResponse | null;
  initialError: string | null;
  initialQuery: string;
}

export function PlanClient({ initialData, initialError, initialQuery }: PlanClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  
  const [query, setQuery] = useState(initialQuery);
  const [result, setResult] = useState<PlannerResponse | null>(initialData);
  const [error, setError] = useState<string | null>(initialError);
  
  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleGenerate = async (q: string) => {
    if (!q.trim()) return;
    setQuery(q);
    setError(null);
    
    // Update URL without reloading
    const url = new URL(window.location.href);
    url.searchParams.set("q", q);
    window.history.pushState({}, "", url.toString());

    startTransition(async () => {
        try {
            const res = await generateItinerary(q);
            if ("error" in res) {
                setError(res.error);
                setResult(null);
            } else {
                setResult(res);
                setIsSaved(false); // Reset saved status for new plan
            }
        } catch (e) {
            setError("Something went wrong. Please try again.");
        }
    });
  };

  const handleSave = async () => {
    if (!user) {
        alert("Please sign in to save itineraries.");
        return;
    }
    if (!result) return;
    
    setIsSaving(true);
    const res = await saveItineraryAction(user.id, result);
    setIsSaving(false);
    
    if (res.success) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    } else {
        alert(res.error);
    }
  };

  const handleShare = async () => {
    if (!result) return;
    const shareData = {
        title: `${result.tripSummary.days}-Day Plan for ${result.tripSummary.destination}`,
        text: `Check out my travel plan for ${result.tripSummary.destination} on NU Ethiopia!`,
        url: window.location.href
    };
    try {
        await navigator.share(shareData);
    } catch (e) {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-24 font-sans">
      {/* Header */}
      <div className="bg-[#1A1612] px-5 pt-12 pb-12 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-[-50px] right-[-50px] w-96 h-96 bg-[#C9973B]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-[#C9973B]/5 rounded-full blur-[100px]" />
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                 <RefreshCw className="w-5 h-5 text-[#C9973B]" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">AI Road Trip</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                  <Sparkles className="w-3 h-3 text-[#C9973B]" />
                  <p className="text-[#C9973B] text-[10px] font-black uppercase tracking-widest">Grounded in NU DB</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-2 rounded-[2rem] border border-white/10 shadow-2xl">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="E.g. 5 days coffee and history in Addis..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate(query)}
                className="flex-1 px-5 py-4 text-sm font-bold text-white bg-transparent focus:outline-none placeholder-white/20"
              />
              <button
                onClick={() => handleGenerate(query)}
                disabled={isPending || !query.trim()}
                className="bg-[#C9973B] text-[#1A1612] w-14 h-14 rounded-2xl disabled:opacity-50 hover:bg-white transition-all transform active:scale-95 flex items-center justify-center shadow-lg hover:shadow-[#C9973B]/20"
              >
                {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowRight className="w-6 h-6" />}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => handleGenerate(p.query)}
                className="bg-white/5 hover:bg-[#C9973B]/20 border border-white/10 hover:border-[#C9973B]/40 text-gray-400 hover:text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 mt-[-2rem] max-w-2xl mx-auto space-y-6 relative z-20">
        {isPending ? (
          <PlanSkeleton />
        ) : error ? (
          <div className="bg-red-50 border border-red-100 rounded-[2.5rem] p-8 text-center space-y-4 shadow-sm animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center mx-auto text-red-500">
               <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
                <h3 className="text-base font-black text-gray-900 uppercase">Oops! Something failed</h3>
                <p className="text-xs text-red-600 font-bold leading-relaxed">{error}</p>
            </div>
            <button 
                onClick={() => handleGenerate(query)}
                className="inline-flex items-center gap-2 bg-[#1A1612] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
            >
                <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </div>
        ) : result ? (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-6">
            {/* Action Bar */}
            <div className="flex gap-2">
                <button 
                    onClick={handleSave}
                    disabled={isSaving || isSaved}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${isSaved ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-white text-gray-900 border border-gray-100'}`}
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : isSaved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {isSaved ? "Saved to Journal" : "Save Plan"}
                </button>
                <button 
                    onClick={handleShare}
                    className="aspect-square bg-white border border-gray-100 flex items-center justify-center rounded-[1.5rem] w-[56px] text-[#C9973B] hover:bg-gray-50 transition-all shadow-sm"
                >
                    <Share2 className="w-5 h-5" />
                </button>
            </div>

            {/* Content Summary */}
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <ConfidenceDot level={result.confidenceSummary.overall} />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{result.confidenceSummary.overall} Confidence</span>
                    </div>
                    <h2 className="text-xl font-black text-[#1A1612] tracking-tighter leading-none mb-2">
                      {result.tripSummary.days}-Day {result.tripSummary.travelStyle}
                    </h2>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                       {result.tripSummary.destination} · {result.tripSummary.budget}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-6">
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center">
                        <p className="text-xl font-black text-gray-900">{result.tripSummary.days}</p>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Days</p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center">
                        <p className="text-xl font-black text-[#C9973B]">{result.confidenceSummary.groundedPlaceCount}</p>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Places</p>
                    </div>
                    <div className="bg-[#1A1612] rounded-2xl p-4 text-center">
                        <p className="text-xl font-black text-[#C9973B]">{result.confidenceSummary.totalSlots}</p>
                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Stops</p>
                    </div>
                </div>
            </div>

            <ArrivalCard support={result.arrivalSupport} />

            {/* Itinerary */}
            <div className="space-y-12 py-4">
                {result.days.map((day) => (
                    <DayCard key={day.dayNumber} day={day} />
                ))}
            </div>

            {/* Warnings/Context */}
            {result.warnings.length > 0 && (
              <div className="bg-amber-50 border border-amber-100 rounded-[2.5rem] p-6 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                   <AlertCircle className="w-4 h-4 text-amber-500" />
                   <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Planning Notes</h4>
                </div>
                {result.warnings.map((w, i) => (
                  <p key={i} className="text-[11px] text-amber-800 font-bold leading-relaxed">• {w}</p>
                ))}
              </div>
            )}

            {/* Footnote */}
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 text-center space-y-4">
                <Shield className="w-10 h-10 text-[#C9973B] mx-auto opacity-50" />
                <div className="space-y-1">
                    <h3 className="text-sm font-black uppercase tracking-widest">NU Trust Promise</h3>
                    <p className="text-[11px] text-gray-400 font-medium leading-relaxed max-w-xs mx-auto">
                        Every activity is verified against real local listings. No hallucinations of non-existent shops or museums.
                    </p>
                </div>
                <button 
                  onClick={() => { setQuery(""); setResult(null); setError(null); router.push("/plan"); }}
                  className="text-[10px] font-black text-[#C9973B] uppercase tracking-[0.2em] hover:text-[#1A1612] transition-colors"
                >
                   Start New Discovery
                </button>
            </div>
          </div>
        ) : (
          /* Empty/Hero State */
          <div className="py-20 text-center space-y-8 animate-in slide-in-from-bottom-2 duration-500">
            <div className="space-y-2">
                <div className="w-20 h-20 bg-[#C9973B]/10 rounded-[2.5rem] flex items-center justify-center mx-auto transform rotate-12">
                   <Sparkles className="w-10 h-10 text-[#C9973B]" />
                </div>
                <h2 className="text-2xl font-black text-[#1A1612] tracking-tighter uppercase italic pt-4">Plan Your Adventure</h2>
                <p className="text-xs text-gray-400 font-bold tracking-widest uppercase max-w-xs mx-auto">
                    300+ Verified Places · Real-time AI ranking
                </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => handleGenerate(p.query)}
                  className="bg-white border border-gray-100 rounded-[2rem] p-6 text-left shadow-sm hover:border-[#C9973B]/50 hover:shadow-xl transition-all active:scale-[0.98] group"
                >
                  <p className="text-xs font-black text-gray-900 mb-1 group-hover:text-[#C9973B] transition-colors">{p.label}</p>
                  <p className="text-[10px] text-gray-400 font-bold leading-relaxed line-clamp-2">{p.query}</p>
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
