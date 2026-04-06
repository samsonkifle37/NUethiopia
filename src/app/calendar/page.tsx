"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, MapPin, Clock, ArrowLeft, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function CalendarPage() {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    const events = [
        { date: 15, title: "Addis Jazz Night", loc: "Fendika Cultural Center", type: "Music" },
        { date: 18, title: "Art Expo 2024", loc: "National Museum", type: "Culture" },
        { date: 22, title: "Coffee Cupping", loc: "Tomoca Coffee", type: "Food" },
        { date: today.getDate(), title: "Happening Today", loc: "Various Locations", type: "LIVE" },
    ];

    return (
        <div className="min-h-screen bg-[#FAFAF8] pb-32">
            {/* Header */}
            <div className="bg-[#1A1612] px-6 pt-16 pb-12 rounded-b-[3.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9973B]/5 rounded-full blur-[100px]" />
                <div className="relative z-10 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                            <ArrowLeft className="w-5 h-5 text-gray-400" />
                        </Link>
                        <div className="flex items-center gap-2">
                             <Sparkles className="w-4 h-4 text-[#C9973B]" />
                             <p className="text-[#C9973B] text-[10px] font-black uppercase tracking-[0.3em]">Live Feed</p>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Event Calendar</h1>
                        <p className="text-gray-400 text-sm font-medium mt-1">What's happening in Addis Ababa this month.</p>
                    </div>
                </div>
            </div>

            <div className="px-6 -mt-8 max-w-2xl mx-auto space-y-6">
                {/* Calendar View */}
                <div className="bg-white rounded-[3rem] p-6 shadow-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-8 px-2">
                        <h2 className="text-lg font-black uppercase italic tracking-tighter">{months[currentMonth]} {currentYear}</h2>
                        <div className="flex gap-2">
                            <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all border border-gray-100">
                                <ChevronLeft className="w-5 h-5 text-gray-400" />
                            </button>
                            <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all border border-gray-100">
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-4">
                        {days.map(d => (
                            <div key={d} className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest py-2">
                                {d}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 31 }).map((_, i) => {
                            const dayNum = i + 1;
                            const hasEvent = events.find(e => e.date === dayNum);
                            const isToday = dayNum === today.getDate();
                            
                            return (
                                <div key={i} className="aspect-square relative group cursor-pointer">
                                    <div className={`absolute inset-1 rounded-2xl flex items-center justify-center transition-all ${isToday ? 'bg-[#1A1612] text-white shadow-lg' : 'hover:bg-gray-50 text-gray-900 font-bold'}`}>
                                        <span className="text-xs">{dayNum}</span>
                                    </div>
                                    {hasEvent && (
                                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#C9973B] rounded-full shadow-lg shadow-[#C9973B]" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Upcoming Events List */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 px-4">Upcoming Highlights</h3>
                    <div className="space-y-3">
                        {events.map((e, idx) => (
                            <div key={idx} className="bg-white p-5 rounded-[2.5rem] border border-gray-100 flex gap-5 items-center group hover:border-[#C9973B]/30 hover:shadow-lg transition-all active:scale-[0.98]">
                                <div className="w-16 h-16 bg-[#1A1612] rounded-3xl flex flex-col items-center justify-center text-white shadow-xl shadow-[#1A1612]/10 group-hover:bg-[#C9973B] transition-colors">
                                    <span className="text-[10px] font-black uppercase">{months[currentMonth].slice(0, 3)}</span>
                                    <span className="text-xl font-black italic">{e.date}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex gap-2 mb-1">
                                         <span className="text-[8px] font-black uppercase tracking-widest text-[#C9973B] bg-[#C9973B]/10 px-2 py-0.5 rounded-full">{e.type}</span>
                                    </div>
                                    <h4 className="text-base font-black text-[#1A1612] truncate tracking-tight">{e.title}</h4>
                                    <div className="flex items-center gap-1.5 text-gray-400 mt-0.5">
                                        <MapPin className="w-3 h-3" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">{e.loc}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
