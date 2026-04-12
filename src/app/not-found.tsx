import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | NU Ethiopia",
  description: "The page you're looking for doesn't exist or has been moved.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-6 pb-24">
      <div className="text-center space-y-8 max-w-sm">
        {/* Branding */}
        <div className="space-y-2">
          <span
            className="block"
            style={{
              fontFamily: "'Noto Sans Ethiopic', serif",
              fontSize: "5rem",
              fontWeight: 900,
              color: "#C9973B",
              lineHeight: 1,
            }}
          >
            ኑ
          </span>
          <h1 className="text-3xl font-black text-[#1A1612] uppercase tracking-tighter italic">
            Page not found
          </h1>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full bg-[#1A1612] text-[#C9973B] py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:bg-black transition-colors"
          >
            Back to Home
          </Link>
          <div className="grid grid-cols-3 gap-2">
            <Link
              href="/stays"
              className="bg-white p-4 rounded-2xl border border-gray-100 text-center hover:border-[#C9973B]/30 transition-all shadow-sm"
            >
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-700">Stays</p>
            </Link>
            <Link
              href="/tours"
              className="bg-white p-4 rounded-2xl border border-gray-100 text-center hover:border-[#C9973B]/30 transition-all shadow-sm"
            >
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-700">Tours</p>
            </Link>
            <Link
              href="/transport"
              className="bg-white p-4 rounded-2xl border border-gray-100 text-center hover:border-[#C9973B]/30 transition-all shadow-sm"
            >
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-700">Transport</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
