"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { 
  Building2, 
  Users, 
  Database, 
  ArrowUpRight, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  ChevronRight,
  ShieldCheck, 
  Zap, 
  Globe, 
  Image as ImageIcon,
  Star,
  FileText,
  RefreshCcw,
  Radio
} from "lucide-react";

const eventTypeConfig: Record<string, { label: string; color: string; icon: any }> = {
  USER_REGISTERED:   { label: "User Registered",    color: "bg-blue-50 text-blue-500",   icon: Users },
  LISTING_SUBMITTED: { label: "Listing Submitted",   color: "bg-amber-50 text-amber-500", icon: Building2 },
  REVIEW_POSTED:     { label: "Review Posted",       color: "bg-purple-50 text-purple-500", icon: Star },
  CLAIM_SUBMITTED:   { label: "Claim Submitted",     color: "bg-rose-50 text-rose-500",   icon: FileText },
  IMAGE_PROCESSED:   { label: "Image Processed",     color: "bg-green-50 text-green-500", icon: ImageIcon },
};

const statusColor: Record<string, string> = {
  VERIFIED:  "text-green-500",
  SUCCESS:   "text-green-500",
  APPROVED:  "text-green-500",
  PENDING:   "text-amber-500",
  REJECTED:  "text-red-500",
  SUBMITTED: "text-blue-500",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return "just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function AdminPage() {
  const [events, setEvents]   = useState<any[]>([]);
  const [stats,  setStats]    = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchActivity = useCallback(async () => {
    try {
      const res  = await fetch("/api/admin/activity");
      const data = await res.json();
      setEvents(data.events  || []);
      setStats(data.stats    || null);
      setLastRefresh(new Date());
    } catch {/* silent */}
    finally { setLoading(false); }
  }, []);

  // Initial fetch + auto-refresh every 30 seconds
  useEffect(() => {
    fetchActivity();
    const interval = setInterval(fetchActivity, 30000);
    return () => clearInterval(interval);
  }, [fetchActivity]);

  const statCards = stats ? [
    { title: "Total Users",       value: stats.users.toLocaleString(),          trend: "Live",          icon: Users,      color: "text-blue-500" },
    { title: "Active Stays",      value: stats.activeStays.toLocaleString(),     trend: "Live",          icon: Building2,  color: "text-[#D4AF37]" },
    { title: "Directory Items",   value: stats.directoryItems.toLocaleString(),  icon: Database,         color: "text-purple-500" },
    { title: "Pending Reviews",   value: stats.pendingReviews.toLocaleString(),  trend: stats.pendingReviews > 0 ? "Action Needed" : "All Clear", icon: Clock, color: stats.pendingReviews > 0 ? "text-red-500" : "text-green-500" },
  ] : [
    { title: "Total Users",     value: "—", icon: Users,     color: "text-blue-500" },
    { title: "Active Stays",    value: "—", icon: Building2, color: "text-[#D4AF37]" },
    { title: "Directory Items", value: "—", icon: Database,  color: "text-purple-500" },
    { title: "Pending Reviews", value: "—", icon: Clock,     color: "text-red-500" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-1 bg-[#D4AF37] rounded-full"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Pulse Monitor</span>
          </div>
          <h1 className="text-4xl font-black text-[#1A1612] tracking-tight">System Overview</h1>
          <p className="text-gray-400 font-medium">Monitoring NU Ethiopia ecosystem in real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <RefreshCcw className="w-3 h-3" />
            Last: {timeAgo(lastRefresh.toISOString())}
          </div>
          <button
            onClick={fetchActivity}
            className="flex items-center gap-2 px-4 py-2 bg-[#1A1612] text-[#D4AF37] rounded-xl text-[10px] font-black tracking-widest uppercase hover:opacity-80 transition"
          >
            <Radio className="w-3 h-3 fill-current animate-pulse" /> Live
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
              <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-[0.03] group-hover:opacity-[0.06] transition-all duration-700 ${stat.color.replace('text-', 'bg-')}`}></div>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-4 rounded-2xl ${stat.color.replace('text-', 'bg-')}/10`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                {stat.trend && (
                  <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                    stat.trend === 'Action Needed' ? 'bg-red-50 text-red-500' :
                    stat.trend === 'All Clear'     ? 'bg-green-50 text-green-500' :
                    'bg-green-50 text-green-500'
                  }`}>
                    <TrendingUp className="w-3 h-3" /> {stat.trend}
                  </div>
                )}
              </div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">{stat.title}</p>
              <h3 className={`text-3xl font-black tracking-tight ${loading ? 'text-gray-200 animate-pulse' : 'text-[#1A1612]'}`}>{stat.value}</h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Events Feed */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 text-[#1A1612]">
              <div className="relative">
                <Clock className="w-5 h-5 text-[#D4AF37]" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              </div>
              <h3 className="text-lg font-black tracking-tight uppercase border-b-2 border-[#D4AF37]/20 pb-1">Live Events</h3>
              <span className="text-[9px] font-black uppercase tracking-widest text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
                Auto-refresh 30s
              </span>
            </div>
            <button
              onClick={fetchActivity}
              className="text-xs font-bold text-gray-400 hover:text-[#1A1612] transition-colors flex items-center gap-1"
            >
              <RefreshCcw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          <div className="space-y-2">
            {loading ? (
              [1,2,3,4].map(i => (
                <div key={i} className="h-16 rounded-3xl bg-gray-100 animate-pulse" />
              ))
            ) : events.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-sm font-bold">No recent events found.</div>
            ) : events.map((event) => {
              const cfg  = eventTypeConfig[event.type] || eventTypeConfig['IMAGE_PROCESSED'];
              const Icon = cfg.icon;
              return (
                <div key={event.id} className="flex items-center justify-between p-4 rounded-3xl hover:bg-gray-50/50 transition-colors border border-transparent hover:border-gray-100 group">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${cfg.color} transition-transform group-hover:scale-110`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-[#1A1612] truncate max-w-[300px]">{event.name}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        {cfg.label} · {event.detail}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-[10px] font-black text-[#1A1612]">{timeAgo(event.time)}</p>
                    <p className={`text-[9px] font-black uppercase tracking-widest ${statusColor[event.status] || 'text-gray-400'}`}>
                      {event.status}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-8">
          <div className="bg-[#1A1612] rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#D4AF37] rounded-full opacity-10 group-hover:scale-125 transition-transform duration-1000"></div>
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <ShieldCheck className="text-[#D4AF37] w-6 h-6" /> Node Health
            </h3>
            <div className="space-y-6">
              {[
                { label: "DB Load (Supabase)", value: "2.4%", width: "24%", color: "bg-green-500" },
                { label: "Worker Efficiency",  value: "99.8%", width: "99%", color: "bg-[#D4AF37]" },
                { label: "Global CDN Sync",    value: "92%",  width: "92%", color: "bg-blue-500" },
              ].map(bar => (
                <div key={bar.label} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                    <span>{bar.label}</span><span>{bar.value}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full ${bar.color} transition-all duration-1000`} style={{ width: bar.width }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 pt-8 border-t border-white/5">
              <div className="flex items-center gap-3 text-white/40 text-[9px] font-bold uppercase tracking-[0.2em]">
                <Globe className="w-3 h-3" /> All systems operational
              </div>
            </div>
          </div>

          <Link href="/admin/foundry" className="block bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group border-l-4 border-l-[#D4AF37]">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-[#D4AF37]/5 group-hover:bg-[#D4AF37] transition-colors group-hover:rotate-6">
                <Zap className="w-6 h-6 text-[#D4AF37] group-hover:text-white transition-colors" />
              </div>
              <div>
                <h4 className="font-black text-[#1A1612] text-sm uppercase tracking-tight">Run Foundry Engine</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Start background ingestion</p>
              </div>
              <ArrowUpRight className="ml-auto w-5 h-5 text-gray-300 group-hover:text-[#1A1612] transition-colors" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
