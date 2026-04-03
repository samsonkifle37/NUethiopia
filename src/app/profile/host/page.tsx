import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { PlusCircle, Building2, MapPin, Eye, Edit3, Trash2, ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HostDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    redirect("/auth");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || "addis_fallback_secret") as { userId: string };
  } catch (err) {
    redirect("/auth");
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    include: { businessProfile: true }
  });

  if (!user || user.accountType === "user") {
    redirect("/auth"); // Not a host
  }

  // Fetch their listings
  const listings = await prisma.stayListing.findMany({
    where: { ownerId: user.id },
    include: { images: { orderBy: { priority: "asc" } } },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <header className="bg-white border-b border-gray-100 py-4 px-6 fixed top-0 w-full z-50 flex items-center justify-between shadow-sm">
        <Link href="/" className="flex items-center gap-2">
            <Logo className="w-8 h-8" />
            <span className="font-black tracking-tight text-lg">Owner Central</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{user.businessProfile?.businessName || user.name}</span>
          <div className="w-8 h-8 bg-[#1A1612] text-[#D4AF37] rounded-full flex items-center justify-center font-bold text-sm">
             {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto pt-28 px-4 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#1A1612] mb-1">Your Properties</h1>
            <p className="text-gray-500 font-medium">Manage your NU Ethiopia Stay listings</p>
          </div>
          <Link href="/profile/host/new-property" className="bg-[#D4AF37] text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#C9973B] transition-colors shadow-lg shadow-[#D4AF37]/20">
            <PlusCircle className="w-5 h-5" />
            Add New Property
          </Link>
        </div>

        {!user.isEmailVerified && (
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl mb-8 flex items-start gap-4 shadow-sm">
            <ShieldAlert className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-orange-900">Email Verification Required</h3>
              <p className="text-orange-800 text-sm font-medium mt-1">Please check your inbox ({user.email}) to verify your account. New listings will remain drafts until verification is complete.</p>
            </div>
          </div>
        )}

        {listings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-16 flex flex-col items-center text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
               <Building2 className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No properties yet</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto font-medium">It looks like you haven&apos;t added any stays. Upload your first hotel, resort, or apartment to start accepting guests.</p>
            <Link href="/profile/host/new-property" className="bg-[#1A1612] text-[#D4AF37] px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-colors">
              <PlusCircle className="w-5 h-5" />
              Create First Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(listing => (
              <div key={listing.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all group">
                <div className="relative h-48 bg-gray-100">
                  {listing.images && listing.images.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={listing.images[0].imageUrl} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                      <Building2 className="w-8 h-8 mb-2" />
                      <span className="text-xs font-bold uppercase">No Photo</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                    {listing.status}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-2">
                    <span className="bg-[#D4AF37]/10 px-2 py-1 rounded-md">{listing.listingType}</span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-1 truncate">{listing.propertyName}</h3>
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium mb-4 truncate">
                     <MapPin className="w-3.5 h-3.5" /> {listing.city}{listing.region ? `, ${listing.region}` : ''}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
                    <Link href={`/profile/host/edit/${listing.id}`} className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4" /> Edit
                    </Link>
                    <button className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" /> Preview
                    </button>
                    <button className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
