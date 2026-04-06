"use client";

import React, { useState, useEffect } from "react";
import { Bell, Shield, Info, AlertTriangle, Send, Heart, ShoppingBag } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function NotificationSettingsPage() {
    const { showToast } = useToast();
    const [permission, setPermission] = useState<string>("default");
    const [preferences, setPreferences] = useState({
        travelAlerts: true,
        bookings: true,
        dailyDiscovery: false,
        promotional: false,
    });

    useEffect(() => {
        if ("Notification" in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = async () => {
            showToast("Notifications are not supported in this browser.", "error");

        const result = await Notification.requestPermission();
        setPermission(result);
        
        if (result === "granted") {
            showToast("You will now receive travel updates from NU.", "success");
        }
    };

    const togglePref = (key: keyof typeof preferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="min-h-screen bg-surface pb-32">
             <div className="sticky top-0 bg-surface/80 backdrop-blur-xl border-b border-gray-100 px-6 py-12 z-40">
                <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-1 bg-[#1A1612] rounded-full"></span>
                    <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">
                        Preferences
                    </span>
                </div>
                <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">
                    Notifications
                </h1>
                <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-[280px]">
                    Manage how NU keeps you updated on your Ethiopian journey.
                </p>
            </div>

            <div className="px-6 py-8 space-y-10">
                {/* Permission State */}
                {permission !== "granted" ? (
                    <div className="bg-orange-50 p-8 rounded-[2.5rem] border border-orange-100 space-y-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md">
                            <Bell className="w-6 h-6 text-orange-500" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-gray-900 tracking-tight">Stay Updated</h3>
                            <p className="text-xs text-orange-800/70 font-medium leading-relaxed">
                                Get real-time road alerts, booking confirmations, and travel tips.
                            </p>
                        </div>
                        <button 
                            onClick={requestPermission}
                            className="w-full bg-[#1A1612] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 active:scale-95 transition-all"
                        >
                            Enable Notifications
                        </button>
                    </div>
                ) : (
                    <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 flex items-center gap-4">
                        <Shield className="w-5 h-5 text-emerald-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
                            Notifications are active
                        </span>
                    </div>
                )}

                {/* Categories */}
                <div className="space-y-6">
                    <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 px-2">Delivery Channels</h2>
                    
                    {[
                        { id: 'travelAlerts', label: 'Travel Alerts', sub: 'Road blocks, weather warnings, and safety.', icon: AlertTriangle, color: 'text-orange-500' },
                        { id: 'bookings', label: 'Bookings & Orders', sub: 'Hotel, pickup, and tour confirmations.', icon: ShoppingBag, color: 'text-blue-500' },
                        { id: 'dailyDiscovery', label: 'Daily Discoveries', sub: 'Cultural facts and Ethiopian food tips.', icon: Heart, color: 'text-red-500' },
                        { id: 'promotional', label: 'Product Updates', sub: 'New features and community discounts.', icon: Send, color: 'text-[#C9973B]' },
                    ].map((cat) => (
                        <div key={cat.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform`}>
                                    <cat.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#1A1612] text-sm tracking-tight">{cat.label}</h4>
                                    <p className="text-[10px] text-gray-400 font-medium">{cat.sub}</p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => togglePref(cat.id as keyof typeof preferences)}
                                className={`w-12 h-7 rounded-full relative transition-all duration-300 ${preferences[cat.id as keyof typeof preferences] ? 'bg-[#1A1612]' : 'bg-gray-200'}`}
                            >
                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${preferences[cat.id as keyof typeof preferences] ? 'left-6 shadow-sm' : 'left-1'}`} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Privacy Hint */}
                <div className="flex items-start gap-4 px-2 py-4 border-t border-gray-100">
                    <Info className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                    <p className="text-[9px] text-gray-400 font-medium leading-relaxed">
                        We respect your focus. Notifications are only sent for critical travel updates or requested cultural discoveries. You can unsubscribe at any time.
                    </p>
                </div>
            </div>
        </div>
    );
}
