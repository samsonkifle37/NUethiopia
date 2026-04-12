'use client';

import { useState } from 'react';
import { approveListing, rejectListing, rerunImageLookup, bulkPublish, uploadListingImage } from './actions';
import { CheckCircle, XCircle, RefreshCcw, Upload, Filter, ChevronDown, X, Globe, MapPin, Tag, ImageIcon, Plus, Loader2 } from 'lucide-react';
import Image from 'next/image';

const statusColors: Record<string, string> = {
    PENDING:   'bg-amber-50 text-amber-600 border border-amber-200',
    REVIEW:    'bg-blue-50 text-blue-600 border border-blue-200',
    PUBLISHED: 'bg-green-50 text-green-700 border border-green-200',
    APPROVED:  'bg-green-50 text-green-700 border border-green-200',
    REJECTED:  'bg-red-50 text-red-500 border border-red-200',
    DRAFT:     'bg-gray-100 text-gray-500 border border-gray-200',
};

export default function FoundryClient({ initialListings, metadata }: { initialListings: any[], metadata: { cities: string[], categories: string[] } }) {
    const [listings, setListings] = useState(initialListings);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);
    const [selectedListing, setSelectedListing] = useState<any>(null);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [currentDescription, setCurrentDescription] = useState('');

    const [filterCategory, setFilterCategory] = useState('');
    const [filterCity, setFilterCity] = useState('');
    const [filterConfidence, setFilterConfidence] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterProvenance, setFilterProvenance] = useState('');
    const [filterGems, setFilterGems] = useState(false);

    const filteredListings = listings.filter(l => {
        if (filterGems && !l.isGem) return false;
        if (!filterGems && l.isGem && filterStatus !== 'PENDING') return false; 
        
        if (filterCategory && l.category !== filterCategory) return false;
        if (filterCity && l.city !== filterCity) return false;
        if (filterStatus && l.status !== filterStatus) return false;
        if (filterConfidence) {
            const conf = l.confidenceScore;
            if (filterConfidence === 'high' && conf < 0.7) return false;
            if (filterConfidence === 'med' && (conf < 0.5 || conf >= 0.7)) return false;
            if (filterConfidence === 'low' && conf >= 0.5) return false;
        }
        if (filterProvenance) {
            const isOsm = !!l.sourceProvenance?.fields?.raw_osm?.osm_type || l.sourceProvenance?.fields?.raw_osm?.osm_id;
            if (filterProvenance === 'osm' && !isOsm) return false;
            if (filterProvenance === 'manual' && isOsm) return false;
        }
        return true;
    });

    const allCities = metadata.cities;
    const allCategories = metadata.categories;
    const allStatuses = Array.from(new Set(listings.map(l => l.status).filter(Boolean)));

    const handleUploadImage = async () => {
        if (!newImageUrl || !selectedListing) return;
        setLoading(true);
        await uploadListingImage(selectedListing.id, newImageUrl);
        setSelectedListing({
            ...selectedListing,
            images: [...(selectedListing.images || []), { imageUrl: newImageUrl }]
        });
        setNewImageUrl('');
        setLoading(false);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedListing) return;
        
        setLoading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;
            await uploadListingImage(selectedListing.id, base64String);
            setSelectedListing({
                ...selectedListing,
                images: [...(selectedListing.images || []), { imageUrl: base64String }]
            });
            setLoading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleSaveDescription = async () => {
        if (!selectedListing) return;
        setLoading(true);
        await import('./actions').then(m => m.updateListingDescription(selectedListing.id, currentDescription));
        setSelectedListing({ ...selectedListing, shortDescription: currentDescription });
        setListings(listings.map(l => l.id === selectedListing.id ? { ...l, shortDescription: currentDescription } : l));
        setLoading(false);
    };

    const openDetails = (l: any) => {
        setSelectedListing(l);
        setCurrentDescription(l.shortDescription || '');
    };

    const handleBulkApprove = async () => {
        if (selectedIds.size === 0) return;
        setLoading(true);
        for (const id of Array.from(selectedIds)) {
            await approveListing(id);
        }
        setListings(listings.map(l => selectedIds.has(l.id) ? { ...l, status: 'PUBLISHED' } : l));
        setSelectedIds(new Set());
        setLoading(false);
    };

    const handleApprove = async (id: string) => {
        setLoading(true);
        await approveListing(id);
        setListings(listings.map(l => l.id === id ? { ...l, status: 'PUBLISHED' } : l));
        if (selectedListing?.id === id) setSelectedListing({ ...selectedListing, status: 'PUBLISHED' });
        setLoading(false);
    };

    const handleReject = async (id: string) => {
        setLoading(true);
        await rejectListing(id);
        setListings(listings.map(l => l.id === id ? { ...l, status: 'REJECTED' } : l));
        if (selectedListing?.id === id) setSelectedListing({ ...selectedListing, status: 'REJECTED' });
        setLoading(false);
    };

    return (
        <div className="relative w-full">
            {/* Controls Bar */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 mb-6 flex flex-row items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap flex-1">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mr-2">
                        <Filter className="w-3 h-3" /> Filters:
                    </div>
                    
                    <button 
                        onClick={() => setFilterGems(!filterGems)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${filterGems ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20' : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'}`}
                    >
                        Community Gems
                    </button>

                    <FilterSelect value={filterCategory} onChange={setFilterCategory} options={allCategories} placeholder="All Categories" />
                    <FilterSelect value={filterCity} onChange={setFilterCity} options={allCities} placeholder="All Cities" />
                    <FilterSelect value={filterConfidence} onChange={setFilterConfidence} options={['high', 'med', 'low']} labels={['High (>70%)', 'Med (50-70%)', 'Low (<50%)']} placeholder="Confidence" />
                    <FilterSelect value={filterStatus} onChange={setFilterStatus} options={allStatuses} placeholder="All Statuses" />
                    
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 whitespace-nowrap">
                        {filteredListings.length} OF {listings.length} SHOWN
                    </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={handleBulkApprove}
                        disabled={selectedIds.size === 0 || loading}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-30 transition-all shadow-lg shadow-emerald-500/20"
                    >
                        Bulk Publish {selectedIds.size > 0 && `(${selectedIds.size})`}
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
                <table className="w-full min-w-[900px]">
                    <thead>
                        <tr className="bg-gray-50/50 border-bottom border-gray-100">
                            <th className="p-4 w-10">
                                <input type="checkbox" onChange={e => setSelectedIds(e.target.checked ? new Set(filteredListings.map(l => l.id)) : new Set())} className="w-4 h-4 rounded accent-[#D4AF37]" />
                            </th>
                            <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Name</th>
                            <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Location</th>
                            <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                            <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Confidence</th>
                            <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                            <th className="p-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredListings.map(l => (
                            <tr key={l.id} className="hover:bg-gray-50/30 transition-colors group">
                                <td className="p-4">
                                    <input type="checkbox" checked={selectedIds.has(l.id)} onChange={() => { const n = new Set(selectedIds); if(n.has(l.id)) n.delete(l.id); else n.add(l.id); setSelectedIds(n); }} className="w-4 h-4 rounded accent-[#D4AF37]" />
                                </td>
                                <td className="p-4">
                                    <button onClick={() => openDetails(l)} className="text-left group/btn">
                                        <p className="text-sm font-black text-[#1A1612] group-hover/btn:text-[#D4AF37] transition-colors">{l.name}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{l.isGem ? '💎 Community Gem' : '📦 Ingestion Listing'}</p>
                                    </button>
                                </td>
                                <td className="p-4">
                                    <p className="text-xs font-bold text-gray-700">{l.city}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">{l.district || '—'}</p>
                                </td>
                                <td className="p-4">
                                    <span className="text-xs font-black text-gray-600 uppercase tracking-widest">{l.category}</span>
                                </td>
                                <td className="p-4">
                                    <ConfidenceBadge score={l.confidenceScore} />
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${statusColors[l.status] || 'bg-gray-100 text-gray-400'}`}>
                                        {l.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => handleApprove(l.id)} className="p-2 hover:bg-emerald-50 text-emerald-500 rounded-lg transition-colors"><CheckCircle className="w-5 h-5" /></button>
                                        <button onClick={() => handleReject(l.id)} className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-colors"><XCircle className="w-5 h-5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Drill-down Modal */}
            {selectedListing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setSelectedListing(null)} />
                    <div className="relative bg-[#FAFAF8] w-full max-w-5xl max-h-full rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col sm:flex-row animate-in slide-in-from-bottom-10 duration-500">
                        {/* Left Side: Images */}
                        <div className="w-full sm:w-[45%] bg-gray-100 p-8 flex flex-col gap-6 overflow-y-auto border-r border-gray-100">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37]">Visual Assets</h3>
                                <div className="px-3 py-1 bg-[#D4AF37]/10 rounded-full">
                                    <span className="text-[10px] font-black text-[#D4AF37] uppercase">{selectedListing.images?.length || 0} Images</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {selectedListing.images?.map((img: any, i: number) => (
                                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden shadow-lg border border-white">
                                        <img src={img.imageUrl} alt="Gallery" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <div className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-4 text-center group bg-white/50">
                                    <ImageIcon className="w-6 h-6 text-gray-300 mb-2" />
                                    <p className="text-[9px] font-black text-gray-300 uppercase">Awaiting Refresh</p>
                                </div>
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <p className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest">Add Verified Asset</p>
                                <div className="flex flex-col gap-3">
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Paste image URL here..." 
                                            value={newImageUrl}
                                            onChange={e => setNewImageUrl(e.target.value)}
                                            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-[#D4AF37] transition-all"
                                        />
                                        <button 
                                            onClick={handleUploadImage}
                                            className="p-2.5 bg-[#1A1612] text-white rounded-xl hover:bg-black transition-all shadow-lg"
                                        >
                                            <Upload className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <input 
                                            type="file" 
                                            id="file-upload" 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        <label 
                                            htmlFor="file-upload"
                                            className="flex items-center justify-center gap-2 w-full py-3 bg-white border-2 border-dashed border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all cursor-pointer"
                                        >
                                            <Plus className="w-4 h-4" /> Add From Drive
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Info */}
                        <div className="flex-1 p-10 overflow-y-auto">
                            <button onClick={() => setSelectedListing(null)} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>

                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[selectedListing.status]}`}>
                                        {selectedListing.status}
                                    </span>
                                    <h2 className="text-4xl font-black text-[#1A1612] tracking-tighter leading-tight uppercase">{selectedListing.name}</h2>
                                    <div className="flex gap-4 pt-2">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> {selectedListing.district}, {selectedListing.city}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            <Tag className="w-3.5 h-3.5 text-[#D4AF37]" /> {selectedListing.category}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                                     <div className="flex justify-between items-center border-b pb-4">
                                        <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">Content Summary</h4>
                                        <button 
                                            onClick={handleSaveDescription}
                                            disabled={loading}
                                            className="flex items-center gap-1 text-[9px] font-black text-[#D4AF37] uppercase tracking-widest hover:underline disabled:opacity-50"
                                        >
                                            {loading ? <Loader2 className="w-3 h-3 animate-spin"/> : <CheckCircle className="w-3 h-3" />} Save Changes
                                        </button>
                                     </div>
                                     <textarea 
                                        value={currentDescription}
                                        onChange={e => setCurrentDescription(e.target.value)}
                                        placeholder="Enter detailed description for production..."
                                        className="w-full min-h-[150px] bg-gray-50/50 border border-gray-100 rounded-2xl p-4 text-gray-600 font-medium leading-relaxed italic outline-none focus:border-[#D4AF37]/30 transition-all resize-none"
                                     />
                                     <div className="flex gap-2 pt-2">
                                        {selectedListing.tags?.map((t: string) => (
                                            <span key={t} className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold text-gray-500 uppercase tracking-wider">{t}</span>
                                        ))}
                                     </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button 
                                        onClick={() => handleApprove(selectedListing.id)}
                                        className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20"
                                    >
                                        Publish to Production
                                    </button>
                                    <button 
                                        onClick={() => handleReject(selectedListing.id)}
                                        className="px-8 bg-red-50 text-red-500 border border-red-100 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-red-100 transition-all"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function FilterSelect({ value, onChange, options, labels, placeholder }: any) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:border-[#D4AF37] transition-colors cursor-pointer"
            >
                <option value="">{placeholder}</option>
                {options.map((o:any, i:number) => <option key={o} value={o}>{labels ? labels[i] : o}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
    );
}

function ConfidenceBadge({ score }: { score: number }) {
    const isHigh = score > 0.7;
    const isLow = score < 0.5;
    return (
        <div className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black ${isHigh ? 'bg-green-50 text-green-700' : isLow ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
            {(score * 100).toFixed(0)}%
        </div>
    );
}
