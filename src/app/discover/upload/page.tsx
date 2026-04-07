"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Camera, Upload, MapPin, X, ArrowLeft, Loader2, Sparkles, Send, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type Category = "Food" | "View" | "Culture" | "Coffee" | "Nightlife";

export default function DiscoveryUploadPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [status, setStatus] = useState<"IDLE" | "PREVIEW" | "POSTING" | "SUCCESS">("IDLE");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<Category>("View");
    const [location, setLocation] = useState("");
    const [error, setError] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError("Image too large (max 5MB)");
                return;
            }
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setStatus("PREVIEW");
            setError("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image || !title || !location) {
            setError("Please fill in all required fields.");
            return;
        }

        setStatus("POSTING");
        setError("");

        try {
            const formData = new FormData();
            formData.append("image", image);
            formData.append("title", title);
            formData.append("description", description);
            formData.append("category", category);
            formData.append("location", location);

            const res = await fetch("/api/discovery/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const d = await res.json();
                throw new Error(d.error || "Upload failed");
            }

            setStatus("SUCCESS");
            setTimeout(() => router.push("/"), 2000);
        } catch (err: any) {
            setError(err.message);
            setStatus("PREVIEW");
        }
    };

    if (status === "SUCCESS") {
        return (
            <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center p-8 text-center space-y-6">
                <div className="w-24 h-24 bg-emerald-500 rounded-[3rem] flex items-center justify-center shadow-2xl shadow-emerald-200 animate-in zoom-in-50 duration-500">
                    <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter">Gem Submitted!</h1>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
                        Your discovery is being reviewed by the NU team.<br/>It will be live in 1-2 hours.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAF8] pb-32">
            {/* Header */}
            <div className="bg-[#1A1612] px-6 pt-16 pb-12 rounded-b-[3.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9973B]/10 rounded-full blur-[80px]" />
                <div className="relative z-10 flex items-center justify-between">
                    <button onClick={() => router.back()} className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 text-white active:scale-90 transition-all">
                        <ArrowLeft size={18} />
                    </button>
                    <h1 className="text-xl font-black text-white italic uppercase tracking-tighter">Share your gem</h1>
                    <div className="w-10" />
                </div>
            </div>

            <div className="max-w-xl mx-auto px-6 -mt-6 relative z-20">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Image Upload Area */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">The Visual (Required)</label>
                        {preview ? (
                            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl bg-gray-100 border-4 border-white group">
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                <button 
                                    type="button"
                                    onClick={() => { setPreview(null); setImage(null); setStatus("IDLE"); }}
                                    className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-90 transition-all"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        ) : (
                            <button 
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full aspect-[4/5] bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 hover:border-[#C9973B]/40 hover:bg-gray-50 transition-all group active:scale-[0.98]"
                            >
                                <div className="w-16 h-16 bg-[#1A1612] rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                    <Camera size={24} className="text-[#C9973B]" />
                                </div>
                                <div className="text-center">
                                    <span className="block text-[11px] font-black uppercase tracking-widest text-gray-900">Upload High-Res Photo</span>
                                    <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-1">Portrait orientation looks best</span>
                                </div>
                            </button>
                        )}
                        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFile} />
                    </div>

                    {/* Details Area */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Gem Title</label>
                            <input 
                                type="text" 
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="e.g. Sunset at Entoto Park"
                                className="w-full bg-gray-50 border-none p-5 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#C9973B]/20 outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Exact Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-5 top-5 w-4 h-4 text-[#C9973B]" />
                                <input 
                                    type="text" 
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    placeholder="Which cafe or viewpoint exactly?"
                                    className="w-full bg-gray-50 border-none p-5 pl-12 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#C9973B]/20 outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Category</label>
                            <div className="flex flex-wrap gap-2">
                                {["Food", "View", "Culture", "Coffee", "Nightlife"].map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setCategory(cat as Category)}
                                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${category === cat ? 'bg-[#1A1612] text-[#C9973B] shadow-lg' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Description (Optional)</label>
                            <textarea 
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Tell us why this place is a gem..."
                                className="w-full bg-gray-50 border-none p-5 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#C9973B]/20 outline-none h-32"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 p-5 rounded-2xl border border-red-100 text-center">
                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">{error}</p>
                        </div>
                    )}

                    <div className="pt-4">
                        <button 
                            type="submit"
                            disabled={status === "POSTING" || !preview || !title || !location}
                            className="w-full bg-[#C9973B] text-[#1A1612] py-6 rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-[#C9973B]/30 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-20"
                        >
                            {status === "POSTING" ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Send size={16} /> Submit to Moderation
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
