"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCalendar } from "@/contexts/CalendarContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Globe, Calendar, CreditCard, ChevronRight } from "lucide-react";

export function UnifiedPreferences() {
    const { language, setLanguage, tr } = useLanguage();
    const { calendar, setCalendar } = useCalendar();
    const { currency, setCurrency } = useCurrency();

    const langs = [
        { id: "en", label: "English" },
        { id: "am", label: "አማርኛ" },
        { id: "om", label: "Afaan Oromoo" },
        { id: "ti", label: "ትግርኛ" },
    ];

    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Language Selection */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 px-1">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Globe className="w-4 h-4 text-blue-500" />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Language / ቋንቋ</h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {langs.map(l => (
                        <button
                            key={l.id}
                            onClick={() => setLanguage(l.id as any)}
                            className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all border ${language === l.id ? 'bg-[#1A1612] text-[#D4AF37] border-[#1A1612] shadow-lg' : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'}`}
                        >
                            {l.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Calendar Selection */}
            <div className="space-y-4 pt-2 border-t border-gray-50">
                <div className="flex items-center gap-3 px-1">
                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Calendar System</h4>
                </div>
                <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl">
                    <button
                        onClick={() => setCalendar("gregorian")}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${calendar === "gregorian" ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}
                    >
                        Gregorian
                    </button>
                    <button
                        onClick={() => setCalendar("ethiopian")}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${calendar === "ethiopian" ? 'bg-[#1A1612] text-[#D4AF37] shadow-lg' : 'text-gray-400'}`}
                    >
                        Ethiopian
                    </button>
                </div>
            </div>

            {/* Currency Selection */}
            <div className="space-y-4 pt-2 border-t border-gray-50">
                <div className="flex items-center gap-3 px-1">
                    <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-amber-500" />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Prices & Currency</h4>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {["ETB", "USD", "EUR"].map(c => (
                        <button
                            key={c}
                            onClick={() => setCurrency(c as any)}
                            className={`py-3 rounded-xl text-[10px] font-black tracking-widest transition-all border ${currency === c ? 'bg-[#1A1612] text-[#D4AF37] border-[#1A1612]' : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'}`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
