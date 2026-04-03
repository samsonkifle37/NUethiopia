"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Settings, 
  Home, 
  Image as ImageIcon, 
  LayoutDashboard, 
  Database, 
  Users, 
  ShieldCheck, 
  Search,
  Bell,
  Menu,
  X,
  Plus
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth-context";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    const navItems = [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Listing Foundry", href: "/admin/foundry", icon: Database },
        { label: "Host Listings", href: "/admin/host-listings", icon: Home },
        { label: "Image Center", href: "/admin/image-center", icon: ImageIcon },
        { label: "User Management", href: "/admin/users", icon: Users },
        { label: "Debug & Utils", href: "/admin/debug-images", icon: Settings },
        { label: "Data Import", href: "/admin/import", icon: Plus },
    ];

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#F8F9FA] text-[#1A1612] font-sans">
            {/* Sidebar */}
            <aside 
                className={`fixed top-0 left-0 z-50 h-screen transition-all duration-500 bg-[#1A1612] shadow-2xl border-r border-white charcoal-texture
                ${isSidebarOpen ? 'w-72' : 'w-24'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="h-20 flex items-center px-6 gap-3 border-b border-white/5">
                        <Logo className="w-8 h-8 brightness-0 invert" />
                        {isSidebarOpen && (
                            <div className="flex flex-col">
                                <span className="font-black text-white leading-none text-sm tracking-tight uppercase">Admin</span>
                                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest mt-0.5">Control Center</span>
                            </div>
                        )}
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            
                            return (
                                <Link 
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group
                                    ${isActive 
                                        ? 'bg-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/20' 
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                                    {isSidebarOpen && (
                                        <span className={`text-xs font-bold tracking-wide ${isActive ? 'opacity-100' : 'opacity-90'}`}>
                                            {item.label}
                                        </span>
                                    )}
                                    {isActive && isSidebarOpen && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-6 border-t border-white/5 bg-black/20">
                        <div className="flex items-center gap-3 px-3 py-2 text-gray-500">
                             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                             <span className="text-[9px] font-black uppercase tracking-[0.2em]">Server Live</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area - must offset for fixed sidebar */}
            <div className={`flex flex-col h-screen transition-all duration-500 ${isSidebarOpen ? 'ml-72' : 'ml-24'}`} style={{ width: isSidebarOpen ? 'calc(100vw - 288px)' : 'calc(100vw - 96px)' }}>
                {/* Topbar */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-40">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-[#1A1612] transition-colors"
                        >
                            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        
                        <div className="relative group hidden lg:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search inventory, users, or system logs..."
                                className="pl-12 pr-6 py-3 bg-gray-50 rounded-2xl text-xs font-bold border-transparent focus:border-[#D4AF37]/20 focus:bg-white w-[400px] outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2.5 text-gray-400 hover:text-gray-900 transition-colors bg-gray-50 rounded-xl">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        
                        <div className="h-10 w-px bg-gray-100"></div>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black uppercase text-gray-900 leading-none">{user?.name || 'Guest Admin'}</p>
                                <p className="text-[9px] font-bold text-[#D4AF37] mt-1.5 uppercase tracking-widest">{user?.accountType === 'admin' ? 'Root Access' : 'No Access'}</p>
                            </div>
                            <div className="w-11 h-11 rounded-2xl bg-[#1A1612] text-[#D4AF37] flex items-center justify-center font-black text-sm shadow-xl shadow-[#1A1612]/20 border border-white/10">
                                {user?.name ? user.name.substring(0, 2).toUpperCase() : '??'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-10 bg-[#F8F9FA]">
                    <div className="w-full">
                        {children}
                    </div>
                </main>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
}
