import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { VerifiedImage } from "@/components/media/VerifiedImage";
import { getPrimaryVerifiedImage } from "@/lib/images";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowLeft, 
  ChevronRight,
  Navigation
} from "lucide-react";

import { ActionButtonGroup } from "@/components/ActionButtonGroup";

export default async function EventDetailPage({ 
    params 
}: { 
    params: { slug: string } 
}) {
    const { slug } = await params;
    
    // Attempt to fetch by slug or ID
    const event = await (prisma as any).event.findFirst({
        where: {
            OR: [
                { slug: slug },
                { id: slug }
            ]
        },
        include: {
            place: {
                include: {
                    images: { orderBy: { priority: "asc" }, take: 1 }
                }
            }
        }
    });

    if (!event) {
        return notFound();
    }

    const eventImage = event.imageUrl || (event.place?.images?.[0]?.imageUrl) || "https://hrbxtdzpseitkegkeknt.supabase.co/storage/v1/object/public/place-images/placeholders/event-branded.jpg";
    
    const formattedDate = new Date(event.startTime).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });
    
    const formattedTime = new Date(event.startTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    });

    return (
        <div className="min-h-screen bg-[#FDFCF9] text-[#1A1A2E] pb-20">
            {/* 1. Sticky Header */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-gray-100">
                <Link href="/" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#1A1A2E] active:scale-90 transition-all">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                
                <ActionButtonGroup 
                    item={{
                        id: event.id,
                        slug: event.slug,
                        title: event.title,
                        type: "event",
                        shortDescription: event.description,
                        category: event.category,
                        startTime: event.startTime,
                        imageUrl: eventImage,
                        placeId: event.placeId,
                        placeSlug: event.place?.slug
                    }}
                />
            </div>

            <div className="pt-20"></div>

            {/* 2. Hero Image Section */}
            <div className="px-6">
                <div className="w-full aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200 relative group">
                    <VerifiedImage 
                        src={eventImage} 
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                        entityType="tour"
                        showBadge={false}
                    />
                    <div className="absolute inset-x-0 bottom-0 p-8 pt-20 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end">
                         <div className="flex items-center gap-2 mb-2">
                             <div className="w-1 h-8 bg-[#D4AF37] rounded-full" />
                             <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em]">{event.category}</span>
                         </div>
                         <h1 className="text-4xl font-black text-white leading-[1.1]">{event.title}</h1>
                    </div>
                </div>
            </div>

            {/* 3. Essential Info Bar */}
            <div className="px-6 mt-8">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-50 grid grid-cols-2 gap-6 items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] flex items-center justify-center text-[#1A1A2E]">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Date</p>
                            <p className="text-sm font-black mt-0.5">{formattedDate}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] flex items-center justify-center text-[#1A1A2E]">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Starts at</p>
                            <p className="text-sm font-black mt-0.5">{formattedTime}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Venue & Description */}
            <div className="px-6 mt-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-4">The Experience</h3>
                <p className="text-lg font-medium text-gray-600 leading-relaxed mb-10">
                    {event.description}
                </p>

                {event.place && (
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">Venue</h3>
                        <Link href={`/place/${event.place.slug}`} className="block bg-[#1A1A2E] rounded-[2.5rem] p-6 text-white group shadow-2xl shadow-[#1A1A2E]/30 relative overflow-hidden active:scale-[0.98] transition-all">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -translate-y-16 translate-x-16 rounded-full blur-3xl z-0" />
                             
                             <div className="flex items-center gap-5 relative z-10">
                                 <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-lg shadow-black/20">
                                      <VerifiedImage 
                                          src={getPrimaryVerifiedImage(event.place)} 
                                          alt={event.place.name}
                                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                          entityType={event.place.type as any}
                                          showBadge={false}
                                      />
                                 </div>
                                 <div className="flex-1">
                                     <p className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37] mb-1">Located at</p>
                                     <h4 className="text-xl font-black text-white leading-tight">{event.place.name}</h4>
                                     <p className="text-xs font-medium text-gray-400 mt-1 flex items-center gap-1 opacity-70">
                                         <MapPin className="w-3 h-3" /> {event.place.area || "Addis Ababa"}
                                     </p>
                                 </div>
                                 <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                      <ChevronRight className="w-5 h-5 text-[#D4AF37]" />
                                 </div>
                             </div>
                        </Link>
                        
                        <div className="grid grid-cols-2 gap-4">
                             <button className="flex items-center justify-center gap-3 bg-white border border-gray-200 py-6 rounded-[2rem] text-sm font-black text-[#1A1A2E] uppercase tracking-widest hover:border-[#D4AF37] transition-all active:scale-95 shadow-sm">
                                <Navigation className="w-4 h-4 text-[#D4AF37]" /> Get Directions
                             </button>
                             <Link href={`/place/${event.place.slug}`} className="flex items-center justify-center gap-3 bg-white border border-gray-200 py-6 rounded-[2rem] text-sm font-black text-[#1A1A2E] uppercase tracking-widest hover:border-[#D4AF37] transition-all active:scale-95 shadow-sm">
                                View Venue
                             </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* 5. Source Information */}
            {event.source && (
                 <div className="px-6 mt-16 pb-10 text-center">
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Source: {event.source}</p>
                 </div>
            )}
        </div>
    );
}
