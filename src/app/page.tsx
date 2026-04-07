"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n";
import Link from "next/link";
import { VerifiedImage } from "@/components/media/VerifiedImage";
import { getPrimaryVerifiedImage } from "@/lib/images";
import { useQuery } from "@tanstack/react-query";
import { 
  Sparkles, BedDouble, Map, UtensilsCrossed, ArrowRight, Star, MapPin, Plane, 
  Car, Wifi, Banknote, Compass, Navigation, ShieldCheck, Plus
} from "lucide-react";
import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { useCalendar } from "@/contexts/CalendarContext";
import { useCurrency } from "@/contexts/CurrencyContext";

// ── Shared UI Utilities ──────────────────────

function PageSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`w-full max-w-2xl mx-auto px-4 ${className}`}>
      {children}
    </div>
  );
}

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
    <div className="relative pt-20 pb-20 rounded-b-[4rem] bg-[#1A1612] overflow-hidden shadow-3xl">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=2073&auto=format&fit=crop')] opacity-20 bg-cover bg-center grayscale" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1612]/60 via-[#1A1612] to-[#1A1612]" />
      
      {/* Animated Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9973B]/10 rounded-full blur-[120px] animate-pulse" />
      
      <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-2xl mx-auto px-4">
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
        <PageSection className="animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
            <div className="bg-[#1A1612] rounded-2xl p-5 shadow-sm relative overflow-hidden border border-[#C9973B]/20">
                {/* Background Plane Decoration */}
                <Plane className="absolute top-[-20px] right-[-20px] w-48 h-48 text-white opacity-[0.03] -rotate-12 pointer-events-none" />
                
                {/* Header */}
                <div className="flex items-center gap-4 mb-6 relative z-10">
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
                            className="bg-white/5 border border-white/10 p-3 rounded-2xl flex flex-col items-center gap-3 transition-all duration-300 hover:bg-white/10 hover:border-[#C9973B]/40 group/btn active:scale-95 text-center focus:ring-2 focus:ring-[#C9973B]/50 outline-none"
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
        </PageSection>
    );
}

function GemsInAddisSection() {
    const { data: posts, isLoading } = useQuery({
        queryKey: ["discovery-posts"],
        queryFn: async () => {
            const res = await fetch("/api/discovery?limit=5");
            if (!res.ok) return [];
            const d = await res.json();
            return d.posts || [];
        }
    });

    return (
        <PageSection className="space-y-6">
            <div className="flex justify-between items-end px-2">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#C9973B]" />
                        <p className="text-[9px] font-black text-[#C9973B] uppercase tracking-[0.3em]">Gems in Addis</p>
                    </div>
                    <h2 className="text-2xl font-black text-[#1A1612] uppercase tracking-tighter italic">✨ Local Secrets</h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Discover hidden spots shared by travelers</p>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-1">
                {(posts || []).map((post: any) => (
                    <Link key={post.id} href={`/discover/${post.id}`} className="relative aspect-[4/5] rounded-2xl overflow-hidden group shadow-sm bg-gray-100 border border-gray-50">
                        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 text-left">
                            <p className="text-white text-[10px] font-black uppercase tracking-tight line-clamp-1">{post.title}</p>
                            <div className="flex items-center gap-1 opacity-60">
                                <MapPin className="w-2.5 h-2.5 text-[#C9973B]" />
                                <span className="text-white text-[8px] font-black uppercase tracking-[0.2em]">{post.category}</span>
                            </div>
                        </div>
                    </Link>
                ))}
                
                {/* Fallback mock if empty for visual demo */}
                {(!posts || posts.length === 0) && [
                    { id: '1', title: 'Sunset at Entoto', cat: 'VIEW', img: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=2073&auto=format&fit=crop' },
                    { id: '2', title: 'Best Buna in Bole', cat: 'COFFEE', img: 'https://images.unsplash.com/photo-1544413647-795175a95444?q=80&w=1974&auto=format&fit=crop' }
                ].slice(0, posts?.length || 2).map((mock) => (
                    <Link key={mock.id} href="/discover" className="relative aspect-[4/5] rounded-2xl overflow-hidden group shadow-sm bg-gray-100 border border-gray-50">
                        <img src={mock.img} alt={mock.title} className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 text-left">
                            <p className="text-white text-[10px] font-black uppercase tracking-tight">{mock.title}</p>
                            <span className="text-[#C9973B] text-[8px] font-black uppercase tracking-widest">{mock.cat}</span>
                        </div>
                    </Link>
                ))}

                {/* ADD CTA CARD */}
                <Link href="/discover/upload" className="relative aspect-[4/5] rounded-2xl overflow-hidden border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-3 bg-white hover:bg-gray-50 transition-all group active:scale-95">
                    <div className="w-12 h-12 bg-[#1A1612] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6 text-[#C9973B]" />
                    </div>
                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">+ Share Gem</span>
                </Link>
            </div>
        </PageSection>
    );
}

function ThisWeekSection() {
    const { formatDate } = useCalendar();
    return (
        <PageSection className="space-y-6">
             <div className="flex justify-between items-end px-2">
                <div className="space-y-1">
                    <p className="text-[9px] font-black text-[#C9973B] uppercase tracking-[0.3em]">Plan Ahead</p>
                    <h2 className="text-2xl font-black text-[#1A1612] uppercase tracking-tighter italic">This Week in Addis</h2>
                </div>
            </div>
            
            <Link href="/calendar" className="block bg-[#1A1612] rounded-2xl p-5 shadow-sm relative overflow-hidden group active:scale-[0.98] transition-all">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#C9973B]/5 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-1000" />
                
                {/* Weather Strip */}
                <div className="flex justify-between items-center px-4 mb-6 border-b border-white/5 pb-6">
                    {[
                        { day: "Today", date: new Date(), temp: "24°C", icon: "☀️" },
                        { day: "Tomorrow", date: new Date(Date.now() + 86400000), temp: "23°C", icon: "🌤️" },
                        { day: "Later", date: new Date(Date.now() + 172800000), temp: "25°C", icon: "☀️" },
                    ].map((w) => (
                        <div key={w.day} className="flex flex-col items-center gap-2">
                            <span className="text-[9px] font-black text-[#C9973B] uppercase tracking-[0.2em]">{w.day}</span>
                            <span className="text-2xl drop-shadow-lg">{w.icon}</span>
                            <div className="flex flex-col items-center">
                                <span className="text-[12px] font-black text-white">{w.temp}</span>
                                <span className="text-[7px] font-bold text-white/40 uppercase tracking-tighter">
                                    {formatDate(w.date)}
                                </span>
                            </div>
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
        </PageSection>
    );
}

function FeaturedStays() {
  const { tr } = useLanguage();
  const { formatPrice } = useCurrency();
  const { data, isLoading } = useQuery({
    queryKey: ["home-stays"],
    queryFn: () => fetchPlaces("hotel,guesthouse,apartment,resort", 4),
  });

  return (
    <PageSection className="space-y-4">
      <div className="flex justify-between items-end px-2">
        <div>
            <p className="text-[10px] font-black text-[#C9973B] uppercase tracking-[0.3em] mb-1">Accommodation</p>
            <h2 className="text-2xl font-black tracking-tighter text-[#1A1612] italic uppercase">Authentic Stays</h2>
        </div>
        <Link href="/stays" className="bg-gray-100 p-3 rounded-full hover:bg-[#C9973B] transition-all group">
          <ArrowRight className="w-5 h-5 group-hover:text-white" />
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 px-2">
        {isLoading
          ? [1, 2, 3].map((i) => (
            <div key={i} className="shrink-0 w-64 h-80 bg-gray-100 rounded-2xl animate-pulse" />
          ))
          : data?.places?.map((place: PlaceData) => (
              <Link key={place.id} href={`/place/${place.slug}`} className="shrink-0 w-72 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-50 group flex flex-col hover:-translate-y-2 transition-all duration-500">
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
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 text-gray-400">
                            <MapPin className="w-3 h-3 text-[#C9973B]" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{place.area || place.city}</span>
                        </div>
                        <span className="text-[10px] font-black text-[#C9973B] tracking-widest bg-[#C9973B]/5 px-2 py-0.5 rounded-full">
                            {formatPrice(450, "ETB")}+
                        </span>
                    </div>
                  </div>
              </Link>
            ))}
      </div>
    </PageSection>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-32">
      <HeroSection />
      <TrustStrip />
      
      <div className="space-y-6 pb-12 overflow-hidden">
        <JustLandedSection />
        <ThisWeekSection />
        <GemsInAddisSection />
        <FeaturedStays />
      </div>

      <BottomNav />
    </div>
  );
}
