"use client";

import React, { useState, useEffect } from "react";
import { Phone, MapPin, Shield, Heart, Info, Globe, AlertCircle, Bookmark } from "lucide-react";
import { useOffline } from "@/contexts/OfflineContext";

const EMERGENCY_CONTACTS = [
    { id: "police", name: "Federal Police", phone: "991", sub: "For accidents and security emergencies." },
    { id: "ambulance", name: "Ambulance / Red Cross", phone: "907", sub: "Critical medical transport." },
    { id: "fire", name: "Fire Department", phone: "939", sub: "Fire and rescue services." },
    { id: "tourist_police", name: "Tourist Police (Addis)", phone: "+251 11 552 8222", sub: "Dedicated help for travelers." },
];

export default function EmergencyPage() {
    const { isOnline } = useOffline();
    const [userNotes, setUserNotes] = useState<string>("");

    useEffect(() => {
        const savedNotes = localStorage.getItem("nu_emergency_notes");
        if (savedNotes) setUserNotes(savedNotes);
    }, []);

    const saveNotes = (val: string) => {
        setUserNotes(val);
        localStorage.setItem("nu_emergency_notes", val);
    };

    return (
        <div className="min-h-screen bg-[#FAFAF8] pb-32">
            {/* High-Impact Emergency Header */}
            <div className="bg-[#BA2929] text-white px-6 pt-16 pb-12 rounded-b-[3rem] shadow-2xl shadow-red-900/10">
                <div className="flex items-center gap-2 mb-4">
                    <span className="w-8 h-1 bg-white/30 rounded-full"></span>
                    <span className="text-[10px] uppercase font-black tracking-widest text-white/60">
                        Help & Support
                    </span>
                </div>
                <h1 className="text-4xl font-black tracking-tighter uppercase mb-4 flex items-center gap-3">
                    Emergency
                    <div className="w-3 h-3 bg-white rounded-full animate-ping" />
                </h1>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/20 ${!isOnline ? 'bg-white/10' : 'bg-black/10'}`}>
                    {!isOnline ? 'Available Offline' : 'Online Support Active'}
                </div>
            </div>

            <div className="px-6 py-8 space-y-8 -mt-6">
                {/* Critical Quick-Dial */}
                <div className="grid grid-cols-2 gap-4">
                    {EMERGENCY_CONTACTS.slice(0, 2).map(contact => (
                        <a 
                            key={contact.id}
                            href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                            className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center text-center gap-3 active:scale-95 transition-all"
                        >
                            <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center">
                                <Phone className="w-5 h-5 text-red-600" />
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{contact.name}</span>
                                <div className="text-xl font-black text-[#1A1612]">{contact.phone}</div>
                            </div>
                        </a>
                    ))}
                </div>

                {/* All Contacts List */}
                <div className="space-y-4">
                    <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 px-2 flex items-center gap-2">
                        Essential Hotlines
                    </h2>
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 divide-y divide-gray-50 overflow-hidden shadow-sm">
                        {EMERGENCY_CONTACTS.map(contact => (
                            <a 
                                key={contact.id}
                                href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                                className="flex items-center justify-between p-6 hover:bg-gray-50 transition-all active:scale-[0.98]"
                            >
                                <div className="space-y-1">
                                    <h4 className="font-bold text-[#1A1612] text-sm tracking-tight">{contact.name}</h4>
                                    <p className="text-[10px] text-gray-400 font-medium leading-tight max-w-[150px]">{contact.sub}</p>
                                </div>
                                <div className="text-sm font-black text-red-600 bg-red-50 px-3 py-1.5 rounded-xl">{contact.phone}</div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Personal Medical / Emergency Notes */}
                <div className="space-y-4">
                    <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 px-2 flex items-center gap-2">
                        Your Offline Notes
                    </h2>
                    <div className="bg-[#1A1612] p-8 rounded-[2.5rem] text-white space-y-6 shadow-2xl shadow-black/20">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center">
                                <Bookmark className="w-5 h-5 text-red-400 font-bold" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm tracking-tight">Crucial Information</h4>
                                <p className="text-[9px] text-white/50 font-medium uppercase tracking-widest">Saved locally on this device</p>
                            </div>
                        </div>
                        <textarea 
                            value={userNotes}
                            onChange={(e) => saveNotes(e.target.value)}
                            placeholder="Add your blood type, allergies, passport number, or embassy contact..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-medium placeholder:text-white/20 min-h-[120px] focus:outline-none focus:border-red-500/50 transition-all"
                        />
                        <div className="flex items-center gap-2 px-1">
                            <Info className="w-3 h-3 text-red-400" />
                            <span className="text-[9px] text-white/40 font-medium leading-relaxed italic">
                                This note is only stored on this device. Use it for data you might need without a signal.
                            </span>
                        </div>
                    </div>
                </div>

                {/* Health & Safety Hint */}
                <div className="bg-emerald-50/50 p-8 rounded-[2.5rem] border border-emerald-100 flex gap-4">
                    <Shield className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div className="space-y-1">
                        <h4 className="text-xs font-black uppercase tracking-widest text-emerald-900">Safety Tip</h4>
                        <p className="text-[10px] text-emerald-800/70 font-medium leading-relaxed">
                            Always carry a physical copy of your passport and visa. In remote areas like Danakil, never travel without a licensed guide and satellite communication if possible.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
