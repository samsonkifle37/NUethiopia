"use client";

import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, MapPin, Clock, ArrowLeft, ChevronLeft, ChevronRight, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { getEventsForMonth } from "./actions";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function CalendarPage() {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            const data = await getEventsForMonth(currentMonth, currentYear);
            setEvents(data);
            setLoading(false);
        };
        fetchEvents();
    }, [currentMonth, currentYear]);

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    // Calendar Grid Logic
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun, 1 = Mon...
    const firstDayOffset = (firstDayOfMonth + 6) % 7; // Adjust for Monday start: 0 = Mon, 6 = Sun

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
                <div className="bg-white rounded-[3rem] p-6 shadow-xl border border-gray-100 relative">
                    {loading && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex items-center justify-center rounded-[3rem]">
                            <Loader2 className="w-8 h-8 text-[#C9973B] animate-spin" />
                        </div>
                    )}
                    
                    <div className="flex items-center justify-between mb-8 px-2">
                        <h2 className="text-lg font-black uppercase italic tracking-tighter">{months[currentMonth]} {currentYear}</h2>
                        <div className="flex gap-2">
                            <button 
                                onClick={handlePrevMonth}
                                className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all border border-gray-100"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-400" />
                            </button>
                            <button 
                                onClick={handleNextMonth}
                                className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all border border-gray-100"
                            >
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
                        {/* Fill previous month offset */}
                        {Array.from({ length: firstDayOffset }).map((_, i) => (
                            <div key={`offset-${i}`} className="aspect-square" />
                        ))}
                        
                        {/* Actual Days */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const dayNum = i + 1;
                            const dateObj = new Date(currentYear, currentMonth, dayNum);
                            const isToday = dateObj.toDateString() === today.toDateString();
                            
                            const dayEvents = events.filter(e => {
                                const evDate = new Date(e.startTime);
                                return evDate.getDate() === dayNum && 
                                       evDate.getMonth() === currentMonth && 
                                       evDate.getFullYear() === currentYear;
                            });

                            return (
                                <div key={dayNum} className="aspect-square relative group cursor-pointer lowercase">
                                    <div className={`absolute inset-1 rounded-2xl flex items-center justify-center transition-all ${isToday ? 'bg-[#1A1612] text-white shadow-lg' : 'hover:bg-gray-50 text-gray-900 font-bold'}`}>
                                        <span className="text-xs">{dayNum}</span>
                                    </div>
                                    {dayEvents.length > 0 && (
                                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#C9973B] rounded-full shadow-lg shadow-[#C9973B]" />
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
                        {events.length === 0 && !loading && (
                            <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-[2.5rem]">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No events scheduled for this month</p>
                            </div>
                        )}
                        {events.map((e, idx) => (
                            <Link 
                                href={`/events/${e.slug}`}
                                key={idx} 
                                className="bg-white p-5 rounded-[2.5rem] border border-gray-100 flex gap-5 items-center group hover:border-[#C9973B]/30 hover:shadow-lg transition-all active:scale-[0.98] block"
                            >
                                <div className="w-16 h-16 bg-[#1A1612] rounded-3xl flex flex-col items-center justify-center text-white shadow-xl shadow-[#1A1612]/10 group-hover:bg-[#C9973B] transition-colors flex-shrink-0">
                                    <span className="text-[10px] font-black uppercase">{months[new Date(e.startTime).getMonth()].slice(0, 3)}</span>
                                    <span className="text-xl font-black italic">{new Date(e.startTime).getDate()}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex gap-2 mb-1">
                                         <span className="text-[8px] font-black uppercase tracking-widest text-[#C9973B] bg-[#C9973B]/10 px-2 py-0.5 rounded-full">{e.category}</span>
                                    </div>
                                    <h4 className="text-base font-black text-[#1A1612] truncate tracking-tight">{e.title}</h4>
                                    <div className="flex items-center gap-1.5 text-gray-400 mt-0.5">
                                        <MapPin className="w-3 h-3" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider truncate">{e.place?.name || "Various Locations"}</span>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#C9973B] group-hover:translate-x-1 transition-all" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
