import React from "react";
import { ArrowLeft, Eye, Shield } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#FAFAF8] pb-24">
            <div className="bg-[#1A1612] px-6 pt-20 pb-16 rounded-b-[4rem] text-center">
                <Link href="/legal/compliance" className="inline-flex w-12 h-12 bg-white/5 rounded-2xl items-center justify-center mb-6 border border-white/10">
                    <ArrowLeft className="w-6 h-6 text-gray-400" />
                </Link>
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Privacy Policy</h1>
            </div>

            <div className="px-6 -mt-8 max-w-2xl mx-auto">
                <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100 space-y-8 text-gray-800">
                    <section className="space-y-4">
                        <h2 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                            <Eye className="w-4 h-4 text-slate-500" /> 1. Data Collection
                        </h2>
                        <p className="text-xs leading-relaxed font-medium">
                            We collect basic account information (name, email) and usage data to provide travel recommendations. If you choose to share your location, we use it to show nearby gems.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                            <Shield className="w-4 h-4 text-slate-500" /> 2. Data Usage
                        </h2>
                        <p className="text-xs leading-relaxed font-medium">
                            Your data remains yours. We do not sell personal data to third parties. We use industry-standard encryption for storage and transmission.
                        </p>
                    </section>
                    
                    <section className="space-y-4">
                        <h2 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4 text-slate-500" /> 3. Your Rights
                        </h2>
                        <p className="text-xs leading-relaxed font-medium">
                            You have the right to access, export, or delete your account at any time via the Profile settings in the app.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
