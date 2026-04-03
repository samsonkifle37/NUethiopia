"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

interface ToastProps {
    message: string;
    type: "success" | "error";
    duration?: number;
    onClose: () => void;
}

const Toast = ({ message, type, duration = 3000, onClose }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const bgColor = type === "success" ? "bg-[#1A1A2E]" : "bg-red-600";
    const iconColor = type === "success" ? "text-[#D4AF37]" : "text-white";

    return (
        <div className={`fixed bottom-24 left-6 right-6 z-[9999] flex items-center justify-between p-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300 ${bgColor} text-white`}>
            <div className="flex items-center gap-3">
                {type === "success" ? (
                    <CheckCircle className={`w-5 h-5 ${iconColor}`} />
                ) : (
                    <AlertCircle className={`w-5 h-5 ${iconColor}`} />
                )}
                <span className="text-sm font-black uppercase tracking-tight">{message}</span>
            </div>
            <button onClick={onClose} className="p-1 opacity-50 hover:opacity-100 transition-opacity">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

interface ToastContextType {
    showToast: (message: string, type: "success" | "error") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
            )}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within a ToastProvider");
    return context;
};
