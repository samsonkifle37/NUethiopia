"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BedDouble, Map, Car, User, Camera } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const NAV_KEYS = [
  { href: "/",            icon: Home,            key: "home"        },
  { href: "/stays",       icon: BedDouble,       key: "stays"       },
  { href: "/transport",   icon: Car,             key: "transport", variant: "special" },
  { href: "/tours",       icon: Map,             key: "tours"       },
  { href: "/profile",     icon: User,            key: "profile"     },
];

export function BottomNav() {
  const pathname = usePathname();
  const { tr } = useLanguage();

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-[0_-4px_30px_rgba(0,0,0,0.06)]">
      <div className="max-w-lg mx-auto flex justify-around items-center py-2 relative">
        {NAV_KEYS.map(({ href, icon: Icon, key, variant }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          
          if (variant === 'special') {
              return (
                <Link
                    key={href}
                    href={href}
                    className="flex flex-col items-center gap-0.5 -mt-8 bg-[#1A1612] text-[#C9973B] p-4 rounded-[2rem] shadow-2xl shadow-[#1A1612]/30 border-4 border-white active:scale-90 transition-all z-20"
                >
                    <Icon className="w-6 h-6" strokeWidth={2.5} />
                    <span className="text-[7px] font-black uppercase tracking-widest text-white/50">{tr("nav", "transport") || "Transport"}</span>
                </Link>
              );
          }

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-2xl transition-all duration-300 ${
                isActive ? "text-[#C9973B]" : "text-[#1A1A2E]/40 hover:text-[#1A1A2E]/80"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110" : ""}`}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span className={`text-[8px] font-black uppercase tracking-[0.1em] ${isActive ? "text-[#C9973B]" : ""}`}>
                {tr("nav", key)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
