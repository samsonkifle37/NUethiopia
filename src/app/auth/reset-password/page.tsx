"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Lock, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Failed to update password.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center px-4">
                <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 max-w-md w-full text-center space-y-6">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900">Password Updated</h2>
                    <p className="text-gray-500 text-sm">Your password has been reset successfully. You can now sign in with your new password.</p>
                    <button 
                        onClick={() => router.push("/auth")}
                        className="w-full bg-[#1A1612] text-[#D4AF37] py-4 rounded-xl text-xs font-black uppercase tracking-widest"
                    >
                        Go to Sign In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAF8] flex flex-col pt-20 px-4">
            <div className="w-full max-w-md mx-auto">
                <button
                    onClick={() => router.push("/auth")}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm mb-6 hover:bg-gray-50"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>

                <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100">
                    <div className="text-center mb-8">
                        <Logo className="w-16 h-16 mx-auto mb-3" />
                        <h2 className="text-2xl font-black tracking-tight text-gray-900 uppercase">Reset Password</h2>
                        <p className="text-gray-400 text-sm mt-1">Enter your new secure password below.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="password"
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] text-sm font-medium text-black"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] text-sm font-medium text-black"
                            />
                        </div>

                        {error && (
                            <p className="text-red-600 text-xs font-bold bg-red-50 px-4 py-3 border border-red-100 rounded-xl text-center">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1A1612] text-[#D4AF37] py-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-lg disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
