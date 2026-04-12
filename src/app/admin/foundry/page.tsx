import { ChevronRight } from 'lucide-react';
import { getIngestionListings } from './actions';
import FoundryClient from './FoundryClient';

export const metadata = { title: "Listing Foundry - Admin" };

export default async function FoundryPage({ searchParams }: { searchParams: Promise<{ status?: string, city?: string }> }) {
    const resolvedParams = await searchParams;
    const [listings, metadata] = await Promise.all([
        getIngestionListings({
            status: resolvedParams.status as any,
            city: resolvedParams.city
        }),
        import('./actions').then(m => m.getFoundryMetadata())
    ]);

    return (
        <div className="space-y-10 animate-in fade-in duration-700 w-full">
            {/* Header Area */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="w-12 h-1.5 bg-[#D4AF37] rounded-full"></span>
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Infrastructure</span>
                    </div>
                    <h1 className="text-5xl font-black text-[#1A1612] tracking-tighter uppercase leading-none">Listing Foundry</h1>
                    <div className="flex items-center gap-4 mt-4">
                         <span className="px-4 py-1.5 bg-[#1A1612] rounded-xl text-[10px] font-black text-[#D4AF37] uppercase tracking-widest border border-white/5 shadow-xl">
                            Pipeline v2.0
                         </span>
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            OSM <ChevronRight className="w-3 h-3" /> DEDUPE <ChevronRight className="w-3 h-3" /> LLM <ChevronRight className="w-3 h-3" /> MEDIA <ChevronRight className="w-3 h-3" /> PROD
                         </span>
                    </div>
                </div>
            </div>

            {/* Foundry Content Container - Full Width */}
            <FoundryClient initialListings={listings} metadata={metadata} />
        </div>
    );
}
