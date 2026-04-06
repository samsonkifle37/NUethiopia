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
        <div className="w-full bg-white/5 backdrop-blur-2xl p-1.5 sm:p-2 rounded-[2.5rem] border border-white/10 shadow-2xl group transition-all focus-within:border-[#C9973B]/50">
          <div className="flex items-center gap-2 sm:gap-3 p-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#C9973B] rounded-2xl flex items-center justify-center shrink-0 shadow-xl shadow-[#C9973B]/20">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#1A1612]" />
            </div>
            <input 
              type="text" 
              placeholder={tr("home","placeholder")} 
              className="flex-1 min-w-0 bg-transparent text-white text-sm sm:text-base px-1 sm:px-2 placeholder-white/20 focus:outline-none font-bold"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (window.location.href=`/plan?q=${encodeURIComponent(prompt)}`)}
            />
            <Link 
                href={`/plan${prompt ? `?q=${encodeURIComponent(prompt)}` : ''}`} 
                className="bg-white text-[#1A1612] px-4 sm:px-6 py-3 sm:py-4 rounded-2xl hover:bg-[#C9973B] transition-all shrink-0 text-[10px] sm:text-[11px] font-black uppercase tracking-widest flex items-center gap-1"
            >
               <span className="hidden xs:inline">Plan</span> <ArrowRight className="w-3.5 h-3.5" />
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

function JustLandedSection() {
    const essentials = [
        { label: "AIRPORT PICKUP", icon: Plane, href: "/transport#airport-pickup" },
        { label: "LOCAL SIM", icon: Wifi, href: "/sim" },
        { label: "EXCHANGE ETB", icon: Banknote, href: "/currency" }
    ];

    return (
        <div className="px-6 py-4 animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
            <div className="bg-[#1A1612] rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden border border-[#C9973B]/20">
                {/* Background Plane Decoration */}
                <Plane className="absolute top-[-20px] right-[-20px] w-48 h-48 text-white opacity-[0.03] -rotate-12 pointer-events-none" />
                
                {/* Header */}
                <div className="flex items-center gap-4 mb-8 relative z-10">
                    <div className="w-12 h-12 bg-[#C9973B] rounded-2xl flex items-center justify-center shadow-lg shadow-[#C9973B]/20">
                        <Plane className="w-6 h-6 text-[#1A1612]" />
                    </div>
                    <h2 className="text-xl font-black text-white uppercase tracking-[0.2em] italic">Just landed</h2>
                </div>

                {/* Action Buttons Grid */}
                <div className="grid grid-cols-3 gap-3 relative z-10 mb-8">
                    {essentials.map((item) => (
                        <Link 
                            key={item.label} 
                            href={item.href}
                            className="bg-white/5 border border-white/10 p-5 rounded-[2rem] flex flex-col items-center gap-3 transition-all duration-300 hover:bg-white/10 hover:border-[#C9973B]/40 group/btn active:scale-95 text-center focus:ring-2 focus:ring-[#C9973B]/50 outline-none"
                        >
                            <div className="w-10 h-10 bg-[#C9973B]/10 rounded-xl flex items-center justify-center group-hover/btn:scale-110 transition-transform">
                                <item.icon className="w-5 h-5 text-[#C9973B]" />
                            </div>
                            <span className="text-[9px] font-black text-white/80 uppercase tracking-widest leading-tight group-hover/btn:text-white transition-colors">{item.label}</span>
                        </Link>
                    ))}
                </div>

                {/* Info List */}
                <div className="space-y-3 relative z-10 pt-2 border-t border-white/5">
                    {[
                        "Bole Airport is busy; we recommend pre-booking a pickup.",
                        "Get an Ethio Telecom SIM card at the airport arrival hall.",
                        "Use official bank exchange desks for Ethiopian Birr (ETB)."
                    ].map((text, i) => (
                        <div key={i} className="flex gap-3 items-start group/info">
                            <div className="w-5 h-5 rounded-full bg-[#C9973B]/10 border border-[#C9973B]/20 flex items-center justify-center shrink-0 mt-0.5 group-hover/info:bg-[#C9973B]/20 transition-colors">
                                <ShieldCheck className="w-3 h-3 text-[#C9973B]" />
                            </div>
                            <p className="text-[11px] text-gray-300 font-medium leading-relaxed italic">{text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function WhatsHappeningSection() {
    return (
        <div className="px-6 space-y-8 py-4">
            <div className="flex justify-between items-end px-2">
                <div className="space-y-1">
                    <p className="text-[9px] font-black text-[#C9973B] uppercase tracking-[0.3em]">Live Context</p>
                    <h2 className="text-2xl font-black text-[#1A1612] uppercase tracking-tighter italic">What's happening now</h2>
                </div>
                <div className="flex items-center gap-1.5 opacity-40">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Addis Live</span>
                </div>
            </div>
            
            <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">Live Now</span>
                </div>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-2">
                    {[
                        { title: "Ethio-Jazz Night", loc: "Fendika Center", tag: "LIVE", time: "Tonight", img: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2128&auto=format&fit=crop" },
                        { title: "Art Expo 2024", loc: "National Museum", tag: "POPULAR", time: "Now", img: "https://images.unsplash.com/photo-1544413647-795175a95444?q=80&w=1974&auto=format&fit=crop" }
                    ].map((event) => (
                        <Link key={event.title} href="/tours" className="shrink-0 w-72 bg-[#1A1612] rounded-[3rem] overflow-hidden relative group shadow-2xl shadow-[#1A1612]/20">
                            <div className="aspect-[16/10] sm:h-44 relative">
                                <img src={event.img} alt={event.title} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1612] via-transparent to-transparent" />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="bg-rose-600 text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">{event.tag}</span>
                                    <span className="bg-white/10 backdrop-blur-md text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">{event.time}</span>
                                </div>
                            </div>
                            <div className="p-6 space-y-2">
                                <h4 className="text-base font-black text-white uppercase tracking-tight line-clamp-1">{event.title}</h4>
                                <div className="flex items-center gap-1.5 opacity-60">
                                    <MapPin className="w-3.5 h-3.5 text-[#C9973B]" />
                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">{event.loc}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Curated Picks</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                     {[
                        { title: "Traditional Coffee Ceremony", sub: "Authentic Heritage Experience", tag: "CULTURAL", icon: UtensilsCrossed, color: "bg-orange-50", tColor: "text-orange-500" },
                        { title: "Sunday Entoto Hikes", sub: "Best viewpoints in the city", tag: "WEEKEND", icon: Map, color: "bg-blue-50", tColor: "text-blue-500" }
                    ].map((pick) => (
                        <Link 
                            key={pick.title} 
                            href={pick.title.includes("Coffee") ? "/tours?search=coffee" : "/tours?search=hiking"}
                            className="bg-white p-5 rounded-[2.5rem] border border-gray-100 flex items-center justify-between group shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 ${pick.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <pick.icon className={`w-5 h-5 ${pick.tColor}`} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-[#1A1612] uppercase tracking-tight">{pick.title}</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{pick.sub}</p>
                                </div>
                            </div>
                            <span className="text-[8px] font-black text-gray-400 border border-gray-100 px-2.5 py-1.5 rounded-full uppercase tracking-widest group-hover:bg-[#1A1612] group-hover:text-white transition-all">
                                {pick.tag}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ThisWeekSection() {
    return (
        <div className="px-6 space-y-6 py-4">
             <div className="flex justify-between items-end px-2">
                <div className="space-y-1">
                    <p className="text-[9px] font-black text-[#C9973B] uppercase tracking-[0.3em]">Plan Ahead</p>
                    <h2 className="text-2xl font-black text-[#1A1612] uppercase tracking-tighter italic">This Week in Addis</h2>
                </div>
            </div>
            
            <Link href="/calendar" className="block bg-[#1A1612] rounded-[3.5rem] p-8 shadow-2xl relative overflow-hidden group active:scale-[0.98] transition-all">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#C9973B]/5 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-1000" />
                
                {/* Weather Strip */}
                <div className="flex justify-between items-center px-4 mb-8 border-b border-white/5 pb-8">
                    {[
                        { day: "Today", temp: "24°C", icon: "☀️" },
                        { day: new Date(Date.now() + 86400000).toLocaleDateString('en-US', { weekday: 'short' }), temp: "23°C", icon: "🌤️" },
                        { day: new Date(Date.now() + 172800000).toLocaleDateString('en-US', { weekday: 'short' }), temp: "25°C", icon: "☀️" },
                    ].map((w) => (
                        <div key={w.day} className="flex flex-col items-center gap-2">
                            <span className="text-[10px] font-black text-[#C9973B] uppercase tracking-[0.2em]">{w.day}</span>
                            <span className="text-2xl drop-shadow-lg">{w.icon}</span>
                            <span className="text-[12px] font-black text-white">{w.temp}</span>
                        </div>
                    ))}
                </div>

                {/* Weekly Highlights */}
                <div className="space-y-4">
                    {[
                        { event: "Selam Music Fest", type: "FRI-SUN", icon: Sparkles, badge: "FESTIVAL" },
                        { event: "Buna Coffee Markets", type: "TUE-WED", icon: UtensilsCrossed, badge: "LOCAL" }
                    ].map((item) => (
                        <div key={item.event} className="bg-white/5 rounded-3xl p-5 flex items-center justify-between border border-white/5 group-hover:border-[#C9973B]/30 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 bg-[#C9973B]/20 rounded-lg flex items-center justify-center">
                                    <item.icon className="w-4 h-4 text-[#C9973B]" />
                                </div>
                                <div>
                                    <h4 className="text-[12px] font-black text-white uppercase tracking-tight">{item.event}</h4>
                                    <p className="text-[9px] font-black text-[#C9973B] opacity-50 uppercase tracking-[0.2em] mt-0.5">{item.type}</p>
                                </div>
                            </div>
                            <span className="text-[8px] font-black text-white/40 border border-white/10 px-2.5 py-1 rounded-full uppercase tracking-widest">{item.badge}</span>
                        </div>
                    ))}
                </div>
                
                <div className="mt-8 flex justify-center">
                     <p className="text-[9px] text-white/30 font-black uppercase tracking-[0.4em] group-hover:text-[#C9973B] transition-colors">Full Event Calendar →</p>
                </div>
            </Link>
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
                  <div className="relative aspect-square sm:h-56 overflow-hidden">
                  <VerifiedImage
                    src={getPrimaryVerifiedImage(place)}
                    alt={place.name}
                    className="w-full h-full group-hover:scale-110 transition-transform duration-1000 ease-out object-cover"
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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-32">
      <HeroSection />
      <TrustStrip />
      
      <div className="space-y-16 pb-12 overflow-hidden">
        <JustLandedSection />
        <WhatsHappeningSection />
        <ThisWeekSection />
        <FeaturedStays />
        
        {/* Experience Section (Simulated) */}
        <div className="px-6">
            <h3 className="text-[10px] font-black text-[#C9973B] uppercase tracking-[0.3em] px-2 mb-4">Discovery</h3>
            <div className="bg-[#1A1612] rounded-[3.5rem] p-10 text-center space-y-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=2073&auto=format&fit=crop')] opacity-10 bg-cover bg-center grayscale" />
                <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter relative z-10 leading-tight">
                    Immersion Mode <br/> <span className="text-[#C9973B]">Wildlife & Flora</span>
                </h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] relative z-10 max-w-[200px] mx-auto leading-relaxed">
                    Identify Ethiopia's unique nature with your camera.
                </p>
                <Link href="/identify" className="inline-block bg-[#C9973B] text-[#1A1612] px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] relative z-10 shadow-2xl shadow-[#C9973B]/20 active:scale-95 transition-all">
                    Open Camera
                </Link>
            </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
