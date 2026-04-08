"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function EditProfilePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        bio: "",
        languages: [] as string[]
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                phone: user.phone || "",
                bio: user.bio || "",
                languages: user.languages || []
            });
        }
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 1000));
        setLoading(false);
        router.push("/profile");
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-6 text-center">
                <div className="space-y-4">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Sign in to edit your profile</p>
                    <Link href="/auth" className="inline-block bg-[#1A1612] text-[#C9973B] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                        Go to Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAF8] pb-12">
            <div className="bg-[#1A1612] px-6 pt-16 pb-12 rounded-b-[3.5rem] shadow-2xl relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between">
                    <Link href="/profile" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all border border-white/10">
                        <ArrowLeft className="w-5 h-5 text-gray-400" />
                    </Link>
                    <h1 className="text-xl font-black text-white tracking-tighter uppercase italic">Update Profile</h1>
                    <div className="w-10" />
                </div>
            </div>

            <div className="px-6 -mt-8 max-w-2xl mx-auto relative z-20">
                <form onSubmit={handleSave} className="bg-white rounded-[3rem] p-8 shadow-xl border border-gray-100 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2 px-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#C9973B]/20 text-sm font-bold focus:outline-none transition-all text-gray-900"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 px-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                <input 
                                    type="tel" 
                                    placeholder="+251 ..."
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#C9973B]/20 text-sm font-bold focus:outline-none transition-all text-gray-900"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 px-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Short Bio</label>
                            <textarea 
                                rows={4}
                                placeholder="Tell us about your travels..."
                                value={formData.bio}
                                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                className="w-full p-5 bg-gray-50 rounded-2xl border border-transparent focus:border-[#C9973B]/20 text-sm font-bold focus:outline-none transition-all resize-none text-gray-900"
                            ></textarea>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-5 bg-[#1A1612] text-[#C9973B] text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-[#C9973B]/10 hover:bg-[#C9973B] hover:text-[#1A1612] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                            <>
                                SAVE CHANGES <Save className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
