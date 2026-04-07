"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Currency = "ETB" | "USD" | "EUR";

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (cur: Currency) => void;
    formatPrice: (amount: number, fromCurrency?: Currency) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCur] = useState<Currency>("ETB");

    useEffect(() => {
        const saved = localStorage.getItem("nu_currency") as Currency | null;
        if (saved) setCur(saved);
    }, []);

    const setCurrency = (cur: Currency) => {
        setCur(cur);
        localStorage.setItem("nu_currency", cur);
    };

    const formatPrice = (amount: number, fromCurrency: Currency = "ETB") => {
        // Mock rates
        const rates = {
            USD: 128.5,
            EUR: 138.2,
            ETB: 1
        };
        
        let baseAmount = amount * (rates[fromCurrency] || 1);
        
        if (currency === "USD") {
            return `$${(baseAmount / rates.USD).toFixed(2)}`;
        }
        if (currency === "EUR") {
            return `€${(baseAmount / rates.EUR).toFixed(2)}`;
        }
        
        return `${baseAmount.toLocaleString()} ETB`;
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) throw new Error("useCurrency must be used within a CurrencyProvider");
    return context;
};
