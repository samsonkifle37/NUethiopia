"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Mail, Lock, Loader2, LogIn, Sparkles, X, ArrowLeft, Home, Building2, CheckCircle } from "lucide-react";
import { Logo } from "@/components/Logo";

import { Suspense } from "react";

function AuthPageContent() {
    const { login, register } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const [mode, setMode] = useState<"login" | "register">("login");
    const [accountType, setAccountType] = useState<"user" | "host">("user");
    
    const [name, setName] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");
        setLoading(true);

        const result =
            mode === "login"
                ? await login(email, password)
                : await register(name, email, password, accountType, accountType === "host" ? businessName : undefined);

        setLoading(false);

        if (result.error) {
            setError(result.error);
        } else if (mode === "register") {
            setSuccessMsg("Registration successful! Please check your email inbox to verify your account.");
            // Do not immediately redirect on register so they can read the verify prompt
            setTimeout(() => {
                if (accountType === "host") {
                    router.push("/profile/host");
                } else {
                    router.push(callbackUrl);
                }
            }, 3000);
        } else {
             // Successful Login
             router.push(callbackUrl);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAF8] flex flex-col pt-10 px-4">
            <div className="w-full max-w-md mx-auto">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm mb-6 mt-4 hover:bg-gray-50"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>

                <div className="bg-white rounded-[2rem] p-6 pb-10 shadow-xl border border-gray-100">
                    <div className="text-center mb-6">
                        <Logo className="w-16 h-16 mx-auto mb-3" />
                        <h2 className="text-2xl font-black tracking-tight text-gray-900">
                            {mode === "login" ? "Welcome Back" : "Create Account"}
                        </h2>
                        <p className="text-gray-400 text-sm mt-1 font-medium">
                            {mode === "login"
                                ? "Sign in to access your dashboard"
                                : "Join NU to experience or host the best"}
                        </p>
                    </div>

                    {successMsg && (
                         <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                             <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                             <p className="text-sm font-medium text-green-800 leading-snug">{successMsg}</p>
                         </div>
                    )}

                    {!successMsg && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            
                            {mode === "register" && (
                                <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setAccountType("user")}
                                        className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${accountType === "user" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-black"}`}
                                    >
                                        <User className="w-4 h-4" /> Traveller
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setAccountType("host")}
                                        className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${accountType === "host" ? "bg-[#1A1612] text-[#D4AF37] shadow-sm" : "text-gray-500 hover:text-black"}`}
                                    >
                                        <Home className="w-4 h-4" /> Become a Host
                                    </button>
                                </div>
                            )}

                            {mode === "register" && (
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Full name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] text-sm font-medium"
                                    />
                                </div>
                            )}

                            {mode === "register" && accountType === "host" && (
                                <div className="space-y-1">
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Business or Property Name"
                                            value={businessName}
                                            onChange={(e) => setBusinessName(e.target.value)}
                                            required
                                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] text-sm font-medium"
                                        />
                                    </div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400 pl-2">Applies to hotels, apartments & tours</p>
                                </div>
                            )}

                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] text-sm font-medium text-black"
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] text-sm font-medium text-black"
                                />
                            </div>

                            {error && (
                                <p className="text-red-600 text-xs font-bold bg-red-50 px-4 py-3 border border-red-100 rounded-xl">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#1A1612] text-[#D4AF37] py-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-lg shadow-[#1A1612]/20 disabled:opacity-50 mt-6"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : mode === "login" ? (
                                    <>
                                        <LogIn className="w-4 h-4" /> Sign In
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" /> {accountType === "host" ? "Register as Host" : "Create Account"}
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <button
                            onClick={() => {
                                setMode(mode === "login" ? "register" : "login");
                                setError("");
                                setSuccessMsg("");
                            }}
                            className="text-sm font-bold text-gray-500 hover:text-black transition-colors"
                        >
                            {mode === "login" ? "Need an account? Sign up" : "Already have an account? Sign in"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-gray-500" /></div>}>
            <AuthPageContent />
        </Suspense>
    );
}
