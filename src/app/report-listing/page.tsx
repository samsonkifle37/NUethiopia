"use client";

import React, { useState } from "react";
import { ShieldAlert, Send, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ReportListingPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1500);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-6">
                <div className="bg-white rounded-[3rem] p-12 shadow-2xl text-center space-y-6 max-w-md animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-black italic uppercase tracking-tighter">Report Received</h1>
                        <p className="text-sm text-gray-500 font-medium">Thank you for helping keep NU Ethiopia accurate. Our team will audit this listing within 24 hours.</p>
                    </div>
                    <Link href="/" className="inline-block bg-[#1A1612] text-[#C9973B] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#C9973B]/10">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAF8] pb-12">
            {/* Header */}
            <div className="bg-[#1A1612] px-6 pt-16 pb-12 rounded-b-[3.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px]" />
                <div className="relative z-10">
                    <Link href="/profile" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-6 hover:bg-white/10 transition-all border border-white/10">
                        <ArrowLeft className="w-5 h-5 text-gray-400" />
                    </Link>
                    <div className="flex items-center gap-3 mb-2">
                        <ShieldAlert className="w-5 h-5 text-red-500" />
                        <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.3em]">Integrity Shield</p>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Report a Listing</h1>
                    <p className="text-gray-400 text-sm font-medium mt-2">Help us maintain the highest standard of travel data in Ethiopia.</p>
                </div>
            </div>

            <div className="px-6 -mt-8 max-w-2xl mx-auto relative z-20">
                <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] p-8 shadow-xl border border-gray-100 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2 px-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Which listing are you reporting?</label>
                            <input 
                                required
                                type="text" 
                                placeholder="Name of the Hotel, Restaurant, or Tour"
                                className="w-full p-5 bg-gray-50 rounded-2xl border border-transparent focus:border-[#C9973B]/20 text-sm font-bold focus:outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2 px-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">What is the issue?</label>
                            <select 
                                required
                                className="w-full p-5 bg-gray-50 rounded-2xl border border-transparent focus:border-[#C9973B]/20 text-sm font-bold focus:outline-none appearance-none cursor-pointer"
                            >
                                <option value="">Select an issue type</option>
                                <option value="closed">Permanently Closed</option>
                                <option value="wrong_info">Incorrect Information (Price, Hours)</option>
                                <option value="wrong_loc">Wrong Location / Map Marker</option>
                                <option value="fake">Fake Listing or Scam</option>
                                <option value="offensive">Inappropriate Content</option>
                                <option value="other">Other Issue</option>
                            </select>
                        </div>

                        <div className="space-y-2 px-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Further Details</label>
                            <textarea 
                                required
                                rows={4}
                                placeholder="Describe exactly what needs to be fixed..."
                                className="w-full p-5 bg-gray-50 rounded-2xl border border-transparent focus:border-[#C9973B]/20 text-sm font-bold focus:outline-none transition-all resize-none"
                            ></textarea>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-5 bg-[#1A1612] text-[#C9973B] text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-[#C9973B]/10 hover:bg-[#C9973B] hover:text-[#1A1612] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {loading ? "PROCESSING..." : (
                            <>
                                SUBMIT AUDIT REQUEST <Send className="w-4 h-4" />
                            </>
                        )}
                    </button>

                    <p className="text-[9px] text-gray-400 font-bold text-center uppercase tracking-widest leading-relaxed px-4">
                        By submitting, you agree to provide truthful information. Deliberate false reporting may result in account restrictions.
                    </p>
                </form>
            </div>
        </div>
    );
}
