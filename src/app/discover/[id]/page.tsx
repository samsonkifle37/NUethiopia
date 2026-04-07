import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MapPin, ArrowLeft, Share2, Heart, ExternalLink, User } from "lucide-react";
import Link from "next/link";

async function getPost(id: string) {
  return await (prisma as any).discoveryPost.findUnique({
    where: { id },
    include: {
      user: { select: { name: true } },
      place: { select: { slug: true, name: true } }
    }
  });
}

export default async function DiscoveryPostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-32">
       {/* Background Hero */}
       <div className="relative aspect-[4/5] sm:aspect-video w-full overflow-hidden bg-gray-100">
         <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
         
         <Link href="/" className="absolute top-12 left-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 text-white active:scale-90 transition-all">
           <ArrowLeft size={20} />
         </Link>
         
         <div className="absolute top-12 right-6 flex gap-3">
             <button className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 text-white active:scale-90 transition-all">
               <Share2 size={20} />
             </button>
         </div>

         <div className="absolute bottom-10 left-8 right-8 space-y-4">
            <div className="flex items-center gap-3">
                <span className="bg-[#C9973B] text-[#1A1612] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">{post.category}</span>
                <div className="flex items-center gap-2 text-white/60">
                    <User size={14} className="text-[#C9973B]" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{post.user?.name || "Explorer"}</span>
                </div>
            </div>
            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">{post.title}</h1>
            <div className="flex items-center gap-2 text-white/80">
                <MapPin size={16} className="text-[#C9973B]" />
                <p className="text-sm font-bold uppercase tracking-tight">{post.locationName}</p>
            </div>
         </div>
       </div>

       {/* Content */}
       <div className="max-w-2xl mx-auto px-8 -mt-8 relative z-10 space-y-10">
          <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-gray-100 space-y-8">
             <div className="space-y-4">
                <h3 className="text-base font-black text-[#1A1612] uppercase tracking-[0.2em] italic text-[#C9973B]">Insight</h3>
                <p className="text-lg font-medium text-gray-800 leading-relaxed italic">
                  "{post.description || "A truly hidden gem worth seeing in Addis Ababa."}"
                </p>
             </div>

             <div className="flex items-center justify-between pt-8 border-t border-gray-50">
                <div className="flex items-center gap-6">
                   <button className="flex items-center gap-3 text-rose-500 active:scale-95 transition-all group">
                      <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-all shadow-sm">
                        <Heart size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Inspiration</p>
                        <p className="text-base font-black text-rose-500 leading-none">{post.likesCount}</p>
                      </div>
                   </button>
                </div>
                
                {post.placeId && (
                   <Link href={`/place/${post.place?.slug}`} className="bg-[#1A1612] text-white px-8 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-[#1A1612]/20 active:scale-95 transition-all">
                      Open in NU <ExternalLink size={14} className="text-[#C9973B]" />
                   </Link>
                )}
             </div>
          </div>

          {/* Map Placeholder or CTA */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] px-2 text-center">Precise Location</h3>
            <div className="w-full h-64 bg-gray-100 rounded-[3rem] border border-gray-200 overflow-hidden relative group">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=2073&auto=format&fit=crop')] opacity-10 bg-center bg-cover grayscale" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <MapPin className="w-12 h-12 text-[#C9973B] animate-bounce" />
                    <div className="space-y-1">
                        <p className="text-base font-black text-[#1A1612] uppercase italic">{post.locationName}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Addis Ababa, Ethiopia</p>
                    </div>
                    <button className="bg-white text-[10px] font-black uppercase tracking-widest px-8 py-4 rounded-2xl shadow-xl shadow-black/5 hover:bg-[#1A1612] hover:text-white transition-all">
                        Launch Navigation
                    </button>
                </div>
            </div>
          </div>
       </div>
    </div>
  );
}
