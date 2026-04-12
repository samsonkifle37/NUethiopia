"use client";

import { useState, useEffect } from "react";
import { getPipelineImages, getPipelineStats, updateImageState, ImageFilter, getPlaceImagesByPlaceId, uploadEntityImage, deleteEntityImage } from "./actions";
import {
    RefreshCcw,
    CheckCircle,
    XCircle,
    Image as ImageIcon,
    AlertTriangle,
    ShieldCheck,
    Star,
    UploadCloud,
    Search,
    Sparkles,
    Plus,
    Loader2,
    Trash2
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

export default function ImageHardeningCenter() {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [stats, setStats] = useState<any>(null);
    const [filter, setFilter] = useState<ImageFilter>('PENDING');
    const [processingId, setProcessingId] = useState<string|null>(null);
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const [allPlaceImages, setAllPlaceImages] = useState<any[]>([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        setOffset(0);
        setImages([]);
        fetchData(0, true);
    }, [filter]);

    const fetchData = async (currentOffset: number = 0, isInitial: boolean = false) => {
        try {
            if (isInitial) setLoading(true);
            else setLoadingMore(true);

            const [imgs, st] = await Promise.all([
                getPipelineImages(filter, currentOffset),
                isInitial ? getPipelineStats() : Promise.resolve(stats)
            ]);

            if (isInitial) {
                setImages(imgs);
                setStats(st);
            } else {
                setImages(prev => [...prev, ...imgs]);
            }

            setHasMore(imgs.length === 50);
        } catch (error) {
            console.error("Fetch failed:", error);
        } finally {
            if (isInitial) setLoading(false);
            else setLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        const nextOffset = offset + 50;
        setOffset(nextOffset);
        fetchData(nextOffset);
    };

    const handleDeleteImage = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to PERMANENTLY delete this image?")) return;
        
        try {
            setProcessingId(id);
            // Optimistic update
            setAllPlaceImages(allPlaceImages.filter(img => img.id !== id));
            
            await deleteEntityImage(id);
            
            if (selectedImage?.id === id) {
                if (allPlaceImages.length > 1) {
                    const next = allPlaceImages.find(img => img.id !== id);
                    if (next) setSelectedImage({ ...next, place: selectedImage.place });
                } else {
                    setSelectedImage(null);
                }
            }
            
            // Refresh main list but keep current offset if possible? 
            // Simple approach: just fetchData(0, true) to sync everything
            fetchData(0, true);
        } catch (error) {
            console.error("Deletion failed:", error);
            alert("Could not delete image. It may be a primary asset or referenced elsewhere.");
            if (selectedImage?.place?.id) {
                const refreshed = await getPlaceImagesByPlaceId(selectedImage.place.id);
                setAllPlaceImages(refreshed);
            }
        } finally {
            setProcessingId(null);
        }
    };

    const handleAction = async (id: string, action: 'APPROVE' | 'REJECT' | 'SET_PRIMARY' | 'RETRY', newUrl?: string) => {
        setProcessingId(id);
        try {
            await updateImageState(id, action, newUrl);
            await fetchData(0, true); // Reset to top to see changes
            
            if (selectedImage?.place?.id) {
                const updated = await getPlaceImagesByPlaceId(selectedImage.place.id);
                setAllPlaceImages(updated);
            }
        } catch (error) {
            console.error("Action failed:", error);
        } finally {
            setProcessingId(null);
        }
    };

    const handleImageClick = async (img: any) => {
        setSelectedImage(img);
        if (img.place?.id) {
            const more = await getPlaceImagesByPlaceId(img.place.id);
            setAllPlaceImages(more);
        } else {
            setAllPlaceImages([]);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedImage?.place?.id) return;
        
        setProcessingId("uploading");
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;
            await uploadEntityImage(selectedImage.place.id, base64String);
            const updated = await getPlaceImagesByPlaceId(selectedImage.place.id);
            setAllPlaceImages(updated);
            setProcessingId(null);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="min-h-screen bg-[#0B0F19] pb-24 text-white relative">
            {/* Image Preview Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-3xl animate-in fade-in zoom-in duration-300">
                    <button 
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white z-[60]"
                    >
                        <XCircle className="w-10 h-10" />
                    </button>

                    <div className="w-full max-w-7xl flex flex-col md:flex-row gap-10 items-stretch h-[85vh] overflow-hidden">
                        {/* Left: Gallery of All Images */}
                        <div className="w-full md:w-[350px] flex flex-col gap-6 overflow-y-auto pr-4 border-r border-white/10 custom-scrollbar">
                            <div className="sticky top-0 bg-[#0B0F19] pb-4 z-10 border-b border-white/10">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-1">Place Inventory</h3>
                                <p className="text-2xl font-black text-white leading-tight uppercase truncate">{selectedImage.place?.name}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {allPlaceImages.map((img: any) => (
                                    <div 
                                        key={img.id} 
                                        onClick={() => setSelectedImage({ ...img, place: selectedImage.place })}
                                        className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all group/thumb ${selectedImage.id === img.id ? 'border-[#D4AF37] scale-[0.98]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img.mirroredUrl || img.imageUrl} alt="Inventory" className="w-full h-full object-cover" />
                                        {img.priority === 0 && <div className="absolute top-1 right-1"><Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" /></div>}
                                        
                                        {/* Delete Button */}
                                        {img.priority !== 0 && (
                                            <button 
                                                onClick={(e) => handleDeleteImage(e, img.id)}
                                                className="absolute top-2 left-2 z-30 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover/thumb:opacity-100 transition-all hover:bg-red-600 hover:scale-110 active:scale-95 shadow-lg pointer-events-auto"
                                                title="Delete Asset"
                                            >
                                                {processingId === img.id ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Trash2 className="w-3.5 h-3.5" />}
                                            </button>
                                        )}

                                        <div className={`absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[7px] font-black uppercase ${img.status === 'APPROVED' ? 'bg-emerald-500 text-black' : 'bg-gray-500 text-white'}`}>
                                            {img.status}
                                        </div>
                                    </div>
                                ))}
                                
                                <div className="relative aspect-square">
                                    <input type="file" id="modal-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    <label 
                                        htmlFor="modal-upload"
                                        className="flex flex-col items-center justify-center w-full h-full rounded-xl border-2 border-dashed border-white/20 bg-white/5 hover:border-[#D4AF37] hover:bg-white/10 transition-all cursor-pointer text-center group"
                                    >
                                        {processingId === "uploading" ? <Loader2 className="w-6 h-6 animate-spin text-[#D4AF37]" /> : <Plus className="w-6 h-6 text-gray-500 group-hover:text-[#D4AF37]" />}
                                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-500 group-hover:text-[#D4AF37] mt-1">Add Asset</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Middle: Large Preview */}
                        <div className="flex-1 flex flex-col gap-6 relative">
                            <div className="flex-1 w-full flex items-center justify-center overflow-hidden rounded-[2.5rem] bg-black/50 border border-white/10 relative group">
                                <img 
                                    src={selectedImage.mirroredUrl || selectedImage.imageUrl} 
                                    alt="Expanded Detail" 
                                    className="max-h-full max-w-full object-contain drop-shadow-2xl"
                                />
                                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                                    {selectedImage.priority === 0 && <span className="bg-[#D4AF37] text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Star className="w-3 h-3 fill-black"/> Primary Hero</span>}
                                    <span className="bg-black/60 backdrop-blur-md px-4 py-1 rounded-full text-[10px] font-black text-gray-400 border border-white/10">ID: {selectedImage.id}</span>
                                </div>
                            </div>

                            {/* Right Panel / Bottom Selection Logic */}
                            <div className="flex flex-row items-center justify-between gap-6 p-1">
                                <div className="flex flex-col gap-1">
                                    <div className="flex gap-2">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedImage.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                            {selectedImage.status}
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#D4AF37]/20 text-[#D4AF37]">
                                            Score: {selectedImage.qualityScore || 0}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-[10px] font-mono mt-2 truncate max-w-xs">{selectedImage.imageUrl}</p>
                                </div>

                                <div className="flex gap-3">
                                    {selectedImage.priority !== 0 && (
                                        <button 
                                            onClick={() => handleAction(selectedImage.id, 'SET_PRIMARY')}
                                            className="px-6 py-4 border border-[#D4AF37]/30 text-[#D4AF37] font-black uppercase text-xs rounded-2xl hover:bg-[#D4AF37]/10 transition-all"
                                        >
                                            Pin as Hero
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleAction(selectedImage.id, 'APPROVE')}
                                        className="px-8 py-4 bg-emerald-500 text-black font-black uppercase text-xs rounded-2xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                                    >
                                        <CheckCircle className="w-4 h-4" /> Approve
                                    </button>
                                    <button 
                                        onClick={() => handleAction(selectedImage.id, 'REJECT')}
                                        className="px-8 py-4 bg-rose-500/20 text-rose-500 border border-rose-500/30 font-black uppercase text-xs rounded-2xl hover:bg-rose-500/40 transition-all flex items-center gap-2"
                                    >
                                        <XCircle className="w-4 h-4" /> Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <header className="bg-white/5 border-b border-white/10 sticky top-0 z-10 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-6 py-6 border-l-4 border-[#D4AF37]">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-black text-white flex items-center gap-3">
                                <ShieldCheck className="w-8 h-8 text-[#D4AF37]" strokeWidth={2.5} />
                                Image Quality Center
                            </h1>
                            <p className="text-gray-400 text-sm mt-1 font-medium">Phase 2: Source-Safe Mirroring and Primary Injection</p>
                        </div>
                        <div className="flex gap-2">
                             <select 
                                value={filter} 
                                onChange={(e)=>setFilter(e.target.value as any)}
                                className="bg-[#1A1A2E] text-white p-2.5 rounded-xl border border-white/20 text-xs font-black uppercase tracking-widest focus:border-[#D4AF37]"
                             >
                                 <option value="ALL">View ALL</option>
                                 <option value="PENDING">Review PENDING</option>
                                 <option value="FAILED">Review FAILED</option>
                                 <option value="APPROVED">View APPROVED</option>
                                 <option value="MIRRORED">Mirrored SAFE</option>
                             </select>
                            <button
                                onClick={() => fetchData(0, true)}
                                disabled={loading}
                                className="p-2.5 bg-[#D4AF37] text-[#1A1A2E] rounded-xl hover:opacity-80 transition-all disabled:opacity-50"
                            >
                                <RefreshCcw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                            </button>
                        </div>
                    </div>

                    {stats && (
                        <div>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                                <button 
                                    onClick={() => setFilter('ALL')}
                                    className={`text-left rounded-xl p-3 border transition-all ${filter === 'ALL' ? 'bg-gray-500/20 border-gray-500/50 ring-2 ring-gray-500/30' : 'bg-gray-500/10 border-gray-500/20 hover:bg-gray-500/15'}`}
                                >
                                    <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 block">Total Catalog</span>
                                    <span className="text-2xl font-black text-white">{stats.totalCount || 0}</span>
                                </button>
                                
                                <button 
                                    onClick={() => setFilter('APPROVED')}
                                    className={`text-left rounded-xl p-3 border transition-all ${filter === 'APPROVED' ? 'bg-emerald-500/20 border-emerald-500/50 ring-2 ring-emerald-500/30' : 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/15'}`}
                                >
                                    <span className="text-[10px] uppercase font-black tracking-widest text-emerald-500 block">Approved</span>
                                    <span className="text-2xl font-black text-white">{stats.groups.find((s:any)=>s.status==='APPROVED')?._count.id || 0}</span>
                                </button>
                                
                                <button 
                                    onClick={() => setFilter('FAILED')}
                                    className={`text-left rounded-xl p-3 border transition-all ${filter === 'FAILED' ? 'bg-rose-500/20 border-rose-500/50 ring-2 ring-rose-500/30' : 'bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/15'}`}
                                >
                                    <span className="text-[10px] uppercase font-black tracking-widest text-rose-500 block">Failed / Blocked</span>
                                    <span className="text-2xl font-black text-white">{stats.groups.find((s:any)=>s.status==='FAILED')?._count.id || 0}</span>
                                </button>
                                
                                <button 
                                    onClick={() => setFilter('PENDING')}
                                    className={`text-left rounded-xl p-3 border transition-all ${filter === 'PENDING' ? 'bg-blue-500/20 border-blue-500/50 ring-2 ring-blue-500/30' : 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/15'}`}
                                >
                                    <span className="text-[10px] uppercase font-black tracking-widest text-blue-500 block flex items-center gap-1">Pending Queue</span>
                                    <span className="text-2xl font-black text-white">{stats.groups.find((s:any)=>s.status==='PENDING')?._count.id || 0}</span>
                                </button>
                                
                                <button 
                                    onClick={() => setFilter('MIRRORED')}
                                    className={`text-left rounded-xl p-3 border transition-all ${filter === 'MIRRORED' ? 'bg-[#D4AF37]/20 border-[#D4AF37]/50 ring-2 ring-[#D4AF37]/30' : 'bg-[#D4AF37]/10 border-[#D4AF37]/30 hover:bg-[#D4AF37]/15'}`}
                                >
                                    <span className="text-[10px] uppercase font-black tracking-widest text-[#D4AF37] block flex items-center gap-1"><UploadCloud className="w-3 h-3"/> Mirrored Safe</span>
                                    <span className="text-2xl font-black text-white">{stats.mirroredCount}</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                {loading && images.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                        <p className="font-bold text-[#D4AF37] uppercase tracking-widest text-xs">Scanning Database...</p>
                    </div>
                ) : images.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 border border-dashed border-white/10 rounded-[2rem]">
                        <CheckCircle className="w-12 h-12 text-emerald-500/50" />
                        <p className="font-bold text-gray-500 uppercase tracking-widest text-xs">No images found in this filter state ({filter}).</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {images.map((img: any) => (
                            <div key={img.id} className="bg-[#1A1A2E]/50 rounded-[2rem] p-6 border border-white/5 flex flex-col md:flex-row gap-6 hover:border-[#D4AF37]/30 transition-all duration-300">
                                <div 
                                    onClick={() => handleImageClick(img)}
                                    className="w-full md:w-48 h-32 rounded-2xl bg-black flex-shrink-0 relative overflow-hidden flex items-center justify-center border border-white/10 group cursor-zoom-in"
                                >
                                    {img.mirroredUrl || img.imageUrl ? (
                                        <img src={img.mirroredUrl || img.imageUrl} alt="Asset" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    ) : (
                                        <ImageIcon className="w-8 h-8 text-gray-700" />
                                    )}
                                    <div className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-black uppercase ${img.status === 'APPROVED' ? 'bg-emerald-500 text-black' : img.status === 'FAILED' ? 'bg-rose-500 text-white' : 'bg-gray-500 text-white'}`}>
                                        {img.status}
                                    </div>
                                    {img.priority === 0 && <div className="absolute top-2 left-2 bg-[#D4AF37] text-black px-2 py-0.5 rounded text-[9px] font-black uppercase flex items-center gap-1"><Star className="w-3 h-3 fill-black"/> Primary Hero</div>}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[9px] font-black uppercase tracking-widest bg-white/10 text-gray-300 px-2 py-0.5 rounded">{img.place?.type || 'Place'}</span>
                                        <h3 className="text-lg font-black text-white truncate ml-2">{img.place?.name}</h3>
                                    </div>
                                    <p className="text-gray-400 text-xs truncate">Source: {img.imageUrl}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {hasMore && images.length > 0 && (
                    <div className="mt-12 flex justify-center pb-20">
                        <button
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="group relative px-10 py-5 bg-white/5 border border-white/10 rounded-3xl overflow-hidden transition-all hover:bg-white/10 hover:border-[#D4AF37]/50 active:scale-95 disabled:opacity-50"
                        >
                            <div className="flex items-center gap-4">
                                {loadingMore ? (
                                    <Loader2 className="w-6 h-6 animate-spin text-[#D4AF37]" />
                                ) : (
                                    <Sparkles className="w-6 h-6 text-[#D4AF37] group-hover:animate-pulse" />
                                )}
                                <span className="text-sm font-black uppercase tracking-[0.2em] text-white">
                                    {loadingMore ? "Fetching Assets..." : "Load More Discovery"}
                                </span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </button>
                    </div>
                )}
            </main>
            <BottomNav />
        </div>
    );
}
