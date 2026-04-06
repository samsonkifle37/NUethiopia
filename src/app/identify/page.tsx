"use client";

import { 
  Camera, Upload, Sparkles, X, 
  MapPin, Info, ArrowRight, Share2, 
  Bookmark, CheckCircle, Search, Bird, Sprout, Cat
} from "lucide-react";
import { useState, useRef } from "react";
import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";

interface IdentificationResult {
  match: {
    id: string;
    name: string;
    scientificName: string | null;
    type: "ANIMAL" | "PLANT" | "BIRD";
    description: string;
    habitat: string;
    funFact: string | null;
    imageUrl: string;
    regionTags: string[];
  };
  confidence: number;
  alternatives: any[];
  category: string;
}

const typeIcons = {
  ANIMAL: Cat,
  PLANT: Sprout,
  BIRD: Bird
};

export default function AIIdentify() {
  const [stage, setStage] = useState<"SELECT" | "PROCESSING" | "RESULT">("SELECT");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleIdentify = async (img: string) => {
    setSelectedImage(img);
    setStage("PROCESSING");
    try {
      const res = await fetch("/api/species/identify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: img }),
      });
      const data = await res.json();
      setResult(data);
      setStage("RESULT");
    } catch {
      setStage("SELECT");
    }
  };

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => handleIdentify(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-32">
       {/* Background Ambience */}
      {stage === 'SELECT' && (
        <div className="absolute inset-0 bg-cover bg-center grayscale opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=2073&auto=format&fit=crop')" }} />
      )}

      {/* Header Overlay (Floating icons) */}
      <div className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50">
        <Link href="/explore" className="bg-white/20 backdrop-blur-xl p-3 rounded-2xl border border-white/20 text-[#1A1612]">
            <X className="w-5 h-5" />
        </Link>
        <button className="bg-[#C9973B] text-white p-3 rounded-2xl border border-white/20 shadow-xl shadow-[#C9973B]/20">
            <Sparkles className="w-5 h-5" />
        </button>
      </div>

      {stage === 'SELECT' && (
        <div className="pt-24 px-8 space-y-12 max-w-2xl mx-auto flex flex-col items-center text-center">
            <div className="space-y-4">
                <div className="w-20 h-20 bg-[#C9973B]/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
                    <Camera className="w-10 h-10 text-[#C9973B]" />
                </div>
                <h1 className="text-4xl font-black text-[#1A1612] italic uppercase tracking-tighter leading-tight">Identify Ethiopia</h1>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest max-w-[240px] mx-auto leading-relaxed">
                    Point camera at any animal or plant to learn instantly.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 w-full">
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="group bg-[#1A1612] text-white rounded-[2.5rem] p-8 flex flex-col items-center gap-4 transition-all hover:bg-[#C9973B] shadow-2xl"
                >
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Camera className="w-6 h-6 text-[#C9973B]" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.25em]">Capture Vision</span>
                </button>
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white rounded-[2.5rem] p-6 flex flex-col items-center gap-3 border border-gray-100 shadow-sm"
                    >
                         <Upload className="w-5 h-5 text-gray-400" />
                         <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Upload Photo</span>
                    </button>
                    <Link 
                        href="/favorites"
                        className="bg-white rounded-[2.5rem] p-6 flex flex-col items-center gap-3 border border-gray-100 shadow-sm"
                    >
                         <Bookmark className="w-5 h-5 text-gray-400" />
                         <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">My Collection</span>
                    </Link>
                </div>
            </div>
            <input type="file" hidden ref={fileInputRef} onChange={onFileUpload} accept="image/*" />
        </div>
      )}

      {stage === 'PROCESSING' && (
        <div className="h-screen flex flex-col items-center justify-center p-8 space-y-8 animate-in fade-in duration-700">
            <div className="relative">
                <div className="w-64 h-64 rounded-[3rem] overflow-hidden border-4 border-[#C9973B] shadow-2xl relative">
                    <img src={selectedImage || ''} className="w-full h-full object-cover blur-sm opacity-50" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1612] to-transparent" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 border-4 border-[#C9973B] border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
            <div className="text-center space-y-2">
                <h2 className="text-[#1A1612] text-xl font-black uppercase italic tracking-tighter">Analyzing Nature</h2>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] animate-pulse">Running Ethiopia AI Core</p>
            </div>
        </div>
      )}

      {stage === 'RESULT' && result && (
        <div className="animate-in slide-in-from-bottom duration-700">
            {/* Immersive Photo Hero */}
            <div className="relative h-[65vh] w-full overflow-hidden rounded-b-[4rem] shadow-3xl">
                <img src={result.match.imageUrl} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF8] via-transparent to-[#1A1612]/20" />
                
                {/* Confidence Badge */}
                <div className="absolute bottom-12 left-8 bg-white/95 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-2xl border border-white/20">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#C9973B] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#1A1612] italic">
                            {Math.round(result.confidence * 100)}% Confidence
                        </span>
                    </div>
                </div>
            </div>

            {/* Content Sheet */}
            <div className="px-8 mt-[-3rem] relative z-20 space-y-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        {typeIcons[result.match.type] && (
                            <div className="w-8 h-8 bg-[#C9973B] rounded-lg flex items-center justify-center shadow-lg">
                                {(() => {
                                    const Icon = typeIcons[result.match.type];
                                    return <Icon className="w-4 h-4 text-white" />;
                                })()}
                            </div>
                        )}
                        <span className="text-[10px] font-black text-[#C9973B] uppercase tracking-[0.3em] italic">{result.match.scientificName}</span>
                    </div>
                    <div className="flex justify-between items-start">
                        <h1 className="text-4xl font-black text-[#1A1612] italic uppercase tracking-tighter leading-none">{result.match.name}</h1>
                        <div className="flex gap-2">
                            <button className="bg-white p-3 rounded-2xl shadow-xl shadow-gray-200/50">
                                <Share2 className="w-5 h-5 text-gray-500" />
                            </button>
                            <button className="bg-white p-3 rounded-2xl shadow-xl shadow-gray-200/50">
                                <Bookmark className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Explorer Facts */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 rounded-[2.5rem] p-6 border border-emerald-100 flex flex-col gap-2">
                        <MapPin className="w-5 h-5 text-emerald-500" />
                        <h4 className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Native Habitat</h4>
                        <p className="text-[10px] text-emerald-400 font-bold">{result.match.habitat}</p>
                    </div>
                    <div className="bg-blue-50 rounded-[2.5rem] p-6 border border-blue-100 flex flex-col gap-2">
                        <Search className="w-5 h-5 text-blue-500" />
                        <h4 className="text-[9px] font-black uppercase tracking-widest text-blue-600">Endemic In</h4>
                        <p className="text-[10px] text-blue-400 font-bold">{result.match.regionTags.join(', ')}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-[#D4AF37]" />
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 italic font-mono">Nature Report</h3>
                    </div>
                    <p className="text-sm font-medium text-gray-600 leading-relaxed italic">
                        {result.match.description}
                    </p>
                </div>

                {result.match.funFact && (
                    <div className="bg-[#1A1612] rounded-[3rem] p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9973B]/10 rounded-full blur-3xl" />
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-[#C9973B] rounded-xl flex items-center justify-center text-[#1A1612]">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <h4 className="text-[11px] font-black uppercase tracking-widest italic text-[#C9973B]">Did You Know?</h4>
                        </div>
                        <p className="text-xs font-medium text-gray-300 leading-relaxed relative z-10">
                            {result.match.funFact}
                        </p>
                    </div>
                )}

                {/* Not 100% Sure Handling */}
                {result.confidence < 0.9 && result.alternatives.length > 0 && (
                    <div className="space-y-4 pt-4">
                         <div className="flex items-center gap-2 px-2">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Close Matches</h3>
                        </div>
                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 px-2">
                            {result.alternatives.map((alt: any) => (
                                <div key={alt.id} className="shrink-0 w-48 bg-white p-3 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                                        <img src={alt.imageUrl} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="text-[10px] font-black text-gray-900 truncate uppercase">{alt.name}</h5>
                                        <span className="text-[8px] font-bold text-gray-400">{alt.type}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between pb-12">
                   <button 
                        onClick={() => setStage("SELECT")}
                        className="text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-[#1A1612] transition-colors"
                   >
                       ← Try Another
                   </button>
                   <Link href="/plan" className="bg-[#1A1612] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                       Add to Journal <ArrowRight className="w-4 h-4 ml-1" />
                   </Link>
                </div>
            </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
