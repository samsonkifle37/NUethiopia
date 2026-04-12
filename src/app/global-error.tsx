"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#FAFAF8] antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center space-y-6 max-w-sm">
            <div className="w-24 h-24 bg-red-50 rounded-[2.5rem] flex items-center justify-center mx-auto border border-red-100">
              <AlertTriangle className="w-12 h-12 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">
                Something went wrong
              </h1>
              <p className="text-sm text-gray-500 mt-2 font-medium leading-relaxed">
                An unexpected error occurred. Our team has been notified.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={reset}
                className="w-full bg-[#1A1612] text-[#C9973B] py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:bg-black transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
              <Link
                href="/"
                className="w-full bg-white text-gray-700 border border-gray-200 py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <Home className="w-4 h-4" /> Back to Home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
