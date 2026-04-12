"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter, useSearchParams } from "next/navigation";
import { PlaceCard } from "./PlaceCard";
import { Search, Filter, ArrowUpDown, Check } from "lucide-react";
import { getPrimaryVerifiedImage } from "@/lib/images";

interface PlaceGridProps {
    title: string;
    types: string;
    filterOptions: { value: string; label: string }[];
    searchPlaceholder?: string;
    accentColor?: string;
    areaOptions?: { value: string; label: string; emoji?: string }[];
    initialData?: PlacesResponse;
}

interface PlaceData {
    id: string;
    slug: string;
    name: string;
    type: string;
    city: string;
    area: string;
    shortDescription: string | null;
    avgRating: number | null;
    tags: string[];
    websiteUrl: string | null;
    source: string;
    images: { imageUrl: string; priority?: number; imageTruthType?: string; status?: string }[];
    auditStatus?: "ok" | "missing" | "blocked" | "broken" | null;
    ownerVerified?: boolean;
    featured?: boolean;
    verificationScore?: number;
    _count?: { reviews: number; favorites: number };
    isGem?: boolean;
}

interface PlacesResponse {
    places: PlaceData[];
    total: number;
}

type SortOption = "relevance" | "rating" | "name" | "newest";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: "relevance", label: "Most Relevant" },
    { value: "rating", label: "Highest Rated" },
    { value: "name", label: "A → Z" },
    { value: "newest", label: "Newest" },
];

async function fetchPlaces(types: string, search: string, pageParam: number = 0, area: string = ""): Promise<PlacesResponse> {
    if (types === "gems") {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        params.set("limit", "18");
        // /api/discovery doesn't support offset yet, but we'll normalize it anyway
        const res = await fetch(`/api/discovery?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch gems");
        const data = await res.json();
        
        // Normalize DiscoveryPost to PlaceData
        const normalized = (data.posts || []).map((p: any) => ({
            id: p.id,
            slug: p.id,
            name: p.title,
            type: p.category,
            city: "Addis Ababa",
            area: p.user?.name || "Local Guide",
            shortDescription: null,
            avgRating: 5.0,
            tags: ["GEM", "Community"],
            images: [{ imageUrl: p.imageUrl }],
            auditStatus: "ok",
            isGem: true
        }));

        return {
            places: normalized,
            total: normalized.length
        };
    }

    const params = new URLSearchParams();
    if (types) params.set("type", types);
    if (search) params.set("search", search);
    if (area) params.set("neighborhood", area);
    params.set("limit", "18");
    params.set("offset", pageParam.toString());

    const res = await fetch(`/api/places?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch places");
    return res.json();
}

function sortPlaces(places: PlaceData[], sort: SortOption): PlaceData[] {
    if (sort === "relevance") return places; // Server default ordering
    const sorted = [...places];
    switch (sort) {
        case "rating":
            sorted.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
            break;
        case "name":
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case "newest":
            // Keep original order which is by createdAt desc from server
            sorted.reverse();
            break;
    }
    return sorted;
}

export function PlaceGrid({
    title,
    types,
    filterOptions,
    searchPlaceholder = "Search...",
    accentColor = "ethiopia-green",
    areaOptions,
    initialData
}: PlaceGridProps) {
    const { tr } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Restore state from URL params
    const [activeFilter, setActiveFilter] = useState(searchParams.get("category") || "");
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [areaFilter, setAreaFilter] = useState(searchParams.get("area") || "");
    const [sortBy, setSortBy] = useState<SortOption>((searchParams.get("sort") as SortOption) || "relevance");
    const [showSortMenu, setShowSortMenu] = useState(false);

    // Sync URL params when filters change
    const updateUrlParams = useCallback((filter: string, search: string, area: string, sort: SortOption) => {
        const params = new URLSearchParams();
        if (filter) params.set("category", filter);
        if (search) params.set("q", search);
        if (area) params.set("area", area);
        if (sort !== "relevance") params.set("sort", sort);
        const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
        router.replace(newUrl, { scroll: false });
    }, [router]);

    useEffect(() => {
        // Handle initial hash routing
        if (window.location.hash === "#gems") {
            setActiveFilter("gems");
        }

        const timeout = setTimeout(() => {
            updateUrlParams(activeFilter, searchQuery, areaFilter, sortBy);
        }, 300); // Debounce URL updates
        return () => clearTimeout(timeout);
    }, [activeFilter, searchQuery, areaFilter, sortBy, updateUrlParams]);

    const activeTypes = activeFilter || types;

    // Only provide initialData if we are in the exact state the server rendered
    const isInitialState = !activeFilter && !searchQuery && !areaFilter;
    const initialQueryData = isInitialState && initialData 
        ? { pages: [initialData], pageParams: [0] } 
        : undefined;

    const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["places", activeTypes, searchQuery, areaFilter],
        queryFn: ({ pageParam }) => fetchPlaces(activeTypes, searchQuery, pageParam, areaFilter),
        initialPageParam: 0,
        initialData: initialQueryData,
        staleTime: 5000,
        getNextPageParam: (lastPage, allPages) => {
            const currentCount = allPages.reduce((acc, page) => acc + page.places.length, 0);
            if (currentCount < lastPage.total) {
                return currentCount;
            }
            return undefined;
        },
    });

    const rawPlaces = data?.pages.flatMap(page => page.places) || [];
    const allPlaces = sortPlaces(rawPlaces, sortBy);
    const totalCount = data?.pages[0]?.total || 0;

    return (
        <div className="space-y-6 pt-4 px-4">
            {/* Header */}
            <div className="flex justify-between items-center px-1">
                <h1 className="text-2xl font-black tracking-tight uppercase">
                    {title}
                </h1>
            </div>

            <div className="sticky top-0 z-30 bg-[#FAFAF8]/90 backdrop-blur-xl pb-3 pt-2 -mx-1 px-2 space-y-4">
                {/* Search */}
                <div className="flex gap-2">
                    <div className="relative group flex-1">
                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#C9973B] transition-colors z-10`} />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            className={`w-full pl-10 pr-4 py-3.5 bg-white rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C9973B]/20 transition-all font-semibold text-sm relative z-0`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    {/* Sort Control */}
                    <div className="relative">
                        <button 
                            onClick={() => setShowSortMenu(!showSortMenu)}
                            className={`flex items-center justify-center shrink-0 w-[52px] h-[52px] rounded-2xl border shadow-sm transition-all active:scale-95 ${
                                sortBy !== "relevance" 
                                    ? "bg-[#1A1612] border-[#1A1612] text-[#C9973B]" 
                                    : "bg-white border-gray-200 text-gray-600 hover:text-[#1A1612]"
                            }`}
                            aria-label="Sort options"
                        >
                            <ArrowUpDown className="w-[18px] h-[18px]" />
                        </button>
                        
                        {/* Sort dropdown */}
                        {showSortMenu && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowSortMenu(false)} />
                                <div className="absolute right-0 top-14 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 w-48 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {SORT_OPTIONS.map(option => (
                                        <button
                                            key={option.value}
                                            onClick={() => { setSortBy(option.value); setShowSortMenu(false); }}
                                            className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                                                sortBy === option.value ? "text-[#C9973B] font-black" : "text-gray-700 font-semibold"
                                            }`}
                                        >
                                            <span className="text-xs uppercase tracking-wider">{option.label}</span>
                                            {sortBy === option.value && <Check className="w-4 h-4 text-[#C9973B]" />}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Filter chips */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {filterOptions.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => {
                                setActiveFilter(filter.value);
                            }}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${activeFilter === filter.value
                                ? "bg-[#1A1612] text-white shadow-md border-[#1A1612]"
                                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-900"
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

                {/* Area / Neighbourhood chips */}
                {areaOptions && areaOptions.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 pt-1">
                        <button
                            onClick={() => setAreaFilter("")}
                            className={`px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${!areaFilter ? "bg-[#C9973B] text-white border-[#C9973B] shadow-sm" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}
                        >
                            {tr("grid", "allAreas")}
                        </button>
                        {areaOptions.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setAreaFilter(areaFilter === opt.value ? "" : opt.value)}
                                className={`px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${areaFilter === opt.value ? "bg-[#C9973B] text-white border-[#C9973B] shadow-sm" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}
                            >
                                {opt.emoji}{opt.label}
                            </button>
                        ))}
                    </div>
                )}

            {/* Content */}
            <div className="space-y-4 px-1">
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="bg-gray-100 animate-pulse h-72 rounded-[2rem] shadow-sm"
                            />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-16 bg-white rounded-[2rem] border border-dashed border-gray-200">
                        <div className="text-4xl mb-4">⚠️</div>
                        <h3 className="text-lg font-bold text-gray-900">
                            {tr("grid", "error")}
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">
                            {tr("grid", "errorSub")}
                        </p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="mt-6 text-[10px] font-black uppercase tracking-widest bg-[#1A1612] text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
                        >
                            Retry
                        </button>
                    </div>
                ) : allPlaces.length === 0 ? (
                    <div className="text-center py-20 bg-[#FAFAF8] rounded-[2rem] border border-[#C9973B]/20 shadow-inner">
                        <div className="w-16 h-16 bg-[#C9973B]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-[#C9973B]" />
                        </div>
                        <h3 className="text-lg font-black text-[#1A1612]">
                            {tr("grid", "noResults")}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1 max-w-[200px] mx-auto leading-relaxed">
                            {tr("grid", "noResultsSub")}
                        </p>
                        <button 
                            onClick={() => { setSearchQuery(""); setActiveFilter(""); setAreaFilter(""); setSortBy("relevance"); }}
                            className="mt-6 text-[10px] font-black uppercase tracking-widest bg-[#1A1612] text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
                        >
                            {tr("grid", "clearFilters")}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-2 px-1">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{totalCount} {tr("grid", "found")}</span>
                            {sortBy !== "relevance" && (
                                <button 
                                    onClick={() => setSortBy("relevance")} 
                                    className="text-[10px] font-black text-[#C9973B] uppercase tracking-widest hover:underline"
                                >
                                    Clear Sort
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {allPlaces.map((place) => (
                            <PlaceCard
                                key={place.id}
                            slug={place.slug}
                            name={place.name}
                            type={place.type}
                            city={place.city}
                            area={place.area}
                            shortDescription={place.shortDescription}
                            heroImage={getPrimaryVerifiedImage(place)}
                            avgRating={place.avgRating}
                            tags={place.tags}
                            websiteUrl={place.websiteUrl}
                            source={place.source}
                            auditStatus={place.auditStatus}
                            ownerVerified={place.ownerVerified}
                            featured={place.featured}
                            verificationScore={place.verificationScore}
                            reviewCount={place._count?.reviews}
                            hasRealPhotos={place.images?.some(img => img.imageTruthType === 'place_real' && img.status !== 'REJECTED' && img.status !== 'BLOCKED' && img.status !== 'FAILED')}
                            isGem={(place as any).isGem}
                        />
                    ))}
                    </div>
                    
                    {hasNextPage && (
                        <div className="flex justify-center pt-8 pb-4">
                            <button
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                                className="bg-white border-2 border-gray-100 text-gray-900 font-black uppercase tracking-widest text-xs px-8 py-3.5 rounded-2xl hover:border-gray-200 hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
                            >
                                {isFetchingNextPage ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                                        {tr("grid", "fetching")}
                                    </>
                                ) : (
                                    tr("grid", "loadMore")
                                )}
                            </button>
                        </div>
                    )}
                    {!hasNextPage && allPlaces.length > 0 && (
                        <div className="text-center py-10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                {tr("grid", "end")}
                            </p>
                        </div>
                    )}
                    </>
                )}
            </div>
        </div>
    );
}
