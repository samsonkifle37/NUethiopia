import React from "react";
import { Shield, ArrowLeft, FileLock, Eye, UserCheck, Trash2, Scale } from "lucide-react";
import Link from "next/link";

export default function CompliancePage() {
    return (
        <div className="min-h-screen bg-[#FAFAF8] pb-24">
            <div className="bg-[#1A1612] px-6 pt-20 pb-16 rounded-b-[4rem] shadow-2xl relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-80 h-80 bg-slate-500/10 rounded-full blur-[100px]" />
                <div className="relative z-10">
                    <Link href="/profile" className="inline-flex w-12 h-12 bg-white/5 rounded-2xl items-center justify-center mb-6 border border-white/10">
                        <ArrowLeft className="w-6 h-6 text-gray-400" />
                    </Link>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Legal Trust Center</p>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">Compliance & Safety</h1>
                </div>
            </div>

            <div className="px-6 -mt-8 max-w-2xl mx-auto space-y-6">
                <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-gray-100 space-y-8 text-gray-800">
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-slate-500" />
                            <h2 className="text-sm font-black uppercase tracking-tight">App Store & Regulatory Compliance</h2>
                        </div>
                        <p className="text-xs leading-relaxed font-medium">
                            NU Ethiopia is committed to full transparency and data protection. We comply with international standards for digital services, ensuring your data is safe and your rights are protected.
                        </p>
                    </section>

                    <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-50">
                        {[
                            { title: "Privacy Policy", desc: "How we collect and protect your data", icon: Eye, href: "/legal/privacy" },
                            { title: "Terms of Service", desc: "Rules for using the NU platform", icon: Scale, href: "/legal/terms" },
                            { title: "Account Management", desc: "Sign in, out, and account settings", icon: UserCheck, href: "/legal/account-mgmt" },
                            { title: "Community Moderation", desc: "Our content review guidelines", icon: Shield, href: "/legal/moderation" },
                            { title: "Delete My Account", desc: "Permanent removal of all personal data", icon: Trash2, href: "/profile", isRed: true }
                        ].map((item) => (
                            <Link key={item.title} href={item.href} className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] hover:bg-gray-100 transition-all border border-transparent">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 ${item.isRed ? 'bg-red-50 text-red-500' : 'bg-white text-slate-500'} rounded-2xl flex items-center justify-center shadow-sm`}>
                                        <item.icon size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-black uppercase tracking-tight">{item.title}</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.desc}</p>
                                    </div>
                                </div>
                                <ArrowLeft className="w-4 h-4 text-gray-300 rotate-180" />
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-gray-100 text-center space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-tight">Need Legal Support?</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                        For copyright disputes or legal inquiries, please contact:<br/>
                        <span className="text-slate-500">nuethiopia2026@gmail.com</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
