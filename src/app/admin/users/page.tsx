"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  Users, Search, Mail, Calendar, ShieldCheck, 
  MoreVertical, Map, Star, Heart, RefreshCcw,
  CheckCircle, AlertCircle, Trash2, Ban, RotateCcw,
  ShieldAlert
} from "lucide-react";
import { format } from "date-fns";

interface UserData {
    id: string;
    email: string;
    name: string;
    accountType: string;
    roles: string[];
    isEmailVerified: boolean;
    createdAt: string;
    _count: { itineraries: number; reviews: number; favorites: number; }
}

const accountTypeColors: Record<string, string> = {
    admin:    'bg-[#1A1612] text-[#D4AF37] border border-white/10',
    host:     'bg-blue-50 text-blue-700 border border-blue-200',
    business: 'bg-purple-50 text-purple-700 border border-purple-200',
    user:     'bg-gray-100 text-gray-500 border border-gray-200',
};

function ActionMenu({ user, onSuspend, onDelete }: {
    user: UserData;
    onSuspend: (id: string, suspend: boolean) => void;
    onDelete: (id: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const isSuspended = user.roles.includes('suspended');

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={ref} className="relative shrink-0">
            <button
                onClick={() => setOpen(o => !o)}
                className="p-2 text-gray-300 hover:text-[#1A1612] hover:bg-gray-50 rounded-xl transition-all"
            >
                <MoreVertical className="w-5 h-5" />
            </button>

            {open && (
                <div className="absolute right-0 top-10 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 w-48 animate-in fade-in slide-in-from-top-2 duration-150">
                    {isSuspended ? (
                        <button
                            onClick={() => { onSuspend(user.id, false); setOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-bold text-green-600 hover:bg-green-50 transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" /> Reinstate User
                        </button>
                    ) : (
                        <button
                            onClick={() => { onSuspend(user.id, true); setOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-bold text-amber-600 hover:bg-amber-50 transition-colors"
                        >
                            <Ban className="w-4 h-4" /> Suspend User
                        </button>
                    )}
                    <div className="my-1 h-px bg-gray-100 mx-3" />
                    <button
                        onClick={() => { 
                            if (confirm(`Permanently delete ${user.name}? This cannot be undone.`)) {
                                onDelete(user.id);
                            }
                            setOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" /> Delete Permanently
                    </button>
                </div>
            )}
        </div>
    );
}

export default function AdminUsersPage() {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/admin/users");
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || `HTTP ${res.status}`);
            }
            const data = await res.json();
            setUsers(data.users || []);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleSuspend = async (id: string, suspend: boolean) => {
        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: suspend ? 'suspend' : 'unsuspend' })
            });
            if (!res.ok) throw new Error((await res.json()).error);
            setUsers(prev => prev.map(u => {
                if (u.id !== id) return u;
                const roles = u.roles.filter(r => r !== 'suspended');
                return { ...u, roles: suspend ? [...roles, 'suspended'] : roles };
            }));
            showToast(suspend ? 'User suspended' : 'User reinstated');
        } catch (e: any) {
            showToast(e.message, 'error');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
            setUsers(prev => prev.filter(u => u.id !== id));
            showToast('User deleted permanently', 'success');
        } catch (e: any) {
            console.error('Delete failed:', e.message);
            showToast(`Delete failed: ${e.message}`, 'error');
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-700 w-full pb-20">

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-sm font-black animate-in slide-in-from-bottom-4 duration-300 ${
                    toast.type === 'success' ? 'bg-[#1A1612] text-[#D4AF37]' : 'bg-red-600 text-white'
                }`}>
                    {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="w-12 h-1.5 bg-[#D4AF37] rounded-full"></span>
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Identity Manager</span>
                    </div>
                    <h1 className="text-5xl font-black text-[#1A1612] tracking-tighter uppercase leading-none">Global Users</h1>
                    <p className="text-gray-400 font-medium text-sm mt-4 italic">Auditing role authorization and account health.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-6 py-3 bg-[#1A1612] rounded-2xl border border-white/5 shadow-xl flex items-center gap-3">
                        <Users className="w-5 h-5 text-[#D4AF37]" />
                        <span className="text-sm font-black text-white">
                            {loading ? '…' : `${users.length} Total Registered`}
                        </span>
                    </div>
                    <button onClick={fetchUsers} className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md text-gray-400 hover:text-[#1A1612] transition-all">
                        <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Filter */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" />
                    <input
                        type="text"
                        placeholder="Filter by email or name..."
                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 pl-12 pr-6 text-sm font-bold focus:border-[#D4AF37]/30 focus:bg-white transition-all outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                {!loading && !error && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 shrink-0">
                        {filteredUsers.length} of {users.length}
                    </span>
                )}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-3xl p-6 flex items-center gap-4 text-red-600">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <div>
                        <p className="font-black text-sm">Failed to load users: {error}</p>
                        <button onClick={fetchUsers} className="text-xs font-bold mt-1 underline">Retry</button>
                    </div>
                </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-56 bg-gray-100 rounded-[2.5rem] animate-pulse" />
                    ))
                ) : !error && filteredUsers.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                        <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">
                            {users.length === 0 ? 'No users in database' : 'No matching users found'}
                        </h3>
                    </div>
                ) : (
                    filteredUsers.map((user) => {
                        const isSuspended = user.roles.includes('suspended');
                        return (
                            <div key={user.id} className={`bg-white rounded-[2.5rem] border shadow-sm p-8 transition-all group overflow-hidden relative ${
                                isSuspended 
                                    ? 'border-amber-200 bg-amber-50/30 opacity-75' 
                                    : 'border-gray-100 hover:shadow-xl hover:border-[#D4AF37]/20'
                            }`}>
                                <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-gray-50 rounded-full group-hover:bg-[#D4AF37]/5 transition-colors duration-500" />

                                {isSuspended && (
                                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full w-fit mb-4">
                                        <ShieldAlert className="w-3 h-3" /> Suspended
                                    </div>
                                )}

                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shrink-0 ${
                                            isSuspended ? 'bg-amber-100 text-amber-600' : 'bg-[#1A1612] text-[#D4AF37]'
                                        }`}>
                                            {(user.name?.[0] || user.email[0]).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-base font-black text-[#1A1612] tracking-tight truncate">{user.name || "Anonymous"}</h3>
                                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                <span className={`text-[8px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded ${accountTypeColors[user.accountType] || accountTypeColors['user']}`}>
                                                    {user.accountType}
                                                </span>
                                                {user.isEmailVerified ? (
                                                    <span className="flex items-center gap-1 text-[8px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded">
                                                        <CheckCircle className="w-2.5 h-2.5" /> Verified
                                                    </span>
                                                ) : (
                                                    <span className="text-[8px] font-black text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded">Unverified</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <ActionMenu user={user} onSuspend={handleSuspend} onDelete={handleDelete} />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-gray-500">
                                        <Mail className="w-4 h-4 shrink-0" />
                                        <span className="text-xs font-bold truncate">{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-500">
                                        <Calendar className="w-4 h-4 shrink-0" />
                                        <span className="text-xs font-bold">Joined {format(new Date(user.createdAt), "MMM d, yyyy")}</span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-end">
                                    <div className="flex gap-5">
                                        <div className="flex flex-col items-center">
                                            <Map className="w-4 h-4 text-[#D4AF37] mb-1" />
                                            <span className="text-xs font-black text-[#1A1612]">{user._count.itineraries}</span>
                                            <span className="text-[8px] font-bold text-gray-400 uppercase">Plans</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <Star className="w-4 h-4 text-blue-500 mb-1" />
                                            <span className="text-xs font-black text-[#1A1612]">{user._count.reviews}</span>
                                            <span className="text-[8px] font-bold text-gray-400 uppercase">Reviews</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <Heart className="w-4 h-4 text-rose-400 mb-1" />
                                            <span className="text-xs font-black text-[#1A1612]">{user._count.favorites}</span>
                                            <span className="text-[8px] font-bold text-gray-400 uppercase">Saved</span>
                                        </div>
                                    </div>

                                    {isSuspended ? (
                                        <div className="flex items-center gap-2 bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1 rounded-xl text-[9px] font-black uppercase">
                                            <Ban className="w-3 h-3" /> Suspended
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-500 px-3 py-1 rounded-xl text-[9px] font-black uppercase">
                                            <ShieldCheck className="w-3 h-3" /> Active
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
