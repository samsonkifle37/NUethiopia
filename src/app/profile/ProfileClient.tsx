"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";
import Link from "next/link";
import {
    ShieldAlert, Shield, FileText, CheckCircle, User, Heart, Settings, LogIn, LogOut,
    Sparkles, ArrowRight, MapPin, X, Mail, Lock, UserPlus, Loader2, Trash2, Send,
    FolderHeart, Map, Share2, Plus, Check, Copy, Globe, Calendar, Edit, Eye,
    Bell, HardDrive, Info, HelpCircle, Camera, Upload, Image as ImageIcon
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCalendar } from "@/contexts/CalendarContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { UnifiedPreferences } from "@/components/profile/UnifiedPreferences";
import { BottomNav } from "@/components/BottomNav";

// ── Types ──────────────────────────────

interface DiscoveryPost {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string;
    category: string;
    status: string;
    createdAt: string;
}

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

// ── Journal Components ──────────────────────────────

function GemCard({ gem, onDelete }: { gem: DiscoveryPost; onDelete: (id: string) => void }) {
    return (
        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-md border border-gray-100 flex flex-col group animate-in fade-in duration-500">
            <div className="aspect-[4/5] relative overflow-hidden">
                <img src={gem.imageUrl} alt={gem.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${gem.status === 'APPROVED' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                        {gem.status}
                    </span>
                </div>
                <button onClick={() => onDelete(gem.id)} className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white/60 hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                </button>
            </div>
            <div className="p-6 space-y-3">
                <h4 className="text-sm font-black text-[#1A1612] uppercase tracking-tight">{gem.title}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(gem.createdAt).toLocaleDateString()}</p>
                <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                    <Link href={`/discover/${gem.id}`} className="text-[10px] font-black text-[#C9973B] uppercase tracking-widest flex items-center gap-1">
                        View Public Page <ArrowRight size={12} />
                    </Link>
                </div>
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

function DeleteAccountModal({ onClose }: { onClose: () => void }) {
    const { logout } = useAuth();
    const [password, setPassword] = useState("");
    const [confirmPhrase, setConfirmPhrase] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        const phraseUpper = confirmPhrase.trim().toUpperCase();
        if (phraseUpper !== "DELETE") { setError("Type DELETE accurately to confirm"); return; }
        
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/user/account/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password, confirmPhrase: phraseUpper }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Deletion failed. Check password.");
            
            await logout();
            window.location.href = "/";
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
            <div className="relative bg-white rounded-[3.5rem] p-10 w-full max-w-sm space-y-8 shadow-2xl animate-in zoom-in-95 duration-300 border border-red-50">
                <div className="text-center space-y-3">
                    <div className="w-20 h-20 bg-red-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-red-500 shadow-sm border border-red-100">
                        <Trash2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter text-red-600">Permanently Delete?</h2>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                        This action will wipe your profile, saved places, and itineraries. There is no undo.
                    </p>
                </div>
                <form onSubmit={handleDelete} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Identity Verification</label>
                        <input 
                            type="password" 
                            placeholder="Enter Account Password" 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full p-5 bg-gray-50 rounded-2xl border border-transparent focus:border-red-500/20 text-sm font-bold outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Confirmation Phrase</label>
                        <input 
                            type="text" 
                            placeholder='Type "DELETE"' 
                            value={confirmPhrase}
                            onChange={e => setConfirmPhrase(e.target.value)}
                            className="w-full p-5 bg-gray-50 rounded-2xl border border-transparent focus:border-red-500/20 text-sm font-black outline-none tracking-widest text-center"
                        />
                    </div>
                    {error && (
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                            <p className="text-[10px] text-red-600 font-black uppercase tracking-widest text-center leading-tight">{error}</p>
                        </div>
                    )}
                    <div className="pt-4 space-y-3">
                        <button 
                            type="submit" 
                            disabled={loading || confirmPhrase.toUpperCase() !== "DELETE"}
                            className="w-full py-5 bg-red-600 text-white text-[11px] font-black uppercase tracking-[0.25em] rounded-2xl shadow-2xl shadow-red-200 disabled:opacity-20 active:scale-95 transition-all"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Verify & WIPE DATA NOW"}
                        </button>
                        <button type="button" onClick={onClose} className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-gray-900 transition-colors">
                            I've changed my mind
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── Profile Client Main ──────────────────────────────

export function ProfileClient() {
    const { user, logout, loading: authLoading } = useAuth();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<"regional" | "journal" | "account">("regional");
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { data: myGems, isLoading: gemsLoading } = useQuery({
        queryKey: ["my-gems", user?.id],
        queryFn: async () => {
             const res = await fetch("/api/discovery/user");
             if (!res.ok) return [];
             const d = await res.json();
             return d.posts || [];
        },
        enabled: !!user
    });

    const deleteGem = async (id: string) => {
        if (!confirm("Remove this gem permanently?")) return;
        const res = await fetch(`/api/discovery/${id}`, { method: 'DELETE' });
        if (res.ok) queryClient.invalidateQueries({ queryKey: ["my-gems"] });
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#C9973B] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAF8] pb-32">
            {/* Header Area */}
            <div className="bg-[#1A1612] px-6 pt-20 pb-14 rounded-b-[4rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9973B]/10 rounded-full blur-[100px] animate-pulse" />
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <p className="text-[#C9973B] text-[10px] font-black uppercase tracking-[0.4em] mb-2">{user ? "Active Explorer" : "Guest Mode"}</p>
                        <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">{user ? user.name : "Ahlan Travel"}</h1>
                        {user && <p className="text-white/40 text-xs font-semibold mt-1">{user.email}</p>}
                    </div>
                    {user ? (
                        <button onClick={logout} className="w-14 h-14 bg-white/5 rounded-3xl flex items-center justify-center hover:bg-red-500/10 transition-all border border-white/10 group">
                            <LogOut className="w-6 h-6 text-gray-400 group-hover:text-red-500" />
                        </button>
                    ) : (
                        <Link href="/auth?callbackUrl=/profile" className="bg-[#C9973B] text-[#1A1612] px-8 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-[#C9973B]/20 active:scale-95 transition-all">
                            Sign In
                        </Link>
                    )}
                </div>
            </div>

            {/* Navigation Tabs (Inside Profile) */}
            <div className="px-6 mt-[-2rem] relative z-20 flex gap-2">
                {[
                    { id: 'regional', label: 'Choices', icon: Globe },
                    { id: 'journal', label: 'Gems', icon: Heart },
                    { id: 'account', label: 'Account', icon: Settings },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 py-5 rounded-[2rem] flex flex-col items-center gap-1.5 transition-all shadow-xl ${activeTab === tab.id ? 'bg-white text-[#C9973B] border-b-4 border-[#C9973B] scale-105' : 'bg-gray-50/80 backdrop-blur-md text-gray-400'}`}
                    >
                        <tab.icon className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="px-6 mt-10 space-y-8 max-w-2xl mx-auto">
                {activeTab === 'regional' && (
                    <div className="space-y-6 mb-8">
                        <UnifiedPreferences />
                        <NotificationsSection />
                        <OfflineSection />
                    </div>
                )}

                {activeTab === 'journal' && (
                    <div className="space-y-8 mb-8">
                        <div className="bg-[#1A1612] rounded-[2.5rem] p-8 text-center space-y-4 relative overflow-hidden shadow-2xl shadow-[#1A1612]/20">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9973B]/10 rounded-full blur-3xl pointer-events-none" />
                             <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">My Gems</h3>
                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] max-w-[200px] mx-auto">Hidden spots you've shared with the community</p>
                             <Link href="/discover/upload" className="inline-flex bg-[#C9973B] text-[#1A1612] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                                + Share New Gem
                             </Link>
                        </div>
                        
                        <div className="space-y-4">
                            <h3 className="text-base font-black uppercase tracking-tight italic">My Contributions</h3>
                            {gemsLoading ? (
                                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#C9973B]" /></div>
                            ) : !myGems || myGems.length === 0 ? (
                                <div className="py-20 bg-white rounded-[2.5rem] border border-gray-100 flex flex-col items-center justify-center space-y-4 shadow-sm">
                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200">
                                        <Sparkles size={32} />
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">No gems shared yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6">
                                    {myGems.map((gem: DiscoveryPost) => (
                                        <GemCard key={gem.id} gem={gem} onDelete={deleteGem} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'account' && (
                    <div className="space-y-6 mb-8">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 space-y-6">
                            <SectionHeader title="Account Details" desc="Manage your personal data" icon={User} colorClass="bg-gray-50 text-gray-900" />
                            <div className="space-y-3">
                                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Registered Email</label>
                                    <p className="text-sm font-bold text-gray-900">{user?.email || "Guest User"}</p>
                                </div>
                                <Link href="/profile/edit" className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 hover:border-[#C9973B]/30 transition-all group">
                                    <span className="text-xs font-black text-gray-900 group-hover:text-[#C9973B]">Update Full Profile</span>
                                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#C9973B]" />
                                </Link>
                                <Link href="/itineraries" className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 hover:border-[#C9973B]/30 transition-all group">
                                    <span className="text-xs font-black text-gray-900 group-hover:text-[#C9973B]">My Detailed Itineraries</span>
                                    <Map className="w-4 h-4 text-gray-300 group-hover:text-[#C9973B]" />
                                </Link>
                            </div>
                        </div>

                        <SupportSection />

                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 space-y-6">
                            <SectionHeader title="Compliance" desc="Legal & Privacy documentation" icon={Shield} colorClass="bg-slate-50 text-slate-500" />
                            <div className="grid grid-cols-2 gap-3">
                                <Link href="/legal/privacy" className="p-5 bg-gray-50 rounded-2xl text-center hover:bg-gray-100 transition-all border border-transparent">
                                    <p className="text-[10px] font-black uppercase tracking-widest">Privacy Policy</p>
                                </Link>
                                <Link href="/legal/terms" className="p-5 bg-gray-50 rounded-2xl text-center hover:bg-gray-100 transition-all border border-transparent">
                                    <p className="text-[10px] font-black uppercase tracking-widest">Legal Terms</p>
                                </Link>
                            </div>
                        </div>

                        {user && (
                            <div className="pt-6 border-t border-gray-100">
                                <button 
                                    onClick={() => setShowDeleteModal(true)}
                                    className="w-full flex items-center justify-center gap-3 py-6 bg-red-50 text-red-500 rounded-3xl border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm group"
                                >
                                    <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="text-[11px] font-black uppercase tracking-[0.25em]">Terminate Account</span>
                                </button>
                            </div>
                        )}
                        
                        {!user && (
                             <div className="bg-[#C9973B]/5 p-8 rounded-[2.5rem] border border-[#C9973B]/20 text-center space-y-4">
                                <p className="text-[10px] font-black text-[#C9973B] uppercase tracking-[0.3em]">Unlock Account Features</p>
                                <p className="text-xs text-gray-800 font-medium italic">Sign in to sync your data across devices, save listings, and see your trip history.</p>
                                <Link href="/auth?callbackUrl=/profile" className="inline-flex bg-[#1A1612] text-[#C9973B] px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                                    Sign In Globally
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
