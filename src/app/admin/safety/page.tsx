"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  ShieldAlert, Save, RefreshCcw, AlertTriangle, 
  CheckCircle2, XCircle, Info, MapPin
} from "lucide-react";
import { useState } from "react";

interface StatusItem {
  region: string;
  status: "GREEN" | "YELLOW" | "RED";
  summary: string;
  details: string;
}

export default function SafetyAdmin() {
  const [editingRegion, setEditingRegion] = useState<StatusItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-safety-status"],
    queryFn: async () => {
      const res = await fetch("/api/safety/status");
      const d = await res.json();
      return d.statuses as StatusItem[];
    },
  });

  const handleSave = async () => {
    if (!editingRegion) return;
    setIsSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/safety/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingRegion),
      });
      if (res.ok) {
        setMsg("Updated successfully!");
        refetch();
        setTimeout(() => setMsg(""), 3000);
      } else {
        setMsg("Failed to update.");
      }
    } catch {
      setMsg("Error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 p-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <h1 className="text-2xl font-black text-[#1A1612] uppercase tracking-tight italic">Travel Status Control</h1>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Situational Awareness Management</p>
        </div>
        <button 
          onClick={() => refetch()}
          className="p-3 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors"
        >
          <RefreshCcw className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Region List */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Active Regions</h3>
          {isLoading ? (
            <div className="h-40 bg-gray-50 rounded-3xl animate-pulse" />
          ) : (
            data?.map((item) => (
              <button 
                key={item.region}
                onClick={() => setEditingRegion(item)}
                className={`w-full flex items-center justify-between p-4 rounded-3xl border transition-all text-left ${editingRegion?.region === item.region ? 'border-[#C9973B] bg-[#C9973B]/5 shadow-md' : 'border-gray-100 bg-white hover:border-[#C9973B]/30'}`}
              >
                <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${item.status === 'GREEN' ? 'bg-emerald-500' : item.status === 'YELLOW' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                    <div>
                        <h4 className="text-sm font-black text-[#1A1612] uppercase tracking-tight">{item.region}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{item.status} Status</p>
                    </div>
                </div>
                <Info className="w-4 h-4 text-gray-300" />
              </button>
            ))
          )}
        </div>

        {/* Edit Panel */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden flex flex-col">
          {editingRegion ? (
            <div className="p-8 space-y-6">
               <div className="flex items-center gap-2 pb-4 border-b border-gray-50">
                   <MapPin className="w-5 h-5 text-[#C9973B]" />
                   <h3 className="text-lg font-black text-[#1A1612] uppercase tracking-tight">Editing: {editingRegion.region}</h3>
               </div>

               <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Current Status</label>
                    <div className="flex gap-2">
                        {["GREEN", "YELLOW", "RED"].map(s => (
                            <button
                                key={s}
                                onClick={() => setEditingRegion({...editingRegion, status: s as any})}
                                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${editingRegion.status === s ? (s === 'GREEN' ? 'bg-emerald-500 text-white border-emerald-500' : s === 'YELLOW' ? 'bg-amber-500 text-white border-amber-500' : 'bg-rose-500 text-white border-rose-500') : 'bg-gray-50 text-gray-400 border-transparent'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Summary Line</label>
                    <input 
                        type="text"
                        value={editingRegion.summary}
                        onChange={e => setEditingRegion({...editingRegion, summary: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-xl p-4 text-xs font-bold text-[#1A1612] focus:ring-2 focus:ring-[#C9973B]/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Details / Advice</label>
                    <textarea 
                        rows={4}
                        value={editingRegion.details}
                        onChange={e => setEditingRegion({...editingRegion, details: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-xl p-4 text-xs font-medium text-gray-600 focus:ring-2 focus:ring-[#C9973B]/30"
                    />
                  </div>
               </div>

               <div className="pt-6 flex items-center justify-between">
                    {msg && (
                        <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase ${msg.includes('success') ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {msg.includes('success') ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            {msg}
                        </div>
                    )}
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="ml-auto bg-[#1A1612] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-[#C9973B] transition-all disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? "Saving..." : "Apply Changes"}
                    </button>
               </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 opacity-40">
                <ShieldAlert className="w-12 h-12 text-gray-300" />
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Select a region to adjust its safety status</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
