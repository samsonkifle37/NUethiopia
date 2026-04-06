"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  ShieldCheck, AlertTriangle, AlertCircle, 
  ChevronDown, ChevronUp, Clock, Info, ShieldAlert,
  MapPin, PhoneCall, RefreshCcw
} from "lucide-react";
import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";

interface StatusItem {
  id: string;
  region: string;
  status: "GREEN" | "YELLOW" | "RED";
  summary: string;
  details: string;
  lastUpdated: string;
}

const statusConfig = {
  GREEN: { icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50", label: "Safe for travel" },
  YELLOW: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50", label: "Caution advised" },
  RED: { icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-50", label: "Avoid travel" },
};

export default function SafetyHub() {
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["safety-status"],
    queryFn: async () => {
      const res = await fetch("/api/safety/status");
      const d = await res.json();
      return d.statuses as StatusItem[];
    },
    staleTime: 5 * 60 * 1000, // 5 min cache
  });

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-24 font-sans">
      {/* Header */}
      <div className="bg-[#1A1612] pt-16 pb-20 px-6 rounded-b-[3.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-[-50px] right-[-50px] w-96 h-96 bg-[#C9973B]/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#C9973B] rounded-2xl flex items-center justify-center shadow-lg shadow-[#C9973B]/20">
              <ShieldCheck className="w-6 h-6 text-[#1A1612]" />
            </div>
            <div>
                <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">Safety Dashboard</h1>
                <p className="text-[#C9973B] text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Situational Awareness</p>
            </div>
          </div>
          <p className="text-gray-400 text-xs font-medium leading-relaxed max-w-sm">
            Get the latest situational status across Ethiopia's major traveler destinations, updated by the NU Intelligence Unit.
          </p>
        </div>
      </div>

      <div className="px-6 mt-[-3rem] max-w-2xl mx-auto space-y-6 relative z-20">
        {/* Quick Actions / Emergency */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
                    <PhoneCall className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                    <h4 className="text-[11px] font-black uppercase text-gray-900 tracking-widest leading-none mb-1">Emergency Numbers</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Dial 991 or 911 for Police</p>
                </div>
            </div>
            <button 
                onClick={() => refetch()}
                className={`p-2 rounded-xl border border-gray-100 transition-all ${isRefetching ? 'animate-spin border-emerald-500' : 'hover:bg-gray-50'}`}
            >
                <RefreshCcw className="w-4 h-4 text-gray-400" />
            </button>
        </div>

        {/* Status List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Regional Status</h3>
            <div className="flex items-center gap-1.5 opacity-60">
                <Clock className="w-3 h-3" />
                <span className="text-[10px] font-bold">Updated Real-time</span>
            </div>
          </div>

          {isLoading ? (
            [1, 2, 3].map(n => (
              <div key={n} className="h-24 bg-white rounded-3xl animate-pulse border border-gray-50" />
            ))
          ) : (
            data?.map((item) => {
              const config = statusConfig[item.status];
              const isExpanded = expandedRegion === item.region;
              
              return (
                <div 
                  key={item.region}
                  className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-[#C9973B]/30 shadow-xl' : 'border-gray-50 shadow-sm'}`}
                >
                  <button 
                    onClick={() => setExpandedRegion(isExpanded ? null : item.region)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${config.bg} rounded-2xl flex items-center justify-center shrink-0`}>
                        <config.icon className={`w-6 h-6 ${config.color}`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">{item.region}</h4>
                        <div className="flex items-center gap-1.5">
                            <span className={`text-[9px] font-black uppercase tracking-wider ${config.color}`}>{config.label}</span>
                        </div>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-300" /> : <ChevronDown className="w-4 h-4 text-gray-300" />}
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-6 border-t border-gray-50 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-start gap-3 mb-4">
                        <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-gray-600 font-bold leading-relaxed">{item.summary}</p>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-4">
                        <p className="text-[10px] text-gray-500 font-medium leading-relaxed italic">
                         {item.details}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between opacity-50">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            Updated: {new Date(item.lastUpdated).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <ShieldAlert className="w-3 h-3" />
                          <span className="text-[9px] font-black uppercase tracking-widest">NU intelligence Unit</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Offline / Help Footnote */}
        <div className="bg-[#1A1612] rounded-[2.5rem] p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto">
                <MapPin className="w-6 h-6 text-[#C9973B]" />
            </div>
            <h3 className="text-white text-base font-black uppercase italic tracking-tighter">Stay Connected</h3>
            <p className="text-gray-400 text-xs font-medium leading-relaxed max-w-[240px] mx-auto">
                Always check with your local host or consulate for area-specific updates. This data is illustrative and verified by NU moderators.
            </p>
            <button className="text-[#C9973B] text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
                Contact Global Support →
            </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
