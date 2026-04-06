"use client";

import React, { useState } from "react";
import { useOffline } from "@/contexts/OfflineContext";
import { Download, Trash2, CheckCircle, Smartphone, Map, Hotel, Phone } from "lucide-react";
import { OfflineStorage } from "@/lib/offline";
import { useMutation, useQuery } from "@tanstack/react-query";

const PRESET_PACKS = [
    { id: "addis", name: "Addis Ababa", description: "Capital discovery, restaurants, and stays.", size: "4 MB" },
    { id: "lalibela", name: "Lalibela", description: "Rock-hewn churches and sacred sites.", size: "12 MB" },
    { id: "simien", name: "Simien Mountains", description: "Wildlife trekking and viewpoints.", size: "18 MB" },
    { id: "omo", name: "Omo Valley", description: "Cultural trails and tribal regions.", size: "15 MB" },
];

export default function DownloadsPage() {
    const { isOnline, storageUsed, refreshStorage } = useOffline();
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    const { data: downloadedPacks, refetch } = useQuery({
        queryKey: ["downloaded-packs"],
        queryFn: () => OfflineStorage.listPacks(),
    });

    const downloadMutation = useMutation({
        mutationFn: async (packId: string) => {
            const packMeta = PRESET_PACKS.find(p => p.id === packId);
            if (!packMeta) return;

            setDownloadingId(packId);
            
            // Simulate bundling process (In real world, this would call /api/packs/bundle)
            const response = await fetch(`/api/places?city=${packMeta.name}&limit=50`);
            const { places } = await response.json();
            
            await OfflineStorage.savePack({
                ...packMeta,
                downloadedAt: new Date(),
                data: places,
            });

            await refreshStorage();
            setDownloadingId(null);
            refetch();
        }
    });

    const deletePack = async (id: string) => {
        if (!confirm("Remove this offline pack?")) return;
        await OfflineStorage.deletePack(id);
        await refreshStorage();
        refetch();
    };

    return (
        <div className="min-h-screen bg-surface pb-32">
            {/* Header */}
            <div className="sticky top-0 bg-surface/80 backdrop-blur-xl border-b border-gray-100 px-6 py-12 z-40">
                <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-1 bg-[#C9973B] rounded-full"></span>
                    <span className="text-[10px] uppercase font-black tracking-widest text-[#C9973B]">
                        Connectivity
                    </span>
                </div>
                <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">
                    Offline Packs
                </h1>
                <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-[280px]">
                    Download destination data for stays, maps, and emergency contacts.
                </p>
            </div>

            <div className="px-6 py-8 space-y-8">
                {/* Status Bar */}
                <div className="bg-[#1A1612] text-white p-6 rounded-[2.5rem] flex items-center justify-between">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Local Storage</span>
                        <div className="text-2xl font-black tracking-tighter uppercase">{storageUsed} Used</div>
                    </div>
                    <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${isOnline ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>
                        {isOnline ? 'Online Ready' : 'In Offline Mode'}
                    </div>
                </div>

                {/* Available Packs */}
                <div className="space-y-4">
                    <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 px-2">Ready to Save</h2>
                    <div className="grid gap-4">
                        {PRESET_PACKS.map((pack) => {
                            const isDownloaded = downloadedPacks?.some(p => p.id === pack.id);
                            const isDownloading = downloadingId === pack.id;

                            return (
                                <div key={pack.id} className="bg-white border border-gray-100 p-5 rounded-[2rem] shadow-sm flex items-center justify-between group transition-all hover:border-[#C9973B]/30">
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-[#1A1612] tracking-tight">{pack.name}</h3>
                                        <p className="text-[10px] text-gray-400 font-medium">{pack.description}</p>
                                        <div className="flex items-center gap-3 pt-2">
                                            <span className="bg-gray-50 text-[9px] font-black uppercase px-2 py-1 rounded-lg text-gray-400">
                                                {pack.size} Data
                                            </span>
                                            {isDownloaded && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                                        </div>
                                    </div>

                                    {isDownloaded ? (
                                        <button 
                                            onClick={() => deletePack(pack.id)}
                                            className="w-12 h-12 flex items-center justify-center bg-gray-50 text-red-500 rounded-2xl border border-gray-100 active:scale-90 transition-transform"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => downloadMutation.mutate(pack.id)}
                                            disabled={!isOnline || isDownloading}
                                            className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all active:scale-90 ${isDownloading ? 'bg-[#1A1612] text-white border-[#1A1612] animate-pulse' : 'bg-white text-[#C9973B] border-gray-100 hover:border-[#C9973B]/50 shadow-sm'} disabled:opacity-30`}
                                        >
                                            <Download className={`w-5 h-5 ${isDownloading ? 'animate-bounce' : ''}`} />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Itinerary Cache section could go here */}
                <div className="pt-8 space-y-4">
                     <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 px-2">Offline Capability</h2>
                     <div className="grid grid-cols-2 gap-4">
                         <div className="bg-[#1A1612]/5 p-6 rounded-[2rem] border border-black/5 space-y-3">
                             <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                <Map className="w-5 h-5 text-[#C9973B]" />
                             </div>
                             <div className="text-[10px] font-bold text-gray-400 uppercase">Interactive Maps</div>
                             <div className="text-[9px] text-gray-500 leading-relaxed font-medium">Cached layers accessible via packs.</div>
                         </div>
                         <div className="bg-[#1A1612]/5 p-6 rounded-[2rem] border border-black/5 space-y-3">
                             <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                <Hotel className="w-5 h-5 text-[#C9973B]" />
                             </div>
                             <div className="text-[10px] font-bold text-gray-400 uppercase">Saved Listings</div>
                             <div className="text-[9px] text-gray-500 leading-relaxed font-medium">100% address & contact persistence.</div>
                         </div>
                     </div>
                </div>
            </div>
        </div>
    );
}
