"use client";

import { 
  Camera, Upload, Sparkles, X, 
  MapPin, Info, ArrowRight, Share2, 
  Bookmark, CheckCircle, Search, Bird, Sprout, Cat, RefreshCcw, AlertTriangle
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
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
  } | null;
  confidence: number;
  alternatives: any[];
  category?: string;
  error?: string;
}

const typeIcons = {
  ANIMAL: Cat,
  PLANT: Sprout,
  BIRD: Bird
};

// --- Helper Functions ---

/**
 * Resizes and compresses an image on the client side to stay under the Vercel limit
 * and reduce memory consumption in the browser. 
 * High-res iPhone photos are often 10-20MB which crashes memory-restricted mobile Safari.
 */
async function compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.src = url;
        img.onload = () => {
            URL.revokeObjectURL(url);
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1000;
            const MAX_HEIGHT = 1000;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error("Canvas context failed"));
                return;
            }
            ctx.drawImage(img, 0, 0, width, height);
            // Return compressed base64
            resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.onerror = (err) => {
            URL.revokeObjectURL(url);
            reject(err);
        };
    });
}

export default function AIIdentify() {
  const [stage, setStage] = useState<"SELECT" | "PROCESSING" | "RESULT" | "ERROR">("SELECT");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use URL.createObjectURL for the high-quality local preview, 
  // keeping the compressed one for the API payload only.
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    // Cleanup Object URLs to avoid memory leaks
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleIdentify = async (file: File) => {
    try {
      setStage("PROCESSING");
      
      // 1. Create local preview (efficient)
      const pUrl = URL.createObjectURL(file);
      setPreviewUrl(pUrl);
      setSelectedImage(pUrl);

      // 2. Compress image before sending (Vercel limit safety)
      const compressedImgData = await compressImage(file);

      // 3. Identification request
      const res = await fetch("/api/species/identify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: compressedImgData }),
      });

      if (!res.ok) {
        throw new Error(res.status === 413 ? "Image too large" : "Service unstable");
      }

      const data = await res.json();
      
      if (!data || data.error) {
          throw new Error(data.error || "Nature report failed to load");
      }

      setResult(data);
      setStage("RESULT");
    } catch (err: any) {
      console.error("AI Identify Error:", err);
      setErrorMsg(err.message || "Something went wrong in the wild.");
      setStage("ERROR");
    }
  };

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic size guard before processing
      if (file.size > 20 * 1024 * 1024) { // 20MB upper limit for RAW
          setErrorMsg("File is significantly too large (Max 20MB)");
          setStage("ERROR");
          return;
      }
      handleIdentify(file);
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
        <Link href="/" className="bg-white/20 backdrop-blur-xl p-3 rounded-2xl border border-white/20 text-[#1A1612]">
            <X className="w-5 h-5" />
        </Link>
        <button className="bg-[#C9973B] text-white p-3 rounded-2xl border border-white/20 shadow-xl shadow-[#C9973B]/20">
            <Sparkles className="w-5 h-5" />
        </button>
      </div>

      {stage === 'SELECT' && (
        <div className="pt-24 px-8 space-y-12 max-w-2xl mx-auto flex flex-col items-center text-center animate-in fade-in duration-500">
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
                    className="group bg-[#1A1612] text-white rounded-[2.5rem] p-8 flex flex-col items-center gap-4 transition-all hover:bg-[#C9973B] shadow-2xl active:scale-95"
                >
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Camera className="w-6 h-6 text-[#C9973B]" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.25em]">Capture Vision</span>
                </button>
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white rounded-[2.5rem] p-6 flex flex-col items-center gap-3 border border-gray-100 shadow-sm active:scale-95"
                    >
                         <Upload className="w-5 h-5 text-gray-400" />
                         <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Upload Photo</span>
                    </button>
                    <Link 
                        href="/favorites"
                        className="bg-white rounded-[2.5rem] p-6 flex flex-col items-center gap-3 border border-gray-100 shadow-sm active:scale-95"
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
                    <img src={selectedImage || ''} className="w-full h-full object-cover blur-[2px] opacity-70" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1612]/60 to-transparent" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 border-4 border-[#C9973B] border-t-transparent rounded-full animate-spin shadow-2xl shadow-[#C9973B]/20" />
                </div>
            </div>
            <div className="text-center space-y-2">
                <h2 className="text-[#1A1612] text-xl font-black uppercase italic tracking-tighter">Analyzing Nature</h2>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] animate-pulse">Running Ethiopia AI Core</p>
            </div>
        </div>
      )}

      {stage === 'ERROR' && (
        <div className="h-screen flex flex-col items-center justify-center p-8 space-y-8 animate-in zoom-in-95 duration-500">
             <div className="w-24 h-24 bg-rose-50 rounded-[2.5rem] flex items-center justify-center shadow-xl shadow-rose-100 mb-4 animate-bounce">
                <AlertTriangle className="w-12 h-12 text-rose-500" />
            </div>
            <div className="text-center space-y-3">
                <h2 className="text-[#1A1612] text-2xl font-black uppercase italic tracking-tighter">Signal Interrupted</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest max-w-[240px] mx-auto leading-relaxed">
                    {errorMsg}
                </p>
            </div>
            <button 
                onClick={() => setStage("SELECT")}
                className="bg-[#1A1612] text-[#C9973B] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#1A1612]/20 flex items-center gap-2 group transition-all"
            >
                <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" /> Try Again
            </button>
        </div>
      )}

      {stage === 'RESULT' && result && result.match && (
        <div className="animate-in slide-in-from-bottom-6 duration-700">
            {/* Immersive Photo Hero */}
            <div className="relative h-[65vh] w-full overflow-hidden rounded-b-[4rem] shadow-3xl">
                <img src={result.match.imageUrl} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF8] via-transparent to-[#1A1612]/20" />
                
                {/* Confidence Badge */}
                <div className="absolute bottom-12 left-8 bg-white/95 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-2xl border border-white/20 backdrop-blur-md">
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
                        <h1 className="text-4xl font-black text-[#1A1612] italic uppercase tracking-tighter leading-none pr-4">{result.match.name}</h1>
                        <div className="flex gap-2">
                            <button className="bg-white p-3 rounded-2xl shadow-xl shadow-gray-200/50 active:scale-90 transition-all border border-gray-50">
                                <Share2 className="w-5 h-5 text-gray-500" />
                            </button>
                            <button className="bg-white p-3 rounded-2xl shadow-xl shadow-gray-200/50 active:scale-90 transition-all border border-gray-50">
                                <Bookmark className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Explorer Facts */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 rounded-[2.5rem] p-6 border border-emerald-100 flex flex-col gap-2 shadow-sm">
                        <MapPin className="w-5 h-5 text-emerald-500" />
                        <h4 className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Native Habitat</h4>
                        <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider line-clamp-2">{result.match.habitat}</p>
                    </div>
                    <div className="bg-blue-50 rounded-[2.5rem] p-6 border border-blue-100 flex flex-col gap-2 shadow-sm">
                        <Search className="w-5 h-5 text-blue-500" />
                        <h4 className="text-[9px] font-black uppercase tracking-widest text-blue-600">Endemic In</h4>
                        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider line-clamp-2">{result.match.regionTags.join(', ')}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-[#C9973B]" />
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 italic">Nature Report</h3>
                    </div>
                    <p className="text-sm font-medium text-gray-600 leading-relaxed italic border-l-2 border-gray-100 pl-4 py-1">
                        {result.match.description}
                    </p>
                </div>

                {result.match.funFact && (
                    <div className="bg-[#1A1612] rounded-[3rem] p-8 text-white relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9973B]/10 rounded-full blur-3xl" />
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-[#C9973B] rounded-xl flex items-center justify-center text-[#1A1612]">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <h4 className="text-[11px] font-black uppercase tracking-widest italic text-[#C9973B]">Did You Know?</h4>
                        </div>
                        <p className="text-xs font-medium text-gray-300 leading-relaxed relative z-10 leading-relaxed pb-2">
                            {result.match.funFact}
                        </p>
                    </div>
                )}

                {/* Not 100% Sure Handling */}
                {result.confidence < 0.9 && result.alternatives && result.alternatives.length > 0 && (
                    <div className="space-y-4 pt-4">
                         <div className="flex items-center gap-2 px-2">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Close Matches</h3>
                        </div>
                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 px-2">
                            {result.alternatives.map((alt: any) => (
                                <div key={alt.id} className="shrink-0 w-52 bg-white p-3 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-3 active:scale-95 transition-transform">
                                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-md">
                                        <img src={alt.imageUrl} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h5 className="text-[10px] font-black text-gray-900 truncate uppercase tracking-tight">{alt.name}</h5>
                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.1em]">{alt.type}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between pb-12 gap-4">
                   <button 
                        onClick={() => {
                          setStage("SELECT");
                          setResult(null);
                        }}
                        className="text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-[#1A1612] transition-colors shrink-0"
                   >
                       ← Try Another
                   </button>
                   <Link href="/favorites" className="bg-[#1A1612] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-xl shadow-[#1A1612]/30 flex-1 justify-center active:scale-95 transition-transform">
                       Add to Collection <ArrowRight className="w-4 h-4 ml-1" />
                   </Link>
                </div>
            </div>
        </div>
      )}

      {/* No Match Result Handling */}
      {stage === 'RESULT' && result && !result.match && (
          <div className="h-[80vh] flex flex-col items-center justify-center p-8 space-y-6 text-center animate-in zoom-in-95 duration-500">
               <div className="w-20 h-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-gray-300" />
              </div>
              <h2 className="text-[#1A1612] text-2xl font-black uppercase italic tracking-tighter">Species Unseen</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest max-w-[240px] mx-auto leading-relaxed">
                  Nature holds mysteries. We couldn't definitively identify this one.
              </p>
              <button 
                onClick={() => setStage("SELECT")}
                className="bg-[#1A1612] text-[#C9973B] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#1A1612]/20"
              >
                  Try Again
              </button>
          </div>
      )}

      <BottomNav />
    </div>
  );
}
