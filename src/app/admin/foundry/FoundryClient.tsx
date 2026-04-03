'use client';

import { useState } from 'react';
import { approveListing, rejectListing, rerunImageLookup, bulkPublish } from './actions';
import { CheckCircle, XCircle, RefreshCcw, Upload, Filter, ChevronDown } from 'lucide-react';

const statusColors: Record<string, string> = {
    PENDING:   'bg-amber-50 text-amber-600 border border-amber-200',
    REVIEW:    'bg-blue-50 text-blue-600 border border-blue-200',
    PUBLISHED: 'bg-green-50 text-green-700 border border-green-200',
    APPROVED:  'bg-green-50 text-green-700 border border-green-200',
    REJECTED:  'bg-red-50 text-red-500 border border-red-200',
    DRAFT:     'bg-gray-100 text-gray-500 border border-gray-200',
};

export default function FoundryClient({ initialListings }: { initialListings: any[] }) {
    const [listings, setListings] = useState(initialListings);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);

    const [filterCategory, setFilterCategory] = useState('');
    const [filterCity, setFilterCity] = useState('');
    const [filterConfidence, setFilterConfidence] = useState('');

    const filteredListings = listings.filter(l => {
        if (filterCategory && l.category !== filterCategory) return false;
        if (filterCity && l.city !== filterCity) return false;
        if (filterConfidence) {
            const conf = l.confidenceScore;
            if (filterConfidence === 'high' && conf < 0.7) return false;
            if (filterConfidence === 'med' && (conf < 0.5 || conf >= 0.7)) return false;
            if (filterConfidence === 'low' && conf >= 0.5) return false;
        }
        return true;
    });

    const allCities = Array.from(new Set(listings.map(l => l.city).filter(Boolean)));
    const allCategories = Array.from(new Set(listings.map(l => l.category).filter(Boolean)));

    const toggleSelect = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const handleBulkApprove = async () => {
        if (selectedIds.size === 0) return;
        setLoading(true);
        for (const id of Array.from(selectedIds)) {
            await approveListing(id);
        }
        setListings(listings.map(l => selectedIds.has(l.id) ? { ...l, status: 'APPROVED' } : l));
        setSelectedIds(new Set());
        setLoading(false);
    };

    const handleApprove = async (id: string) => {
        setLoading(true);
        await approveListing(id);
        setListings(listings.map(l => l.id === id ? { ...l, status: 'APPROVED' } : l));
        setLoading(false);
    };

    const handleReject = async (id: string) => {
        setLoading(true);
        await rejectListing(id);
        setListings(listings.map(l => l.id === id ? { ...l, status: 'REJECTED' } : l));
        setLoading(false);
    };

    const handleRerunImage = async (id: string) => {
        setLoading(true);
        await rerunImageLookup(id);
        alert('Added to secondary Image lookup queue');
        setLoading(false);
    };

    const selectAll = (checked: boolean) => {
        setSelectedIds(checked ? new Set(filteredListings.map(l => l.id)) : new Set());
    };

    return (
        <div style={{ width: '100%', minWidth: 0 }}>
            {/* Controls Bar */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 mb-6 flex flex-row items-center gap-4 flex-wrap">
                {/* Filters */}
                <div className="flex items-center gap-2 flex-wrap flex-1">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mr-2">
                        <Filter className="w-3 h-3" /> Filters:
                    </div>
                    <div className="relative">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="appearance-none pl-4 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:border-[#D4AF37] transition-colors cursor-pointer"
                        >
                            <option value="">All Categories</option>
                            {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>

                    <div className="relative">
                        <select
                            value={filterCity}
                            onChange={(e) => setFilterCity(e.target.value)}
                            className="appearance-none pl-4 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:border-[#D4AF37] transition-colors cursor-pointer"
                        >
                            <option value="">All Cities</option>
                            {allCities.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>

                    <div className="relative">
                        <select
                            value={filterConfidence}
                            onChange={(e) => setFilterConfidence(e.target.value)}
                            className="appearance-none pl-4 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:border-[#D4AF37] transition-colors cursor-pointer"
                        >
                            <option value="">All Confidences</option>
                            <option value="high">High (&gt;70%)</option>
                            <option value="med">Medium (50–70%)</option>
                            <option value="low">Low (&lt;50%)</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>

                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                        {filteredListings.length} of {listings.length} shown
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={handleBulkApprove}
                        disabled={selectedIds.size === 0 || loading}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-30 transition-all shadow-lg shadow-emerald-500/20"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Bulk Publish {selectedIds.size > 0 && `(${selectedIds.size})`}
                    </button>
                    <button
                        onClick={() => bulkPublish(Array.from(selectedIds))}
                        className="flex items-center gap-2 bg-[#1A1612] text-[#D4AF37] px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg"
                    >
                        <Upload className="w-4 h-4" />
                        Sync Prod
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto w-full">
                    <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}>
                                <th style={{ padding: '14px 16px', width: '40px' }}>
                                    <input
                                        type="checkbox"
                                        onChange={e => selectAll(e.target.checked)}
                                        checked={selectedIds.size === filteredListings.length && filteredListings.length > 0}
                                        className="w-4 h-4 rounded accent-[#D4AF37]"
                                    />
                                </th>
                                <th style={{ padding: '14px 16px', textAlign: 'left' }} className="text-[10px] font-black uppercase tracking-widest text-gray-400">Name</th>
                                <th style={{ padding: '14px 16px', textAlign: 'left' }} className="text-[10px] font-black uppercase tracking-widest text-gray-400">Location</th>
                                <th style={{ padding: '14px 16px', textAlign: 'left' }} className="text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                                <th style={{ padding: '14px 16px', textAlign: 'left' }} className="text-[10px] font-black uppercase tracking-widest text-gray-400">Confidence</th>
                                <th style={{ padding: '14px 16px', textAlign: 'left' }} className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                <th style={{ padding: '14px 16px', textAlign: 'left' }} className="text-[10px] font-black uppercase tracking-widest text-gray-400">Provenance</th>
                                <th style={{ padding: '14px 16px', textAlign: 'right' }} className="text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredListings.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ padding: '60px 16px', textAlign: 'center' }} className="text-gray-400 text-sm font-bold">
                                        No listings found. Run the ingestion worker or adjust your filters.
                                    </td>
                                </tr>
                            ) : filteredListings.map(l => (
                                <tr key={l.id} style={{ borderBottom: '1px solid #F9FAFB' }} className="hover:bg-gray-50/50 transition-colors">
                                    <td style={{ padding: '14px 16px' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(l.id)}
                                            onChange={() => toggleSelect(l.id)}
                                            className="w-4 h-4 rounded accent-[#D4AF37]"
                                        />
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <p className="text-sm font-black text-[#1A1612]">{l.name}</p>
                                        {l.tags && l.tags.length > 0 && (
                                            <p className="text-[10px] text-gray-400 mt-0.5 font-medium">{l.tags.slice(0, 3).join(', ')}</p>
                                        )}
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <p className="text-xs font-bold text-gray-700">{l.city}</p>
                                        <p className="text-[10px] text-gray-400">{l.district || '—'}</p>
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <span className="text-xs font-bold text-gray-600 capitalize">{l.category}</span>
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <div className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black ${l.confidenceScore > 0.7 ? 'bg-green-50 text-green-700' : l.confidenceScore < 0.5 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                                            {(l.confidenceScore * 100).toFixed(0)}%
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${statusColors[l.status] || 'bg-gray-100 text-gray-500'}`}>
                                            {l.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <p className="text-[10px] font-bold text-gray-500">
                                            {l.sourceProvenance?.fields?.raw_osm?.osm_type ? '✅ OSM Valid' : '⚠️ Weak Source'}
                                        </p>
                                        <p className="text-[10px] font-bold text-gray-400 mt-0.5">
                                            {l.shortDescription ? '🤖 AI Ready' : '⏳ AI Pending'}
                                        </p>
                                    </td>
                                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleApprove(l.id)}
                                                disabled={loading}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                                                    l.status === 'APPROVED'
                                                        ? 'bg-emerald-500 text-white cursor-pointer hover:bg-emerald-600'
                                                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                                }`}
                                            >
                                                <CheckCircle className="w-3 h-3" /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(l.id)}
                                                disabled={loading || l.status === 'REJECTED'}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 disabled:opacity-40 transition-all"
                                            >
                                                <XCircle className="w-3 h-3" /> Reject
                                            </button>
                                            <button
                                                onClick={() => handleRerunImage(l.id)}
                                                disabled={loading}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 disabled:opacity-40 transition-all"
                                            >
                                                <RefreshCcw className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
