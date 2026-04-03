"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import {
    Shield,
    CheckCircle,
    XCircle,
    Eye,
    ArrowLeft,
    Loader2,
    MapPin,
    Users,
    BedDouble,
    Bath,
    DollarSign,
    Mail,
    Phone,
    User,
    X,
    Clock,
    Home,
} from "lucide-react";

interface HostImage {
    id: string;
    imageUrl: string;
    altText: string | null;
}

interface HostListing {
    id: string;
    status: string;
    placeType: string;
    title: string;
    description: string;
    city: string;
    area: string;
    maxGuests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    pricePerNight: number;
    amenities: string[];
    hostName: string;
    hostEmail: string;
    hostPhone: string;
    rejectionReason: string | null;
    createdAt: string;
    images: HostImage[];
}

const statusColors: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-600 border-amber-200",
    APPROVED: "bg-green-50 text-ethiopia-green border-green-200",
    REJECTED: "bg-red-50 text-red-500 border-red-200",
};

const placeTypeLabels: Record<string, string> = {
    APARTMENT: "Apartment",
    GUESTHOUSE: "Guest House",
    ENTIRE_HOME: "Entire Home",
    PRIVATE_ROOM: "Private Room",
    SHARED_ROOM: "Shared Room",
};

export default function AdminHostListingsPage() {
    const { user, loading: authLoading } = useAuth();
    const queryClient = useQueryClient();
    const [statusFilter, setStatusFilter] = useState("PENDING");
    const [selectedListing, setSelectedListing] = useState<HostListing | null>(null);
    const [rejectModalId, setRejectModalId] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["admin-host-listings", statusFilter],
        queryFn: async () => {
            const res = await fetch(`/api/admin/host-listings?status=${statusFilter}`);
            if (res.status === 401 || res.status === 403) throw new Error("Unauthorized");
            if (!res.ok) throw new Error("Failed to fetch");
            return res.json();
        },
        enabled: !!user,
    });

    const fetchDetail = async (id: string) => {
        const res = await fetch(`/api/admin/host-listings/${id}`);
        if (!res.ok) throw new Error("Failed");
        const d = await res.json();
        setSelectedListing(d.listing);
    };

    const approveMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/admin/host-listings/${id}/approve`, {
                method: "POST",
            });
            if (!res.ok) throw new Error("Approval failed");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-host-listings"] });
            setSelectedListing(null);
        },
    });

    const rejectMutation = useMutation({
        mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
            const res = await fetch(`/api/admin/host-listings/${id}/reject`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason }),
            });
            if (!res.ok) throw new Error("Rejection failed");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-host-listings"] });
            setRejectModalId(null);
            setRejectReason("");
            setSelectedListing(null);
        },
    });

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
            </div>
        );
    }

    if (!user || user.accountType !== "admin") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-red-50 rounded-[2.5rem] flex items-center justify-center border border-red-100 shadow-xl shadow-red-500/5">
                    <Shield className="w-10 h-10 text-red-500" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Restricted Access</h2>
                    <p className="text-sm text-gray-400 font-bold max-w-sm mx-auto leading-relaxed">
                        {user 
                            ? `Your account (${user.email}) does not have administrative permissions. Please switch to a root account.` 
                            : "Authentication required to access the Governance suite."}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {!user ? (
                         <a href="/auth" className="px-8 py-3.5 bg-[#1A1612] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#1A1612]/20 hover:scale-105 active:scale-95 transition-all">Sign In</a>
                    ) : (
                         <button onClick={() => window.location.href = '/auth'} className="px-8 py-3.5 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-600/20 hover:scale-105 active:scale-95 transition-all">Switch Account</button>
                    )}
                </div>
            </div>
        );
    }

    // ── Detail View ──
    if (selectedListing) {
        const listing = selectedListing;
        return (
            <div className="space-y-6 pt-4 pb-10">
                <button
                    onClick={() => setSelectedListing(null)}
                    className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-gray-600"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to list
                </button>

                {/* Header */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <span
                            className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${statusColors[listing.status]}`}
                        >
                            {listing.status}
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                            {placeTypeLabels[listing.placeType]}
                        </span>
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                        {listing.title}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                        <MapPin className="w-4 h-4" />
                        {listing.area ? `${listing.area}, ${listing.city}` : listing.city}
                    </div>
                </div>

                {/* Images */}
                {listing.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                        {listing.images.map((img) => (
                            <div
                                key={img.id}
                                className="aspect-square rounded-2xl overflow-hidden bg-gray-100"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={img.imageUrl}
                                    alt={img.altText || listing.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Description */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 mb-3">
                        Description
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium whitespace-pre-wrap">
                        {listing.description}
                    </p>
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { icon: Users, label: "Max Guests", value: listing.maxGuests },
                        { icon: Home, label: "Bedrooms", value: listing.bedrooms },
                        { icon: BedDouble, label: "Beds", value: listing.beds },
                        { icon: Bath, label: "Bathrooms", value: listing.bathrooms },
                    ].map(({ icon: Icon, label, value }) => (
                        <div
                            key={label}
                            className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3"
                        >
                            <Icon className="w-4 h-4 text-gray-400" />
                            <div>
                                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 block">
                                    {label}
                                </span>
                                <span className="text-lg font-black text-gray-900">{value}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Price */}
                <div className="bg-ethiopia-green/5 p-5 rounded-2xl border border-ethiopia-green/10 flex items-center gap-4">
                    <DollarSign className="w-6 h-6 text-ethiopia-green" />
                    <div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 block">
                            Price Per Night
                        </span>
                        <span className="text-2xl font-black text-gray-900">
                            ${listing.pricePerNight}
                        </span>
                    </div>
                </div>

                {/* Amenities */}
                {listing.amenities.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                            Amenities
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {listing.amenities.map((a) => (
                                <span
                                    key={a}
                                    className="bg-gray-50 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-100"
                                >
                                    {a}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Host Info */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                    <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">
                        Host Information
                    </h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{listing.hostName}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{listing.hostEmail}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{listing.hostPhone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">
                                Submitted {new Date(listing.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Rejection reason */}
                {listing.rejectionReason && (
                    <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
                        <p className="text-sm text-red-600 font-bold">
                            Rejected: {listing.rejectionReason}
                        </p>
                    </div>
                )}

                {/* Actions */}
                {listing.status === "PENDING" && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => approveMutation.mutate(listing.id)}
                            disabled={approveMutation.isPending}
                            className="flex-1 bg-ethiopia-green text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-ethiopia-green/30 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {approveMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <CheckCircle className="w-4 h-4" />
                            )}{" "}
                            Approve
                        </button>
                        <button
                            onClick={() => setRejectModalId(listing.id)}
                            className="flex-1 bg-red-50 text-red-500 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border border-red-200 flex items-center justify-center gap-2"
                        >
                            <XCircle className="w-4 h-4" /> Reject
                        </button>
                    </div>
                )}
            </div>
        );
    }

    const listings: HostListing[] = data?.listings || [];

    return (
        <div className="space-y-10 animate-in fade-in duration-700 w-full pb-20">
            {/* Header Area */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="w-12 h-1.5 bg-[#D4AF37] rounded-full"></span>
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Governance</span>
                    </div>
                    <h1 className="text-5xl font-black text-[#1A1612] tracking-tighter uppercase leading-none">Host Submissions</h1>
                    <p className="text-gray-400 font-medium text-sm mt-4 italic">Active verification pipeline for platform inventory.</p>
                </div>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {["PENDING", "APPROVED", "REJECTED", "ALL"].map((s) => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${statusFilter === s
                            ? "bg-gray-900 text-white border-gray-800 shadow-lg"
                            : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                            }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* Listings */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="bg-gray-100 animate-pulse h-28 rounded-2xl"
                        />
                    ))}
                </div>
            ) : listings.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                    <div className="text-4xl mb-3">📋</div>
                    <h3 className="text-sm font-bold text-gray-900">
                        No {statusFilter.toLowerCase()} listings
                    </h3>
                    <p className="text-gray-400 text-xs mt-1">
                        {statusFilter === "PENDING"
                            ? "All caught up! No listings waiting for review."
                            : "No listings with this status yet."}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Property</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Type / Location</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Host</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Pricing</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {listings.map((listing: HostListing) => (
                                    <tr key={listing.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                                                    {listing.images[0] ? (
                                                        <img src={listing.images[0].imageUrl} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xl">🏠</div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-black text-gray-900 truncate">{listing.title}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ID: {listing.id.substring(0, 8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-bold text-gray-900">{placeTypeLabels[listing.placeType]}</p>
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                <MapPin className="w-3 h-3" /> {listing.city}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-bold text-gray-900">{listing.hostName}</p>
                                            <p className="text-[10px] font-bold text-gray-400 lowercase">{listing.hostEmail}</p>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-black text-gray-900">
                                            ${listing.pricePerNight}
                                            <span className="text-[10px] text-gray-400 font-bold ml-1">/night</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${statusColors[listing.status]}`}>
                                                {listing.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => fetchDetail(listing.id)}
                                                className="p-2.5 bg-gray-100 text-gray-400 hover:text-[#1A1612] hover:bg-gray-200 rounded-xl transition-all"
                                                title="View Detail"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {rejectModalId && (
                <div
                    className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex items-end sm:items-center justify-center p-4"
                    onClick={() => setRejectModalId(null)}
                >
                    <div
                        className="bg-white w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] p-8 shadow-2xl space-y-5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-black text-gray-900">
                                Reject Listing
                            </h2>
                            <button
                                onClick={() => setRejectModalId(null)}
                                className="p-2 bg-gray-100 rounded-xl"
                            >
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                        <textarea
                            placeholder="Reason for rejection (optional)..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            rows={3}
                            className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-medium resize-none focus:ring-2 focus:ring-red-100 outline-none"
                        />
                        <button
                            onClick={() =>
                                rejectMutation.mutate({
                                    id: rejectModalId,
                                    reason: rejectReason,
                                })
                            }
                            disabled={rejectMutation.isPending}
                            className="w-full bg-red-500 text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {rejectMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <XCircle className="w-4 h-4" />
                            )}
                            Confirm Rejection
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
