"use client";

import { 
  Camera, Upload, Sparkles, X, 
  MapPin, Info, ArrowRight, Share2, 
  Bookmark, CheckCircle, Search, RefreshCcw, AlertTriangle,
  Plus, Image as ImageIcon, Send, History, ChevronLeft
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";

type Stage = "SELECT" | "FORM" | "SUBMITTING" | "SUCCESS" | "MY_SUBMISSIONS" | "ERROR";

interface Submission {
  id: string;
  name: string;
  category: string;
  area: string;
  description: string;
  photos: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: number;
}

const CATEGORIES = [
  "Viewpoint", "Landmark", "Café", "Market", 
  "Museum", "Park", "Culture", "Hidden Gem", 
  "Food Spot", "Event Space"
];

export default function AddDiscovery() {
  const [stage, setStage] = useState<Stage>("SELECT");
  const [form, setForm] = useState({
    name: "",
    category: "Hidden Gem",
    area: "",
    description: "",
    photos: [] as string[]
  });
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load submissions from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("nu_addis_submissions");
    if (saved) {
      try {
        setSubmissions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load submissions");
      }
    }
  }, []);

  // Save submissions to localStorage
  const saveSubmissions = (newSubs: Submission[]) => {
    setSubmissions(newSubs);
    localStorage.setItem("nu_addis_submissions", JSON.stringify(newSubs));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Convert to Base64 for local persistence demonstration
    const newPhotos: string[] = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 10 * 1024 * 1024) continue; // 10MB limit
        
        const reader = new FileReader();
        const p = new Promise<string>((resolve) => {
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
        });
        newPhotos.push(await p);
    }
    
    setForm(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));
    if (stage === 'SELECT') setStage('FORM');
  };

  const handleSubmit = async () => {
    if (!form.name || !form.area || !form.description) {
        setErrorMsg("Please fill in all required fields.");
        setStage("ERROR");
        return;
    }

    setStage("SUBMITTING");
    
    // Simulate API delay
    setTimeout(() => {
        const newSubmission: Submission = {
            id: Math.random().toString(36).substring(7),
            ...form,
            status: "PENDING",
            createdAt: Date.now()
        };
        saveSubmissions([newSubmission, ...submissions]);
        setStage("SUCCESS");
    }, 1500);
  };

  const handleShare = async () => {
    const shareData = {
        title: "Check out this Addis discovery on NU",
        text: `I found a great place to see in Addis on NU: ${form.name || 'Addis Local Gem'}`,
        url: window.location.origin
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(shareData.url);
            alert("Link copied to clipboard!");
        }
    } catch (err) {
        console.error("Error sharing:", err);
    }
  };

  const resetForm = () => {
    setForm({
        name: "",
        category: "Hidden Gem",
        area: "",
        description: "",
        photos: []
    });
    setStage("SELECT");
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-32">
       {/* Background Ambience */}
      {stage === 'SELECT' && (
        <div className="absolute inset-0 bg-cover bg-center grayscale opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=2073&auto=format&fit=crop')" }} />
      )}

      {/* Header Overlay */}
      <div className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50">
        <div className="flex gap-2">
            {stage !== 'SELECT' && (
                <button 
                    onClick={() => setStage(stage === 'ERROR' || stage === 'SUCCESS' ? 'SELECT' : 'SELECT')}
                    className="bg-white/20 backdrop-blur-xl p-3 rounded-2xl border border-white/20 text-[#1A1612]"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
            )}
            <Link href="/" className="bg-white/20 backdrop-blur-xl p-3 rounded-2xl border border-white/20 text-[#1A1612]">
                <X className="w-5 h-5" />
            </Link>
        </div>
        <button 
            onClick={handleShare}
            className="bg-[#C9973B] text-white p-3 rounded-2xl border border-white/20 shadow-xl shadow-[#C9973B]/20 active:scale-95 transition-all"
        >
            <Share2 className="w-5 h-5" />
        </button>
      </div>

      {stage === 'SELECT' && (
        <div className="pt-24 px-8 space-y-12 max-w-2xl mx-auto flex flex-col items-center text-center animate-in fade-in duration-500">
            <div className="space-y-4">
                <div className="w-20 h-20 bg-[#C9973B]/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
                    <MapPin className="w-10 h-10 text-[#C9973B]" />
                </div>
                <h1 className="text-4xl font-black text-[#1A1612] italic uppercase tracking-tighter leading-tight">Add Things to See in Addis</h1>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest max-w-[280px] mx-auto leading-relaxed">
                    Share a place, hidden gem, or local experience others should discover.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 w-full">
                <button 
                    onClick={() => setStage("FORM")}
                    className="group bg-[#1A1612] text-white rounded-[2.5rem] p-8 flex flex-col items-center gap-4 transition-all hover:bg-[#C9973B] shadow-2xl active:scale-95"
                >
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6 text-[#C9973B]" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.25em]">Add a Place</span>
                </button>
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white rounded-[2.5rem] p-6 flex flex-col items-center gap-3 border border-gray-100 shadow-sm active:scale-95"
                    >
                         <Upload className="w-5 h-5 text-gray-400" />
                         <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Upload Photos</span>
                    </button>
                    <button 
                        onClick={() => setStage("MY_SUBMISSIONS")}
                        className="bg-white rounded-[2.5rem] p-6 flex flex-col items-center gap-3 border border-gray-100 shadow-sm active:scale-95"
                    >
                         <History className="w-5 h-5 text-gray-400" />
                         <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">My Submissions</span>
                    </button>
                </div>
            </div>
            <input type="file" hidden ref={fileInputRef} onChange={handleFileUpload} accept="image/*" multiple />
        </div>
      )}

      {stage === 'FORM' && (
        <div className="pt-24 px-6 space-y-8 animate-in slide-in-from-bottom-10 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-black text-[#1A1612] uppercase italic tracking-tighter italic">Submission Form</h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Help others discover Addis</p>
            </div>

            <div className="space-y-6">
                {/* Photo Upload Section */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#C9973B] uppercase tracking-[0.2em]">Photos</label>
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="shrink-0 w-24 h-24 bg-gray-100 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 text-gray-400 hover:text-[#C9973B] hover:border-[#C9973B]/30 transition-all"
                        >
                            <ImageIcon className="w-6 h-6 mb-1" />
                            <span className="text-[8px] font-black uppercase tracking-widest">Add</span>
                        </button>
                        {form.photos.map((photo, i) => (
                            <div key={i} className="shrink-0 w-24 h-24 rounded-2xl overflow-hidden relative group">
                                <img src={photo} className="w-full h-full object-cover" />
                                <button 
                                    onClick={() => setForm(f => ({ ...f, photos: f.photos.filter((_, idx) => idx !== i) }))}
                                    className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Input Fields */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#C9973B] uppercase tracking-[0.2em]">Place Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Hidden Garden Café"
                            className="w-full bg-white border border-gray-100 p-4 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#C9973B]/20"
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#C9973B] uppercase tracking-[0.2em]">Category</label>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => setForm(f => ({ ...f, category: cat }))}
                                    className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                                        form.category === cat 
                                        ? "bg-[#1A1612] text-white shadow-lg" 
                                        : "bg-white text-gray-400 border border-gray-100"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#C9973B] uppercase tracking-[0.2em]">Area / Location</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Bole, near Friendship Park"
                            className="w-full bg-white border border-gray-100 p-4 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#C9973B]/20"
                            value={form.area}
                            onChange={e => setForm(f => ({ ...f, area: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#C9973B] uppercase tracking-[0.2em]">Description</label>
                        <textarea 
                            rows={4}
                            placeholder="Tell us what makes this place special..."
                            className="w-full bg-white border border-gray-100 p-4 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#C9973B]/20 resize-none"
                            value={form.description}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        />
                    </div>
                </div>

                <button 
                    onClick={handleSubmit}
                    className="w-full bg-[#1A1612] text-white p-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] transition-all group"
                >
                    <span className="text-[11px] font-black uppercase tracking-[0.3em]">Submit for Review</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
            </div>
            <input type="file" hidden ref={fileInputRef} onChange={handleFileUpload} accept="image/*" multiple />
        </div>
      )}

      {stage === 'SUBMITTING' && (
        <div className="h-screen flex flex-col items-center justify-center p-8 space-y-8 animate-in fade-in duration-700">
            <div className="relative">
                <div className="w-32 h-32 bg-[#C9973B]/10 rounded-[2.5rem] flex items-center justify-center animate-pulse">
                    <Sparkles className="w-12 h-12 text-[#C9973B]" />
                </div>
            </div>
            <div className="text-center space-y-2">
                <h2 className="text-[#1A1612] text-xl font-black uppercase italic tracking-tighter">Processing</h2>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] animate-pulse">Uploading to NU Core</p>
            </div>
        </div>
      )}

      {stage === 'SUCCESS' && (
        <div className="h-screen flex flex-col items-center justify-center p-8 space-y-8 text-center animate-in zoom-in-95 duration-500">
             <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center shadow-xl shadow-emerald-100 mb-4 scale-110">
                <CheckCircle className="w-12 h-12 text-emerald-500" />
            </div>
            <div className="text-center space-y-3">
                <h2 className="text-[#1A1612] text-3xl font-black uppercase italic tracking-tighter">Success!</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest max-w-[280px] mx-auto leading-relaxed">
                    Your discovery has been submitted for review. Help people discover Addis by sharing this page.
                </p>
            </div>
            
            <div className="flex flex-col gap-4 w-full max-w-xs">
                <button 
                    onClick={handleShare}
                    className="bg-[#C9973B] text-[#1A1612] p-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-[#C9973B]/20 animate-bounce transition-all active:scale-95"
                >
                    Share Discovery
                </button>
                <button 
                    onClick={resetForm}
                    className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-4 hover:text-[#1A1612] transition-colors"
                >
                    Add Another Place
                </button>
            </div>
        </div>
      )}

      {stage === 'MY_SUBMISSIONS' && (
        <div className="pt-24 px-6 space-y-8 animate-in slide-in-from-right duration-500">
             <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <p className="text-[9px] font-black text-[#C9973B] uppercase tracking-[0.3em]">History</p>
                    <h2 className="text-2xl font-black text-[#1A1612] uppercase tracking-tighter italic italic">My Submissions</h2>
                </div>
            </div>

            <div className="space-y-4">
                {submissions.length === 0 ? (
                    <div className="bg-white p-12 rounded-[2.5rem] border border-gray-100 text-center space-y-4">
                        <Info className="w-8 h-8 text-gray-200 mx-auto" />
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">No submissions yet</p>
                    </div>
                ) : (
                    submissions.map(sub => (
                        <div key={sub.id} className="bg-white p-5 rounded-2xl border border-gray-50 shadow-sm flex gap-4 items-center">
                            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                                {sub.photos[0] ? (
                                    <img src={sub.photos[0]} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="w-6 h-6 text-gray-200" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-black text-[#1A1612] uppercase tracking-tight truncate">{sub.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[8px] font-black text-gray-400 border border-gray-100 px-2 py-0.5 rounded-md uppercase">{sub.category}</span>
                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase ${
                                        sub.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                                    }`}>
                                        {sub.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <button 
                onClick={() => setStage("SELECT")}
                className="w-full text-gray-400 text-[10px] font-black uppercase tracking-widest mt-8 flex items-center justify-center gap-2"
            >
                <ChevronLeft className="w-4 h-4" /> Back to menu
            </button>
        </div>
      )}

      {stage === 'ERROR' && (
        <div className="h-screen flex flex-col items-center justify-center p-8 space-y-8 animate-in zoom-in-95 duration-500">
             <div className="w-24 h-24 bg-rose-50 rounded-[2.5rem] flex items-center justify-center shadow-xl shadow-rose-100 mb-4 animate-bounce">
                <AlertTriangle className="w-12 h-12 text-rose-500" />
            </div>
            <div className="text-center space-y-3">
                <h2 className="text-[#1A1612] text-2xl font-black uppercase italic tracking-tighter">Oops!</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest max-w-[240px] mx-auto leading-relaxed">
                    {errorMsg}
                </p>
            </div>
            <button 
                onClick={() => setStage("FORM")}
                className="bg-[#1A1612] text-[#C9973B] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#1A1612]/20 flex items-center gap-2 group transition-all"
            >
                <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" /> Fix Errors
            </button>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
