"use client";







import { useState } from "react";



import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";



import { useAuth } from "@/lib/auth-context";



import Image from "next/image";



import Link from "next/link";



import {



    ShieldAlert,
    CheckCircle,
    User,
    Heart,
    Settings,
    LogIn,
    LogOut,
    Sparkles,
    ArrowRight,
    MapPin,
    X,
    Mail,
    Lock,
    UserPlus,
    Loader2,
    Trash2,
    Send,
    FolderHeart,
    Map,
    Share2,
    Plus,
    Check,
    Copy,
    Globe,
    Calendar,
    Edit,
    Eye,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";







// ── Auth Modal ──────────────────────────────

function AuthModal({ onClose }: { onClose: () => void }) {
    const { login, register } = useAuth();
    const [mode, setMode] = useState<"login" | "register">("login");
    const [accountType, setAccountType] = useState<"user" | "host">("user");
    const [name, setName] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");
        setLoading(true);

        const result =
            mode === "login"
                ? await login(email, password)
                : await register(name, email, password, accountType, accountType === "host" ? businessName : undefined);

        setLoading(false);

        if (result.error) {
            setError(result.error);
        } else if (mode === "register") {
            setSuccessMsg("✅ Registration successful! Check your email to verify your account.");
            setTimeout(() => {
                if (accountType === "host") {
                    window.location.href = "/profile/host";
                } else {
                    onClose();
                }
            }, 3000);
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-t-[2rem] sm:rounded-[2rem] w-full max-w-md p-6 pb-10 animate-in slide-in-from-bottom duration-300">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                    <X className="w-4 h-4 text-gray-500" />
                </button>

                {/* Logo / Header */}
                <div className="text-center mb-6 pt-2">
                    <div className="w-14 h-14 bg-[#1A1612] rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <span className="text-[#D4AF37] text-xl font-black">N</span>
                    </div>
                    <h2 className="text-xl font-black tracking-tight text-gray-900">
                        {mode === "login" ? "Welcome Back" : "Create Account"}
                    </h2>
                    <p className="text-gray-400 text-xs mt-1 font-medium">
                        {mode === "login"
                            ? "Sign in to access your saved places & itineraries"
                            : "Join NU to experience or host the best of Ethiopia"}
                    </p>
                </div>

                {/* Email verification success */}
                {successMsg && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <p className="text-sm font-medium text-green-800 leading-snug">{successMsg}</p>
                    </div>
                )}

                {!successMsg && (
                    <form onSubmit={handleSubmit} className="space-y-3">

                        {/* Account type toggle — register only */}
                        {mode === "register" && (
                            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-4">
                                <button
                                    type="button"
                                    onClick={() => setAccountType("user")}
                                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${accountType === "user" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-black"}`}
                                >
                                    <User className="w-4 h-4" /> Traveller
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAccountType("host")}
                                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${accountType === "host" ? "bg-[#1A1612] text-[#D4AF37] shadow-sm" : "text-gray-500 hover:text-black"}`}
                                >
                                    <Settings className="w-4 h-4" /> Property Owner
                                </button>
                            </div>
                        )}

                        {/* Name field */}
                        {mode === "register" && (
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                <input
                                    type="text"
                                    placeholder="Full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]/40 text-sm font-medium"
                                />
                            </div>
                        )}

                        {/* Business / Property name — host only */}
                        {mode === "register" && accountType === "host" && (
                            <div className="space-y-1">
                                <div className="relative">
                                    <Settings className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                    <input
                                        type="text"
                                        placeholder="Business or Property Name"
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)}
                                        required
                                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]/40 text-sm font-medium"
                                    />
                                </div>
                                <p className="text-[10px] uppercase font-bold text-gray-400 pl-2">Applies to hotels, apartments & tours</p>
                            </div>
                        )}

                        {/* Email */}
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]/40 text-sm font-medium"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]/40 text-sm font-medium"
                            />
                        </div>

                        {error && (
                            <p className="text-red-600 text-xs font-bold bg-red-50 px-4 py-2.5 rounded-xl border border-red-100">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1A1612] text-[#D4AF37] py-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-50 mt-2"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : mode === "login" ? (
                                <><LogIn className="w-4 h-4" /> Sign In</>
                            ) : (
                                <><UserPlus className="w-4 h-4" /> {accountType === "host" ? "Register as Host" : "Create Account"}</>
                            )}
                        </button>
                    </form>
                )}

                {/* Toggle login/register */}
                <p className="text-center text-xs text-gray-400 mt-5 font-medium">
                    {mode === "login" ? (
                        <>
                            Don&apos;t have an account?{" "}
                            <button
                                onClick={() => { setMode("register"); setError(""); setSuccessMsg(""); }}
                                className="text-[#D4AF37] font-bold"
                            >
                                Sign Up
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <button
                                onClick={() => { setMode("login"); setError(""); setSuccessMsg(""); }}
                                className="text-[#D4AF37] font-bold"
                            >
                                Sign In
                            </button>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}





// ── {tr("profile","savedPlaces")} ────────────────────────────



interface FavoritePlace {



    id: string;



    placeId: string;



    place: {



        id: string;



        name: string;



        slug: string;



        type: string;



        city: string;



        area: string;



        shortDescription: string | null;



        images: { imageUrl: string }[];



    };



}







function SavedPlaces() {
    const { tr } = useLanguage();
    const queryClient = useQueryClient();







    const { data, isLoading } = useQuery({
        queryKey: ["favorites"],
        queryFn: async () => {
            const res = await fetch("/api/user/favorites", {
              credentials: "include",
            });
            if (!res.ok) throw new Error("Failed");
            return res.json();



        },



    });







    const removeMutation = useMutation({



        mutationFn: async (placeId: string) => {



            await fetch("/api/user/favorites", {



                method: "DELETE",



                headers: { "Content-Type": "application/json" },



                body: JSON.stringify({ placeId }),



            });



        },



        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),



    });







    if (isLoading) {



        return (



            <div className="space-y-3">



                {[1, 2].map((i) => (



                    <div key={i} className="bg-gray-100 animate-pulse h-20 rounded-2xl" />



                ))}



            </div>



        );



    }







    const favorites: FavoritePlace[] = data?.favorites || [];







    if (favorites.length === 0) {



        return (



            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">



                <div className="text-4xl mb-3">💝</div>



                <h3 className="text-sm font-bold text-gray-900">{tr("profile","noSavedYet")}</h3>



                <p className="text-gray-400 text-[11px] mt-1 font-medium">



                    Tap the heart icon on any place to save it here



                </p>



                <Link



                    href="/stays"



                    className="inline-flex items-center gap-1 mt-4 text-ethiopia-green text-[10px] font-black uppercase tracking-widest"



                >



                    Explore Places <ArrowRight className="w-3.5 h-3.5" />



                </Link>



            </div>



        );



    }







    return (



        <div className="space-y-3">



            {favorites.map((fav) => (



                <div



                    key={fav.id}



                    className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm border border-gray-50"



                >



                    <Link href={`/place/${fav.place.slug}`} className="flex-shrink-0">



                        <div className="relative w-16 h-16 rounded-xl overflow-hidden">



                            {fav.place.images[0] ? (



                                <Image



                                    src={fav.place.images[0].imageUrl}



                                    alt={fav.place.name}



                                    fill



                                    className="object-cover"



                                    sizes="64px"



                                />



                            ) : (



                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-lg">



                                    🏛️



                                </div>



                            )}



                        </div>



                    </Link>







                    <Link href={`/place/${fav.place.slug}`} className="flex-1 min-w-0">



                        <h4 className="text-sm font-bold text-gray-900 truncate">



                            {fav.place.name}



                        </h4>



                        <div className="flex items-center gap-1 text-gray-400 mt-0.5">



                            <MapPin className="w-3 h-3" />



                            <span className="text-[9px] font-bold uppercase tracking-wider truncate">



                                {fav.place.area ? `${fav.place.area}, ${fav.place.city}` : fav.place.city}



                            </span>



                        </div>



                    </Link>







                    <button



                        onClick={() => removeMutation.mutate(fav.placeId)}



                        className="flex-shrink-0 w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"



                    >



                        <Trash2 className="w-3.5 h-3.5 text-ethiopia-red" />



                    </button>



                </div>



            ))}



        </div>



    );



}







// ── Collections Panel ────────────────────────────────────

interface Collection {
    id: string;
    name: string;
    emoji?: string;
    color?: string;
    isDefault: boolean;
    favoriteCount: number;
    createdAt: string;
}

function CollectionsPanel() {
    const queryClient = useQueryClient();
    const [showCreate, setShowCreate] = useState(false);
    const [newName, setNewName] = useState("");
    const [newEmoji, setNewEmoji] = useState("⭐");

    const { data, isLoading } = useQuery({
        queryKey: ["collections"],
        queryFn: async () => {
            const res = await fetch("/api/user/collections", { credentials: "include" });
            if (!res.ok) throw new Error("Failed");
            return res.json();
        },
    });

    const createMutation = useMutation({
        mutationFn: async (payload: { name: string; emoji: string }) => {
            const res = await fetch("/api/user/collections", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Failed");
            return res.json();
        },
        onSuccess: () => {
            setNewName(""); setNewEmoji("⭐"); setShowCreate(false);
            queryClient.invalidateQueries({ queryKey: ["collections"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/user/collections/${id}`, {
                method: "DELETE", credentials: "include",
            });
            if (!res.ok) throw new Error("Failed");
            return res.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["collections"] }),
    });

    const collections: Collection[] = data?.collections || [];

    if (isLoading) return <div className="space-y-2">{[1,2].map(i => <div key={i} className="h-14 bg-gray-100 animate-pulse rounded-2xl" />)}</div>;

    return (
        <div className="space-y-3">
            {/* Create new */}
            {showCreate ? (
                <div className="bg-[#1A1A2E]/5 rounded-2xl p-4 border border-[#D4AF37]/20 space-y-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="e.g. Coffee Spots, Weekend Eats"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            className="flex-1 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30"
                            autoFocus
                        />
                        <input
                            type="text"
                            value={newEmoji}
                            onChange={e => setNewEmoji(e.target.value)}
                            maxLength={2}
                            className="w-14 text-center px-2 py-2.5 bg-white border border-gray-200 rounded-xl text-lg focus:outline-none"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => newName.trim() && createMutation.mutate({ name: newName.trim(), emoji: newEmoji })}
                            disabled={!newName.trim() || createMutation.isPending}
                            className="flex-1 py-2.5 bg-[#1A1A2E] text-white rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {createMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                            Create
                        </button>
                        <button onClick={() => setShowCreate(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold uppercase">
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setShowCreate(true)}
                    className="w-full flex items-center gap-2 py-3 px-4 border border-dashed border-[#D4AF37]/40 rounded-2xl text-[#D4AF37] text-xs font-black uppercase tracking-widest hover:bg-[#D4AF37]/5 transition-colors"
                >
                    <Plus className="w-4 h-4" /> New Collection
                </button>
            )}

            {/* Collections list */}
            {collections.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-2xl">
                    <div className="text-3xl mb-2">📂</div>
                    <p className="text-gray-400 text-xs font-medium">No collections yet — create one above</p>
                </div>
            ) : (
                collections.map(col => (
                    <div key={col.id} className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-gray-100 shadow-sm">
                        <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center text-xl shrink-0">
                            {col.emoji || "⭐"}
                        </div>
                        <Link href={`/favorites/collection/${col.id}`} className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{col.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium">{col.favoriteCount} place{col.favoriteCount !== 1 ? "s" : ""}</p>
                        </Link>
                        <Link href={`/favorites/collection/${col.id}`} className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-[#D4AF37]/10 transition-colors">
                            <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                        </Link>
                        {!col.isDefault && (
                            <button
                                onClick={() => deleteMutation.mutate(col.id)}
                                className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"
                            >
                                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}


// ── Itineraries Panel ─────────────────────────────────────

interface ItinerarySummary {
    id: string;
    title: string;
    city: string;
    durationDays: number;
    activityCount: number;
    isPublished: boolean;
    createdAt: string;
    shareLink?: { shareToken: string; isPublic: boolean } | null;
}

function ItinerariesPanel({ onShowAuth }: { onShowAuth: () => void }) {
    const queryClient = useQueryClient();
    const [showCreate, setShowCreate] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newCity, setNewCity] = useState("Addis Ababa");
    const [newDays, setNewDays] = useState(3);
    const [sharingId, setSharingId] = useState<string | null>(null);
    const [shareTokenMap, setShareTokenMap] = useState<Record<string, string>>({});
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ["itineraries"],
        queryFn: async () => {
            const res = await fetch("/api/user/itineraries", { credentials: "include" });
            if (!res.ok) throw new Error("Failed");
            return res.json();
        },
    });

    const createMutation = useMutation({
        mutationFn: async (payload: { title: string; city: string; durationDays: number }) => {
            const res = await fetch("/api/user/itineraries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Failed");
            return res.json();
        },
        onSuccess: () => {
            setNewTitle(""); setNewCity("Addis Ababa"); setNewDays(3); setShowCreate(false);
            queryClient.invalidateQueries({ queryKey: ["itineraries"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/user/itineraries/${id}`, {
                method: "DELETE", credentials: "include",
            });
            if (!res.ok) throw new Error("Failed");
            return res.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["itineraries"] }),
    });

    const shareMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/user/itineraries/${id}/share`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ isPublic: true }),
            });
            if (!res.ok) throw new Error("Failed");
            return res.json();
        },
        onSuccess: (data, id) => {
            const token = data?.share?.shareToken || data?.shareToken;
            if (token) setShareTokenMap(prev => ({ ...prev, [id]: token }));
            queryClient.invalidateQueries({ queryKey: ["itineraries"] });
        },
    });

    const copyLink = (id: string, token: string) => {
        const url = `${window.location.origin}/itinerary/share/${token}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    const itineraries: ItinerarySummary[] = data?.itineraries || [];

    if (isLoading) return <div className="space-y-2">{[1,2].map(i => <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-2xl" />)}</div>;

    return (
        <div className="space-y-3">
            {/* Create new */}
            {showCreate ? (
                <div className="bg-[#1A1A2E]/5 rounded-2xl p-4 border border-[#D4AF37]/20 space-y-3">
                    <input
                        type="text"
                        placeholder="Trip title, e.g. Addis Cultural Tour"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30"
                        autoFocus
                    />
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="City"
                            value={newCity}
                            onChange={e => setNewCity(e.target.value)}
                            className="flex-1 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none"
                        />
                        <select
                            value={newDays}
                            onChange={e => setNewDays(parseInt(e.target.value))}
                            className="w-28 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none"
                        >
                            {[1,2,3,4,5,7,10,14].map(d => (
                                <option key={d} value={d}>{d} day{d > 1 ? "s" : ""}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => newTitle.trim() && createMutation.mutate({ title: newTitle.trim(), city: newCity, durationDays: newDays })}
                            disabled={!newTitle.trim() || createMutation.isPending}
                            className="flex-1 py-2.5 bg-[#1A1A2E] text-white rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {createMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                            Create
                        </button>
                        <button onClick={() => setShowCreate(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold uppercase">
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setShowCreate(true)}
                    className="w-full flex items-center gap-2 py-3 px-4 border border-dashed border-[#D4AF37]/40 rounded-2xl text-[#D4AF37] text-xs font-black uppercase tracking-widest hover:bg-[#D4AF37]/5 transition-colors"
                >
                    <Plus className="w-4 h-4" /> New Itinerary
                </button>
            )}

            {/* Itineraries list */}
            {itineraries.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-2xl">
                    <div className="text-3xl mb-2">🗺️</div>
                    <p className="text-gray-400 text-xs font-medium">No itineraries yet — create one above</p>
                </div>
            ) : (
                itineraries.map(itin => {
                    const token = shareTokenMap[itin.id] || itin.shareLink?.shareToken;
                    const isSharing = sharingId === itin.id;

                    return (
                        <div key={itin.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            {/* Main row */}
                            <div className="flex items-center gap-3 p-3">
                                <div className="w-10 h-10 bg-[#1A1A2E]/5 rounded-xl flex items-center justify-center shrink-0">
                                    <Calendar className="w-5 h-5 text-[#1A1A2E]" />
                                </div>
                                <Link href={`/itineraries/${itin.id}`} className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate">{itin.title}</p>
                                    <p className="text-[10px] text-gray-400 font-medium">
                                        {itin.city} · {itin.durationDays} day{itin.durationDays !== 1 ? "s" : ""} · {itin.activityCount} activit{itin.activityCount !== 1 ? "ies" : "y"}
                                    </p>
                                </Link>
                                <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg ${itin.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                    {itin.isPublished ? "Live" : "Draft"}
                                </span>
                            </div>

                            {/* Action buttons */}
                            <div className="flex border-t border-gray-50">
                                <Link
                                    href={`/itineraries/${itin.id}`}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-black uppercase text-gray-500 hover:bg-gray-50 transition-colors"
                                >
                                    <Edit className="w-3 h-3" /> Edit
                                </Link>
                                <button
                                    onClick={() => setSharingId(isSharing ? null : itin.id)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-black uppercase text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-colors border-l border-r border-gray-50"
                                >
                                    <Share2 className="w-3 h-3" /> Share
                                </button>
                                <button
                                    onClick={() => deleteMutation.mutate(itin.id)}
                                    disabled={deleteMutation.isPending}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-black uppercase text-red-400 hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 className="w-3 h-3" /> Delete
                                </button>
                            </div>

                            {/* Share panel */}
                            {isSharing && (
                                <div className="border-t border-gray-100 p-3 bg-[#1A1A2E]/[0.02] space-y-2">
                                    {token ? (
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 flex items-center gap-2 bg-white border border-[#D4AF37]/30 rounded-xl px-3 py-2">
                                                <Globe className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                                                <span className="text-[10px] text-gray-500 font-mono truncate">
                                                    {`${typeof window !== "undefined" ? window.location.origin : ""}/itinerary/share/${token}`}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => copyLink(itin.id, token)}
                                                className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${copiedId === itin.id ? "bg-green-500" : "bg-[#D4AF37]"}`}
                                            >
                                                {copiedId === itin.id ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => shareMutation.mutate(itin.id)}
                                            disabled={shareMutation.isPending}
                                            className="w-full py-2.5 bg-[#1A1A2E] text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {shareMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                                            Generate Share Link
                                        </button>
                                    )}
                                    <p className="text-[9px] text-gray-400 text-center font-medium">Anyone with this link can view your itinerary</p>
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
}










// ── Main Profile Page ───────────────────────



export default function ProfilePage() {



    const { user, loading, logout } = useAuth();



    const [showAuth, setShowAuth] = useState(false);


    const { language, setLanguage, tr } = useLanguage();



    const [activeSection, setActiveSection] = useState<
        "saved" | "collections" | "itineraries" | "settings" | null
    >(null);







    if (loading) {



        return (



            <div className="space-y-4 pt-6">



                <div className="bg-gray-100 animate-pulse h-32 rounded-[2rem]" />



                <div className="bg-gray-100 animate-pulse h-16 rounded-2xl" />



                <div className="bg-gray-100 animate-pulse h-16 rounded-2xl" />



            </div>



        );



    }







    return (



        <div className="space-y-4 pt-6">



            {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}







            {/* Profile Header */}



            <div className="bg-white rounded-[2rem] p-6 shadow-lg shadow-gray-200/30 border border-gray-50">



                <div className="flex items-center gap-4">



                    <div className="w-16 h-16 bg-gradient-to-br from-ethiopia-green to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg shadow-ethiopia-green/20">



                        <User className="w-8 h-8 text-white" />



                    </div>



                    <div className="flex-1">



                        <h2 className="text-xl font-black tracking-tight text-gray-900">



                            {user ? user.name : tr("profile","guestName")}



                        </h2>



                        <p className="text-gray-400 text-xs font-medium mt-0.5">



                            {user ? user.email : tr("profile","guestSub")}



                        </p>



                    </div>



                </div>







                {user ? (



                    <button



                        onClick={logout}



                        className="w-full mt-5 bg-gray-100 text-gray-600 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"



                    >



                        <LogOut className="w-4 h-4" />



                        {tr("profile","signOut")}



                    </button>



                ) : (



                    <button



                        onClick={() => setShowAuth(true)}



                        className="w-full mt-5 bg-brand-dark text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200/50"



                    >



                        <LogIn className="w-4 h-4" />



                        Sign In



                    </button>



                )}



            </div>







            {/* Guest benefit rows */}


            {!user && (


                <div className="space-y-2 mb-2">


                    <div className="flex items-center gap-4 bg-white/5 rounded-xl px-4 py-3">


                        <Heart className="w-5 h-5 text-[#C9973B] shrink-0" />


                        <div>


                            <p className="text-white text-sm font-medium">{tr("profile","saveFavs")}</p>


                            <p className="text-gray-400 text-xs">{tr("profile","saveFavsDesc")}</p>


                        </div>


                    </div>


                    <div className="flex items-center gap-4 bg-white/5 rounded-xl px-4 py-3">


                        <Sparkles className="w-5 h-5 text-[#C9973B] shrink-0" />


                        <div>


                            <p className="text-white text-sm font-medium">{tr("profile","personalRec")}</p>


                            <p className="text-gray-400 text-xs">{tr("profile","personalRecDesc")}</p>


                        </div>


                    </div>


                    <div className="flex items-center gap-4 bg-white/5 rounded-xl px-4 py-3">


                        <MapPin className="w-5 h-5 text-[#C9973B] shrink-0" />


                        <div>


                            <p className="text-white text-sm font-medium">{tr("profile","tripHistory")}</p>


                            <p className="text-gray-400 text-xs">{tr("profile","tripHistoryDesc")}</p>


                        </div>


                    </div>


                </div>


            )}





            {/* Quick Actions */}



            <div className="space-y-3">



                {/* Saved Places */}



                <button



                    onClick={() =>



                        setActiveSection(activeSection === "saved" ? null : "saved")



                    }



                    className={`w-full flex items-center gap-4 rounded-2xl p-4 shadow-sm border transition-all ${activeSection === "saved"



                            ? "bg-rose-50 border-rose-200"



                            : "bg-white border-gray-50"



                        }`}



                >



                    <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">



                        <Heart className="w-5 h-5 text-rose-500" />



                    </div>



                    <div className="flex-1 text-left">



                        <h3 className="text-sm font-bold text-gray-900">{tr("profile","savedPlaces")}</h3>



                        <p className="text-[10px] text-gray-400 font-medium">



                            {tr("profile","savedPlacesDesc")}



                        </p>



                    </div>



                    <ArrowRight



                        className={`w-4 h-4 text-gray-300 transition-transform ${activeSection === "saved" ? "rotate-90" : ""



                            }`}



                    />



                </button>







                {activeSection === "saved" && (



                    <div className="px-1 pb-2">



                        {user ? (



                            <SavedPlaces />



                        ) : (



                            <div className="text-center py-8 bg-gray-50 rounded-2xl">



                                <p className="text-gray-400 text-xs font-medium">



                                    {tr("profile","signInToSee")}



                                </p>



                                <button



                                    onClick={() => setShowAuth(true)}



                                    className="mt-3 text-ethiopia-green text-[10px] font-black uppercase tracking-widest"



                                >



                                    Sign In →



                                </button>



                            </div>



                        )}



                    </div>



                )}







                {/* My Collections */}

                <button
                    onClick={() =>
                        setActiveSection(activeSection === "collections" ? null : "collections")
                    }
                    className={`w-full flex items-center gap-4 rounded-2xl p-4 shadow-sm border transition-all ${activeSection === "collections"
                            ? "bg-amber-50 border-amber-200"
                            : "bg-white border-gray-50"
                        }`}
                >
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                        <FolderHeart className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="flex-1 text-left">
                        <h3 className="text-sm font-bold text-gray-900">My Collections</h3>
                        <p className="text-[10px] text-gray-400 font-medium">Organize saved places into themed lists</p>
                    </div>
                    <ArrowRight
                        className={`w-4 h-4 text-gray-300 transition-transform ${activeSection === "collections" ? "rotate-90" : ""}`}
                    />
                </button>

                {activeSection === "collections" && (
                    <div className="px-1 pb-2">
                        {user ? (
                            <CollectionsPanel />
                        ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-2xl">
                                <p className="text-gray-400 text-xs font-medium">Sign in to manage your collections</p>
                                <button
                                    onClick={() => setShowAuth(true)}
                                    className="mt-3 text-amber-500 text-[10px] font-black uppercase tracking-widest"
                                >
                                    Sign In →
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* My Itineraries */}

                <button
                    onClick={() =>
                        setActiveSection(activeSection === "itineraries" ? null : "itineraries")
                    }
                    className={`w-full flex items-center gap-4 rounded-2xl p-4 shadow-sm border transition-all ${activeSection === "itineraries"
                            ? "bg-blue-50 border-blue-200"
                            : "bg-white border-gray-50"
                        }`}
                >
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1 text-left">
                        <h3 className="text-sm font-bold text-gray-900">My Itineraries</h3>
                        <p className="text-[10px] text-gray-400 font-medium">Build and share your trip plans</p>
                    </div>
                    <ArrowRight
                        className={`w-4 h-4 text-gray-300 transition-transform ${activeSection === "itineraries" ? "rotate-90" : ""}`}
                    />
                </button>

                {activeSection === "itineraries" && (
                    <div className="px-1 pb-2">
                        {user ? (
                            <ItinerariesPanel onShowAuth={() => setShowAuth(true)} />
                        ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-2xl">
                                <p className="text-gray-400 text-xs font-medium">Sign in to create and manage itineraries</p>
                                <button
                                    onClick={() => setShowAuth(true)}
                                    className="mt-3 text-blue-500 text-[10px] font-black uppercase tracking-widest"
                                >
                                    Sign In →
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* AI Trip Ideas */}











                {/* Settings */}



                <button



                    onClick={() =>



                        setActiveSection(activeSection === "settings" ? null : "settings")



                    }



                    className={`w-full flex items-center gap-4 rounded-2xl p-4 shadow-sm border transition-all ${activeSection === "settings"



                            ? "bg-gray-100 border-gray-300"



                            : "bg-white border-gray-50"



                        }`}



                >



                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">



                        <Settings className="w-5 h-5 text-gray-500" />



                    </div>



                    <div className="flex-1 text-left">



                        <h3 className="text-sm font-bold text-gray-900">{tr("profile","settings")}</h3>



                        <p className="text-[10px] text-gray-400 font-medium">



                            {tr("profile","settingsDesc")}



                        </p>



                    </div>



                    <ArrowRight



                        className={`w-4 h-4 text-gray-300 transition-transform ${activeSection === "settings" ? "rotate-90" : ""



                            }`}



                    />



                </button>







                {activeSection === "settings" && (



                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 space-y-4">



                        <button


                            className="flex justify-between items-center w-full"


                            onClick={() => {


                                const next = language === "en" ? "am" : "en";


                                setLanguage(next);


                            }}


                        >


                            <span className="text-sm font-medium text-gray-700">{tr("profile","language")}</span>


                            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-lg flex items-center gap-1">


                                {language === "en" ? "English" : "አማርኛ"}


                                <span className="text-[9px] text-gray-400 ml-1">⇅</span>


                            </span>


                        </button>



                        <div className="flex justify-between items-center">



                            <span className="text-sm font-medium text-gray-700">



                                {tr("profile","notifications")}



                            </span>



                            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-lg">



                                On



                            </span>



                        </div>



                        <div className="flex justify-between items-center">



                            <span className="text-sm font-medium text-gray-700">{tr("profile","version")}</span>



                            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-lg">



                                V2.0



                            </span>



                        </div>



                    </div>



                )}



            </div>







            {/* Emergency & Safety */}


            <Link


                href="/emergency"


                className="flex items-center justify-between bg-red-950/40 border border-red-900/40 rounded-2xl p-4"


            >


                <div className="flex items-center gap-3">


                    <ShieldAlert className="w-5 h-5 text-red-500" />


                    <div>


                        <p className="text-white font-semibold text-sm">{tr("profile","emergency")}</p>


                        <p className="text-gray-400 text-xs">{tr("profile","emergencyDesc")}</p>


                    </div>


                </div>


                <ArrowRight className="w-4 h-4 text-red-300" />


            </Link>





            {/* Footer */}



            <div className="text-center pt-4 pb-8">



                <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">



                    AddisView V2 — Discover Ethiopia



                </p>



            </div>



        </div>



    );



}



