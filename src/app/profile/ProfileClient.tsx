"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";
import Link from "next/link";
import {
    ShieldAlert, Shield, FileText, CheckCircle, User, Heart, Settings, LogIn, LogOut,
    Sparkles, ArrowRight, MapPin, X, Mail, Lock, UserPlus, Loader2, Trash2, Send,
    FolderHeart, Map, Share2, Plus, Check, Copy, Globe, Calendar, Edit, Eye,
    Bell, HardDrive, Info, HelpCircle
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { UnifiedPreferences } from "@/components/profile/UnifiedPreferences";
import { BottomNav } from "@/components/BottomNav";

// ── Shared UI Components ──────────────────────────────

function SectionHeader({ title, desc, icon: Icon, colorClass }: any) {
    return (
        <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 ${colorClass} rounded-2xl flex items-center justify-center shadow-sm`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-base font-black text-[#1A1612] tracking-tight uppercase">{title}</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{desc}</p>
            </div>
        </div>
    );
}

// ── Profile Sections ──────────────────────────────

function NotificationsSection() {
    const [enabled, setEnabled] = useState({ travel: true, news: false, bookings: true });
    return (
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-400">
            <SectionHeader title="Notifications" desc="Stay updated in real-time" icon={Bell} colorClass="bg-blue-50 text-blue-500" />
            <div className="space-y-3">
                {[
                    { id: 'travel', label: 'Travel Alerts', desc: 'Safety and weather updates', icon: ShieldAlert },
                    { id: 'news', label: 'New Discoveries', desc: 'When we add new gems to NU', icon: Sparkles },
                    { id: 'bookings', label: 'Booking Updates', desc: 'Confirmation and host messages', icon: Mail }
                ].map((item) => (
                    <button 
                        key={item.id}
                        onClick={() => setEnabled({...enabled, [item.id]: !enabled[item.id as keyof typeof enabled]})}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all"
                    >
                        <div className="flex items-center gap-3 text-left">
                            <item.icon className="w-4 h-4 text-gray-400" />
                            <div>
                                <p className="text-xs font-black text-gray-900">{item.label}</p>
                                <p className="text-[10px] text-gray-500 font-medium">{item.desc}</p>
                            </div>
                        </div>
                        <div className={`w-10 h-5 rounded-full transition-colors relative ${enabled[item.id as keyof typeof enabled] ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${enabled[item.id as keyof typeof enabled] ? 'left-6' : 'left-1'}`} />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

function OfflineSection() {
    return (
        <div className="bg-[#1A1612] rounded-[2.5rem] p-6 shadow-xl border border-[#C9973B]/20 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <SectionHeader title="Offline Mode" desc="Travel without connection" icon={HardDrive} colorClass="bg-[#C9973B] text-[#1A1612]" />
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black text-white">Storage Used</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">0.0 MB / 500 MB</p>
                    </div>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-0 h-full bg-[#C9973B]" />
                </div>
            </div>
            <button className="w-full py-4 bg-[#C9973B] text-[#1A1612] text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-[#C9973B]/10 hover:bg-white transition-all">
                Download Destination Map
            </button>
        </div>
    );
}

function SupportSection() {
    return (
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <SectionHeader title="Support" desc="We're here to help" icon={HelpCircle} colorClass="bg-purple-50 text-purple-500" />
            <div className="grid grid-cols-1 gap-2">
                <button 
                  onClick={() => window.location.href="mailto:support@nuethiopia.app"}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all border border-gray-100"
                >
                    <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-xs font-black text-gray-900">Email Global Support</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300" />
                </button>
                <Link 
                  href="/report-listing"
                  className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all border border-gray-100"
                >
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="w-4 h-4 text-red-400" />
                        <span className="text-xs font-black text-gray-900">Report a Listing</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300" />
                </Link>
            </div>
        </div>
    );
}

function SavedPlaces() {
    const { data: favs, isLoading } = useQuery({
        queryKey: ["favorites"],
        queryFn: async () => {
            const res = await fetch("/api/user/favorites");
            if (!res.ok) throw new Error("Failed");
            const d = await res.json();
            return d.favorites || [];
        }
    });

    if (isLoading) return <div className="space-y-2"><div className="h-20 bg-gray-100 rounded-2xl animate-pulse" /></div>;
    if (!favs || favs.length === 0) return (
        <div className="py-12 border border-dashed border-gray-200 rounded-2xl text-center">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No places saved yet</p>
        </div>
    );

    return (
        <div className="space-y-3">
            {favs.map((fav: any) => (
                <Link key={fav.id} href={`/place/${fav.place.slug}`} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-50 shadow-sm group">
                    <div className="w-16 h-16 rounded-xl overflow-hidden relative grayscale group-hover:grayscale-0 transition-all">
                        <Image src={fav.place.images[0]?.imageUrl || "/placeholder.jpg"} alt={fav.place.name} fill className="object-cover" sizes="64px" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-gray-900 line-clamp-1">{fav.place.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{fav.place.city}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
}

function DeleteAccountModal({ onClose }: { onClose: () => void }) {
    const { logout } = useAuth();
    const [password, setPassword] = useState("");
    const [confirmPhrase, setConfirmPhrase] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        if (confirmPhrase !== "DELETE") { setError("Type DELETE to confirm"); return; }
        setLoading(true);
        try {
            const res = await fetch("/api/user/account/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password, confirmPhrase }),
            });
            if (!res.ok) throw new Error("Deletion failed. Is your password correct?");
            await logout();
            window.location.href = "/";
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-[2.5rem] p-8 w-full max-w-sm space-y-6 shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center mx-auto text-red-500">
                        <Trash2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-lg font-black uppercase italic tracking-tighter">Destroy Account</h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                        This will permanently wipe your data from NU Ethiopia databases. This cannot be undone.
                    </p>
                </div>
                <form onSubmit={handleDelete} className="space-y-4">
                    <input 
                      type="password" 
                      placeholder="Your Password" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-red-500/20 text-sm font-bold"
                    />
                    <input 
                      type="text" 
                      placeholder='Type "DELETE"' 
                      value={confirmPhrase}
                      onChange={e => setConfirmPhrase(e.target.value.toUpperCase())}
                      className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-red-500/20 text-sm font-bold"
                    />
                    {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{error}</p>}
                    <button 
                      type="submit" 
                      disabled={loading || confirmPhrase !== "DELETE"}
                      className="w-full py-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-red-200 disabled:opacity-30"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Verify & Destroy Permanent"}
                    </button>
                    <button type="button" onClick={onClose} className="w-full text-[9px] font-black uppercase tracking-widest text-gray-400">Cancel</button>
                </form>
            </div>
        </div>
    );
}

// ── Profile Client Main ──────────────────────────────

export function ProfileClient() {
    const { user, logout, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState<"preferences" | "account" | "saved">("preferences");
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    if (authLoading) {
        return (
            <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#C9973B] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAF8] pb-32">
            {/* Minimal Header */}
            <div className="bg-[#1A1612] px-6 pt-16 pb-12 rounded-b-[3.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9973B]/10 rounded-full blur-[80px]" />
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <p className="text-[#C9973B] text-[10px] font-black uppercase tracking-[0.3em] mb-1">Authenticated</p>
                        <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">{user ? user.name : "Guest Traveler"}</h1>
                        {user && <p className="text-gray-400 text-xs font-medium">{user.email}</p>}
                    </div>
                    {user ? (
                        <button onClick={logout} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-red-500/20 transition-all border border-white/10 group">
                            <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                        </button>
                    ) : (
                        <button onClick={() => window.location.href='/login'} className="bg-[#C9973B] text-[#1A1612] px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#C9973B]/20">
                            Sign In
                        </button>
                    )}
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-6 mt-[-1.5rem] relative z-20 flex gap-2">
                {[
                    { id: 'preferences', label: 'Regional', icon: Globe },
                    { id: 'saved', label: 'Journal', icon: Heart },
                    { id: 'account', label: 'Account', icon: Settings },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 py-4 rounded-[1.5rem] flex flex-col items-center gap-1.5 transition-all shadow-xl ${activeTab === tab.id ? 'bg-white text-[#C9973B] border-b-4 border-[#C9973B]' : 'bg-gray-100 text-gray-400'}`}
                    >
                        <tab.icon className="w-5 h-5" />
                        <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Scrollable Content */}
            <div className="px-6 mt-8 space-y-6 max-w-2xl mx-auto">
                {activeTab === 'preferences' && (
                    <div className="space-y-6 mb-8">
                        <UnifiedPreferences />
                        <NotificationsSection />
                        <OfflineSection />
                    </div>
                )}

                {activeTab === 'account' && (
                    <div className="space-y-6 mb-8">
                        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 space-y-4">
                            <SectionHeader title="Personal Space" desc="Your account safety" icon={User} colorClass="bg-gray-50 text-gray-900" />
                            <div className="space-y-3">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-transparent">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                                    <p className="text-sm font-bold text-gray-900">{user?.email || "Guest"}</p>
                                </div>
                                <Link href="/profile/edit" className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all">
                                    <span className="text-xs font-black text-gray-900">Update Profile Details</span>
                                    <Edit className="w-4 h-4 text-gray-400" />
                                </Link>
                            </div>
                        </div>

                        <SupportSection />

                        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 space-y-4">
                            <SectionHeader title="Compliance" desc="The legal bits" icon={Shield} colorClass="bg-slate-50 text-slate-500" />
                            <div className="grid grid-cols-2 gap-2">
                                <Link href="/legal/privacy" className="p-4 bg-gray-50 rounded-2xl text-center border border-transparent hover:border-gray-200">
                                    <p className="text-[10px] font-black uppercase tracking-widest">Privacy</p>
                                </Link>
                                <Link href="/legal/terms" className="p-4 bg-gray-50 rounded-2xl text-center border border-transparent hover:border-gray-200">
                                    <p className="text-[10px] font-black uppercase tracking-widest">Terms</p>
                                </Link>
                            </div>
                        </div>

                        {user && (
                            <button 
                                onClick={() => setShowDeleteModal(true)}
                                className="w-full flex items-center justify-center gap-3 py-6 text-red-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Delete My Account</span>
                            </button>
                        )}
                    </div>
                )}

                {activeTab === 'saved' && (
                    <div className="space-y-6 mb-8">
                         <div className="flex items-center justify-between px-1 pt-4">
                            <h2 className="text-xl font-black italic uppercase tracking-tighter">Travel Journal</h2>
                            <span className="text-[10px] font-black text-[#C9973B] uppercase tracking-widest bg-[#C9973B]/10 px-3 py-1 rounded-full">
                                {user ? "Saved Items" : "Guest View"}
                            </span>
                         </div>
                         
                         {user ? (
                             <SavedPlaces />
                         ) : (
                             <div className="py-20 text-center space-y-6">
                                <div className="w-20 h-20 bg-rose-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 transform -rotate-12">
                                    <Heart className="w-10 h-10 text-rose-400" />
                                </div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest max-w-xs mx-auto">
                                    Sign in to save your favorite stays and itineraries here.
                                </p>
                                <Link href="/login" className="inline-flex items-center gap-2 bg-[#1A1612] text-[#C9973B] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#C9973B]/5">
                                    Sign In to Save <ArrowRight className="w-4 h-4" />
                                </Link>
                             </div>
                         )}
                    </div>
                )}
            </div>

            <BottomNav />

            {showDeleteModal && <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />}
        </div>
    );
}
