"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function PlanError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-6 pb-24">
      <div className="text-center space-y-6 max-w-sm">
        <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center mx-auto">
          <AlertTriangle className="w-10 h-10 text-amber-400" />
        </div>
        <div>
          <h2 className="text-xl font-black text-[#1A1612] uppercase tracking-tighter italic">
            Planning hit a snag
          </h2>
          <p className="text-sm text-gray-500 mt-2 font-medium">
            The AI planner couldn&apos;t generate your itinerary. Let&apos;s try again.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="w-full bg-[#1A1612] text-[#C9973B] py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          <Link
            href="/"
            className="w-full bg-white text-gray-700 border border-gray-200 py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
