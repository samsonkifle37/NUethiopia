"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Sparkles, MapPin, Plus } from "lucide-react";

interface DiscoveryPost {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  user: { name: string };
}

interface DiscoverySectionProps {
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
}

export function DiscoverySection({ 
  title = "Local Secrets", 
  subtitle = "Discover hidden spots shared by travelers",
  showHeader = true 
}: DiscoverySectionProps) {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["discovery-posts"],
    queryFn: async () => {
      const res = await fetch("/api/discovery?limit=10");
      if (!res.ok) return [];
      const d = await res.json();
      return d.posts || [];
    }
  });

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex justify-between items-end px-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C9973B]" />
              <p className="text-[9px] font-black text-[#C9973B] uppercase tracking-[0.3em]">Gems in Addis</p>
            </div>
            <h2 className="text-2xl font-black text-[#1A1612] uppercase tracking-tighter italic">✨ {title}</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{subtitle}</p>
          </div>
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 px-2">
        {(posts || []).map((post: DiscoveryPost) => (
          <Link key={post.id} href={`/discover/${post.id}`} className="shrink-0 w-64 relative aspect-[4/5] rounded-[2rem] overflow-hidden group shadow-sm bg-gray-100 border border-gray-50 flex flex-col hover:-translate-y-2 transition-all duration-500">
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-left">
              <p className="text-white text-sm font-black uppercase tracking-tight line-clamp-2 mb-1">{post.title}</p>
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 bg-[#C9973B] rounded-lg">
                   <span className="text-black text-[8px] font-black uppercase tracking-widest">{post.category}</span>
                </div>
                <div className="flex items-center gap-1 opacity-60">
                   <MapPin className="w-2.5 h-2.5 text-white" />
                   <span className="text-white text-[8px] font-black uppercase tracking-[0.2em]">{post.user.name}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {/* Fallback mock if empty */}
        {(!posts || posts.length === 0) && !isLoading && [
          { id: '1', title: 'Sunset at Entoto', cat: 'VIEW', img: 'https://images.unsplash.com/photo-1624314138470-5a2f24623f10?q=80&w=2070&auto=format&fit=crop', user: { name: 'Local Guide' } },
          { id: '2', title: 'Best Buna in Bole', cat: 'COFFEE', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop', user: { name: 'Abeba' } }
        ].map((mock) => (
          <Link key={mock.id} href="/tours#gems" className="shrink-0 w-64 relative aspect-[4/5] rounded-[2rem] overflow-hidden group shadow-sm bg-gray-100 border border-gray-50 flex flex-col hover:-translate-y-2 transition-all duration-500">
            <img src={mock.img} alt={mock.title} className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-1000 ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-left">
              <p className="text-white text-sm font-black uppercase tracking-tight mb-1">{mock.title}</p>
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 bg-[#C9973B] rounded-lg">
                   <span className="text-black text-[8px] font-black uppercase tracking-widest">{mock.cat}</span>
                </div>
                <div className="flex items-center gap-1 opacity-60">
                   <MapPin className="w-2.5 h-2.5 text-white" />
                   <span className="text-white text-[8px] font-black uppercase tracking-[0.2em]">{mock.user.name}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}

        <Link href="/discover/upload" className="shrink-0 w-64 relative aspect-[4/5] rounded-[2rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-4 bg-white hover:bg-gray-50 transition-all group active:scale-95">
          <div className="w-16 h-16 bg-[#1A1612] rounded-[1.5rem] flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-transform">
            <Plus className="w-8 h-8 text-[#C9973B]" />
          </div>
          <div className="text-center px-4">
            <span className="text-[12px] font-black text-[#1A1612] uppercase tracking-[0.2em] block mb-1">Found a Secret?</span>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">+ Share Your Gem</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
