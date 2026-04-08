import React from "react";
import { ArrowLeft, Scale, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-[#FAFAF8] pb-24">
            <div className="bg-[#1A1612] px-6 pt-20 pb-16 rounded-b-[4rem] text-center">
                <Link href="/legal/compliance" className="inline-flex w-12 h-12 bg-white/5 rounded-2xl items-center justify-center mb-6 border border-white/10">
                    <ArrowLeft className="w-6 h-6 text-gray-400" />
                </Link>
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Terms of Service</h1>
            </div>

            <div className="px-6 -mt-8 max-w-2xl mx-auto">
                <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100 space-y-8 text-gray-800">
                    <section className="space-y-4">
                        <h2 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                            <Scale className="w-4 h-4 text-slate-500" /> 1. Acceptance
                        </h2>
                        <p className="text-xs leading-relaxed font-medium">
                            By using the NU Ethiopia app, you agree to these terms. If you do not agree, please do not use the service.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-slate-500" /> 2. Prohibited Conduct
                        </h2>
                        <p className="text-xs leading-relaxed font-medium">
                            Users may not post offensive content, scrape data without permission, or engage in fraudulent booking activities.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
