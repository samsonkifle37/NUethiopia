import React from "react";
import { ArrowLeft, UserCheck, Shield, MessageSquare, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function ModerationPage() {
    return (
        <div className="min-h-screen bg-[#FAFAF8] pb-24">
            <div className="bg-[#1A1612] px-6 pt-20 pb-16 rounded-b-[4rem] text-center">
                <Link href="/legal/compliance" className="inline-flex w-12 h-12 bg-white/5 rounded-2xl items-center justify-center mb-6 border border-white/10">
                    <ArrowLeft className="w-6 h-6 text-gray-400" />
                </Link>
                <p className="text-[#C9973B] text-[10px] font-black uppercase tracking-[0.4em] mb-2">Platform Integrity</p>
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Community Moderation</h1>
            </div>

            <div className="px-6 -mt-8 max-w-2xl mx-auto space-y-6">
                <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100 space-y-10 text-gray-800">
                    
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                                <Shield size={20} />
                            </div>
                            <h2 className="text-sm font-black uppercase tracking-tight">Our Philosophy</h2>
                        </div>
                        <p className="text-xs leading-relaxed font-medium">
                            NU Ethiopia is built on trust and authenticity. We moderate content to ensure that every gem, review, and itinerary meets our rigorous standards for quality, safety, and cultural respect.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                                <AlertTriangle size={20} />
                            </div>
                            <h2 className="text-sm font-black uppercase tracking-tight">What We Do Not Allow</h2>
                        </div>
                        <ul className="grid grid-cols-1 gap-3">
                            {[
                                "Inaccurate listing details or locations",
                                "Fake reviews or self-promotion by owners",
                                "Offensive, discriminatory, or culturally insensitive media",
                                "Low-quality images (blurry, watermark-heavy, or non-representative)"
                            ].map((item) => (
                                <li key={item} className="p-4 bg-gray-50 rounded-2xl text-[10px] font-black uppercase tracking-tight flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="space-y-4 border-t border-gray-50 pt-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                                <MessageSquare size={20} />
                            </div>
                            <h2 className="text-sm font-black uppercase tracking-tight">Reporting System</h2>
                        </div>
                        <p className="text-xs leading-relaxed font-medium">
                            We rely on our community. If you see something that shouldn't be here, use the "Report" button on any listing. Our team reviews every report within 24 hours.
                        </p>
                        <Link href="/report-listing" className="inline-block text-[10px] font-black text-[#C9973B] uppercase tracking-[0.2em] pt-2">
                            Go to Report Form →
                        </Link>
                    </section>
                </div>
            </div>
        </div>
    );
}
