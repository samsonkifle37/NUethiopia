import React from "react";
import { ArrowLeft, User, LogOut, Key, Trash2 } from "lucide-react";
import Link from "next/link";

export default function AccountManagement() {
    return (
        <div className="min-h-screen bg-[#FAFAF8] pb-24">
            <div className="bg-[#1A1612] px-6 pt-20 pb-16 rounded-b-[4rem] text-center">
                <Link href="/legal/compliance" className="inline-flex w-12 h-12 bg-white/5 rounded-2xl items-center justify-center mb-6 border border-white/10">
                    <ArrowLeft className="w-6 h-6 text-gray-400" />
                </Link>
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Account Management</h1>
            </div>

            <div className="px-6 -mt-8 max-w-2xl mx-auto space-y-4">
                <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-gray-100 flex flex-col gap-4">
                    <Link href="/profile" className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="text-xs font-black uppercase">View My Profile</span>
                    </Link>
                    <Link href="/auth" className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl">
                        <Key className="w-5 h-5 text-gray-400" />
                        <span className="text-xs font-black uppercase">Reset Password / Sign In</span>
                    </Link>
                    <Link href="/profile" className="flex items-center gap-4 p-5 bg-red-50 text-red-500 rounded-2xl">
                        <Trash2 className="w-5 h-5" />
                        <span className="text-xs font-black uppercase">Initiate Account Deletion</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
