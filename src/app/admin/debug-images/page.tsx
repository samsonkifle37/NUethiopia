
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Image from "next/image";
import { CheckCircle, XCircle, ImageIcon, Search, RefreshCw, Send, Loader2 } from "lucide-react";

export default function DebugImagesPage() {
    const [filter, setFilter] = useState("");
    const [isSyncing, setIsSyncing] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["admin-content-dashboard"],
        queryFn: () => fetch("/api/admin/content-dashboard").then(r => r.json()),
    });

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const res = await fetch("/api/admin/images/sync", { method: "POST" });
            const data = await res.json();
            if (data.success) {
                queryClient.invalidateQueries({ queryKey: ["admin-content-dashboard"] });
                alert("Synchronization complete: " + data.message);
            }
        } catch (e) {
            console.error(e);
            alert("Sync failed.");
        } finally {
            setIsSyncing(false);
        }
    };

    const handlePublish = async () => {
        if (!confirm("Are you sure you want to approve all pending images and publish to Vercel?")) return;
        setIsPublishing(true);
        try {
            const res = await fetch("/api/admin/images/publish", { method: "POST" });
            const data = await res.json();
            if (data.success) {
                queryClient.invalidateQueries({ queryKey: ["admin-content-dashboard"] });
                alert("Published! " + data.message);
            }
        } catch (e) {
            console.error(e);
            alert("Publishing failed.");
        } finally {
            setIsPublishing(false);
        }
    };

    const handleApproveEntity = async (id: string) => {
        try {
            const res = await fetch("/api/admin/images/approve-entity", {
                method: "POST",
                body: JSON.stringify({ id }),
                headers: { "Content-Type": "application/json" }
            });
            if (res.ok) {
                queryClient.invalidateQueries({ queryKey: ["admin-content-dashboard"] });
            }
        } catch (e) {
            console.error(e);
        }
    };

    const entities = data?.entities?.filter((e: any) =>
        e.name.toLowerCase().includes(filter.toLowerCase())
    ) || [];

    return (
        <div className="space-y-10 animate-in fade-in duration-700 h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-10 h-1 bg-[#D4AF37] rounded-full"></span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">Visual Intelligence</span>
                    </div>
                    <h1 className="text-4xl font-black text-[#1A1612] tracking-tighter uppercase whitespace-nowrap">Image Debug Hub</h1>
                    <p className="text-gray-400 font-medium text-sm">Real-time audit of all platform assets.</p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 shadow-sm rounded-2xl text-xs font-black uppercase tracking-widest text-[#1A1612] hover:bg-gray-50 transition-all disabled:opacity-50"
                    >
                        {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                        Synchronize
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="flex items-center gap-2 px-6 py-3 bg-[#1A1612] text-white shadow-xl shadow-gray-200/50 rounded-2xl text-xs font-black uppercase tracking-widest border border-[#1A1612] hover:bg-black transition-all disabled:opacity-50"
                    >
                        {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Publish to Vercel
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" />
                    <input
                        type="text"
                        placeholder="Filter entities by name..."
                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 pl-12 pr-6 text-sm font-bold focus:border-[#D4AF37]/30 focus:bg-white transition-all outline-none"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <div className="px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Inventory</span>
                    <span className="text-sm font-black text-[#1A1612]">{entities.length.toLocaleString()} Items</span>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-brand-dark" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 pb-20">
                    {entities.map((entity: any) => (
                        <div key={entity.id} className="bg-white rounded-3xl p-4 shadow-xl shadow-gray-200/40 border border-white flex flex-col gap-4">
                            <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-gray-100 group">
                                {entity.primaryImage ? (
                                    <ManagedImage
                                        name={entity.name}
                                        id={entity.id}
                                    />
                                ) : (
                                    <div className="h-full w-full flex flex-col items-center justify-center text-gray-400">
                                        <ImageIcon className="w-8 h-8 opacity-20" />
                                        <span className="text-[10px] uppercase font-bold tracking-widest mt-2">No Image</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-gray-900 leading-tight">{entity.name}</h3>
                                    {entity.score < 100 && (
                                        <button
                                            onClick={() => handleApproveEntity(entity.id)}
                                            className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                                            title="Quick Approve All Pending"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Badge label={entity.type} color="bg-gray-100 text-gray-500" />
                                    <StatusBadge label="Primary" active={entity.primaryImage} />
                                    <StatusBadge label="Gallery" active={entity.galleryCount > 0} count={entity.galleryCount} />
                                    <StatusBadge label="Maps" active={entity.mapsLink} />
                                    <StatusBadge label="Contact" active={entity.contact || entity.website} />
                                </div>
                                <div className="pt-2 flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 uppercase font-bold">Score</span>
                                        <span className={`text-lg font-black ${entity.score === 100 ? 'text-emerald-500' : entity.score >= 80 ? 'text-blue-500' : 'text-orange-500'}`}>{entity.score}%</span>
                                    </div>
                                    <button
                                        className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                                        onClick={() => window.open(`/place/${entity.slug}`, '_blank')}
                                    >
                                        Visit Page
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function ManagedImage({ name, id }: { name: string; id: string }) {
    const { data: place, isLoading, isError } = useQuery({
        queryKey: ["debug-place", id],
        queryFn: async () => {
            const res = await fetch(`/api/places?search=${encodeURIComponent(name)}`);
            if (!res.ok) throw new Error("Failed to load debug place");
            const d = await res.json();
            return d.places?.[0] || null;
        },
    });

    if (isLoading) return <div className="animate-pulse bg-gray-200 h-full w-full" />;

    // Use the first image from the array
    const url = place?.images?.[0]?.imageUrl;

    if (isError) return <div className="h-full w-full flex items-center justify-center text-red-500 bg-red-50 text-[10px] font-bold uppercase">Failed to load</div>;
    if (!url) return <div className="h-full w-full flex items-center justify-center text-red-400 bg-red-50 text-[10px] font-bold uppercase">Corrupt Data (Null)</div>;

    return (
        <img
            src={url}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
    );
}

function Badge({ label, color }: { label: string; color: string }) {
    return <span className={`${color} text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded-md`}>{label}</span>;
}

function StatusBadge({ label, active, count }: { label: string; active: boolean; count?: number }) {
    return (
        <span className={`${active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'} border text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded-md flex items-center gap-1`}>
            {active ? <CheckCircle className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
            {label} {count !== undefined && `(${count})`}
        </span>
    );
}
