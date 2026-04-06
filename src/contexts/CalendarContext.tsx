"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toEthiopian, formatEthiopian, EthiopianDate } from "@/lib/calendar/ethiopian";
import { useLanguage } from "./LanguageContext";

type CalendarType = "gregorian" | "ethiopian";

interface CalendarContextType {
    calendar: CalendarType;
    setCalendar: (cal: CalendarType) => void;
    formatDate: (date: Date) => string;
    getEthiopian: (date: Date) => EthiopianDate;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: ReactNode }) {
    const { language } = useLanguage();
    const [calendar, setCal] = useState<CalendarType>("gregorian");

    useEffect(() => {
        const saved = localStorage.getItem("nu_calendar") as CalendarType | null;
        if (saved === "gregorian" || saved === "ethiopian") setCal(saved);
    }, []);

    const setCalendar = (cal: CalendarType) => {
        setCal(cal);
        localStorage.setItem("nu_calendar", cal);
    };

    const formatDate = (date: Date) => {
        if (calendar === "ethiopian") {
            const eth = toEthiopian(date);
            return formatEthiopian(eth, language);
        }
        return date.toLocaleDateString(language, { month: "short", day: "numeric", year: "numeric" });
    };

    return (
        <CalendarContext.Provider value={{ calendar, setCalendar, formatDate, getEthiopian: toEthiopian }}>
            {children}
        </CalendarContext.Provider>
    );
}

export const useCalendar = () => {
    const context = useContext(CalendarContext);
    if (!context) throw new Error("useCalendar must be used within a CalendarProvider");
    return context;
};

// Component helper for dual display
export function DualDate({ date, className }: { date: Date | string, className?: string }) {
    const { calendar, formatDate } = useCalendar();
    const d = typeof date === "string" ? new Date(date) : date;
    const { language } = useLanguage();

    const primary = formatDate(d);
    
    // Calculate secondary
    let secondary = "";
    if (calendar === "gregorian") {
        const eth = toEthiopian(d);
        secondary = formatEthiopian(eth, language);
    } else {
        secondary = d.toLocaleDateString(language, { month: "short", day: "numeric" });
    }

    return (
        <div className={`flex flex-col ${className}`}>
            <span className="font-bold tracking-tight">{primary}</span>
            <span className="text-[10px] opacity-40 font-medium uppercase tracking-widest">{secondary}</span>
        </div>
    );
}
