"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n";
import Link from "next/link";
import { VerifiedImage } from "@/components/media/VerifiedImage";
import { getPrimaryVerifiedImage } from "@/lib/images";
import { useQuery } from "@tanstack/react-query";
import { 
  Sparkles, BedDouble, Map, UtensilsCrossed, ArrowRight, Star, MapPin, Plane, 
  Car, Wifi, Banknote, Compass, Navigation, ShieldCheck
} from "lucide-react";
import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";

// ── Shared Types ──────────────────────────────

interface PlaceData {
  id: string;
  slug: string;
  name: string;
  type: string;
  city: string;
  area: string;
  shortDescription: string | null;
  avgRating: number | null;
  images: { imageUrl: string; imageTruthType?: string }[];
  auditStatus?: "ok" | "missing" | "blocked" | "broken" | null;
  _count?: { reviews: number };
}

// ── Data Fetching ──────────────────────────────

async function fetchPlaces(types: string, limit: number) {
  const res = await fetch(`/api/places?type=${types}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

// ── Components ──────────────────────────────

function HeroSection() {
  const { tr, language } = useLanguage();
  const [prompt, setPrompt] = useState("");

  const rawHome = (translations[language] as any)?.home || translations.en.home;
  const suggestions = rawHome.suggestions || translations.en.home.suggestions;

  return (
    <div className="relative pt-20 pb-20 px-6 rounded-b-[4rem] bg-[#1A1612] overflow-hidden -mx-4 -mt-4 shadow-3xl">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=2073&auto=format&fit=crop')] opacity-20 bg-cover bg-center grayscale" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1612]/60 via-[#1A1612] to-[#1A1612]" />
      
      {/* Animated Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9973B]/10 rounded-full blur-[120px] animate-pulse" />
      
      <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-2xl mx-auto">
        <div className="flex flex-col items-center">
            <span 
                className="mb-2 block animate-in fade-in slide-in-from-top duration-1000"
                style={{ fontFamily: "'Noto Sans Ethiopic', serif", fontSize: "4.5rem", fontWeight: 900, color: "#C9973B", lineHeight: 1 }}
            >
                ኑ
            </span>
            <div className="flex items-center gap-2">
                <h1 className="text-4xl font-black tracking-[0.2em] text-white">NU</h1>
                <span className="h-4 w-[1px] bg-[#C9973B]/30" />
                <p className="text-[#C9973B] text-[11px] font-black uppercase tracking-[0.4em]">{tr("home","tagline")}</p>
            </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight uppercase italic tracking-tighter max-w-sm">
          {tr("home","hero")}
        </h2>

        {/* Unified Search/Plan Input */}
        <div className="w-full bg-white/5 backdrop-blur-2xl p-2 rounded-[2.5rem] border border-white/10 shadow-2xl group transition-all focus-within:border-[#C9973B]/50">
          <div className="flex items-center gap-3 p-1">
            <div className="w-12 h-12 bg-[#C9973B] rounded-2xl flex items-center justify-center shrink-0 shadow-xl shadow-[#C9973B]/20">
              <Sparkles className="w-6 h-6 text-[#1A1612]" />
            </div>
            <input 
              type="text" 
              placeholder={tr("home","placeholder")} 
              className="flex-1 bg-transparent text-white text-base px-2 placeholder-white/20 focus:outline-none font-bold"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (window.location.href=`/plan?q=${encodeURIComponent(prompt)}`)}
            />
            <Link 
                href={`/plan${prompt ? `?q=${encodeURIComponent(prompt)}` : ''}`} 
                className="bg-white text-[#1A1612] px-6 py-4 rounded-2xl hover:bg-[#C9973B] transition-all shrink-0 text-[11px] font-black uppercase tracking-widest"
            >
               Plan <ArrowRight className="w-4 h-4 inline ml-1" />
            </Link>
          </div>
        </div>

        {/* The 3 Core CTAs (Above the fold) */}
        <div className="grid grid-cols-3 gap-3 w-full animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
            <Link href="/stays" className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-[2rem] flex flex-col items-center gap-2 transition-all group">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BedDouble className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">Stays</span>
            </Link>
            <Link href="/tours" className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-[2rem] flex flex-col items-center gap-2 transition-all group">
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Compass className="w-5 h-5 text-orange-500" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">Tours</span>
            </Link>
            <Link href="/plan" className="bg-[#C9973B]/10 hover:bg-[#C9973B]/20 border border-[#C9973B]/30 p-4 rounded-[2rem] flex flex-col items-center gap-2 transition-all group">
                <div className="w-10 h-10 bg-[#C9973B]/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sparkles className="w-5 h-5 text-[#C9973B]" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-[#C9973B]">Roadtrip</span>
            </Link>
        </div>
      </div>
    </div>
  );
}

function TrustStrip() {
    return (
        <div className="flex items-center justify-between px-8 py-6 opacity-30 grayscale pointer-events-none">
            <div className="flex items-center gap-1.5 grayscale opacity-50">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-widest">Verified Data</span>
            </div>
            <div className="flex items-center gap-1.5 grayscale opacity-50">
                <Sparkles className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-widest">AI Ranked</span>
            </div>
            <div className="flex items-center gap-1.5 grayscale opacity-50">
                <MapPin className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-widest">Local Intel</span>
            </div>
        </div>
    );
}

function FeaturedStays() {
  const { tr } = useLanguage();
  const { data, isLoading } = useQuery({
    queryKey: ["home-stays"],
    queryFn: () => fetchPlaces("hotel,guesthouse,apartment,resort", 4),
  });

  return (
    <div className="mt-8 space-y-4 px-2">
      <div className="flex justify-between items-end px-4">
        <div>
            <p className="text-[10px] font-black text-[#C9973B] uppercase tracking-[0.3em] mb-1">Accommodation</p>
            <h2 className="text-2xl font-black tracking-tighter text-[#1A1612] italic uppercase">Authentic Stays</h2>
        </div>
        <Link href="/stays" className="bg-gray-100 p-3 rounded-full hover:bg-[#C9973B] transition-all group">
          <ArrowRight className="w-5 h-5 group-hover:text-white" />
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 px-4">
        {isLoading
          ? [1, 2, 3].map((i) => (
            <div key={i} className="shrink-0 w-64 h-80 bg-gray-100 rounded-[2.5rem] animate-pulse" />
          ))
          : data?.places?.map((place: PlaceData) => (
              <Link key={place.id} href={`/place/${place.slug}`} className="shrink-0 w-72 bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/30 overflow-hidden border border-gray-50 group flex flex-col hover:-translate-y-2 transition-all duration-500">
                <div className="relative h-56 overflow-hidden">
                  <VerifiedImage
                    src={getPrimaryVerifiedImage(place)}
                    alt={place.name}
                    className="w-full h-full group-hover:scale-110 transition-transform duration-1000 ease-out"
                    entityType={place.type as any}
                    showBadge={false}
                  />
                  <div className="absolute top-4 right-4 bg-white/95 px-3 py-1.5 rounded-full flex items-center gap-1 shadow-xl">
                    <Star className="w-3.5 h-3.5 text-[#C9973B] fill-[#C9973B]" />
                    <span className="text-[11px] font-black text-[#1A1612]">{place.avgRating ? place.avgRating.toFixed(1) : 'NEW'}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-base font-black text-[#1A1612] leading-tight line-clamp-1">{place.name}</h3>
                  <div className="flex items-center gap-1 text-gray-400 mt-2">
                    <MapPin className="w-3 h-3 text-[#C9973B]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{place.area || place.city}</span>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}

function QuickUtility() {
    return (
        <div className="px-6 grid grid-cols-2 gap-3 mt-4">
            <Link href="/emergency" className="bg-red-50 p-6 rounded-[2rem] flex flex-col gap-3 group border border-red-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-red-500" />
                </div>
                <div>
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-red-600">Assistance</h4>
                    <p className="text-[10px] text-red-400 font-bold">Emergency & Safety</p>
                </div>
            </Link>
            <Link href="/safety" className="bg-emerald-50 p-6 rounded-[2rem] flex flex-col gap-3 group border border-emerald-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Compass className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-emerald-600">Travel Status</h4>
                    <p className="text-[10px] text-emerald-400 font-bold">Regional Awareness</p>
                </div>
            </Link>
        </div>
    );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-32">
      <HeroSection />
      <TrustStrip />
      <div className="space-y-12">
        <FeaturedStays />
        <QuickUtility />
        
        {/* Safety Alert Banner */}
        <div className="px-6">
            <Link href="/safety" className="bg-white border border-gray-100 rounded-[2.5rem] p-6 flex items-center justify-between shadow-lg shadow-gray-200/40 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
                 <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-[#1A1612] uppercase tracking-tight">System Status: Stable</h3>
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Addis Ababa & Central Regions Safe</p>
                    </div>
                 </div>
                 <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-white" />
                 </div>
            </Link>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
