import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "addis_fallback_secret";

function getAdminUser(request: NextRequest): { userId: string; accountType: string } | null {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; accountType: string };
        return decoded;
    } catch {
        return null;
    }
}

// GET /api/admin/host-listings/[id] — get full detail
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const admin = getAdminUser(request);
    if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (admin.accountType !== "admin") {
        return NextResponse.json({ error: "Forbidden - admin access required" }, { status: 403 });
    }

    const { id } = await context.params;

    const dbListing = await prisma.stayListing.findUnique({
        where: { id },
        include: { images: true, owner: true },
    });

    if (!dbListing) {
        return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Map to expected format
    const listing = {
        id: dbListing.id,
        status: dbListing.status,
        placeType: dbListing.listingType,
        title: dbListing.propertyName,
        description: dbListing.description,
        city: dbListing.city,
        area: dbListing.region || "",
        maxGuests: dbListing.numberOfRooms || 2,
        bedrooms: dbListing.numberOfRooms || 1,
        beds: dbListing.numberOfRooms || 1,
        bathrooms: 1,
        pricePerNight: dbListing.priceRange ? parseFloat(dbListing.priceRange) : 0,
        amenities: dbListing.amenities,
        hostName: dbListing.owner.name,
        hostEmail: dbListing.owner.email,
        hostPhone: dbListing.contactPhone || "",
        rejectionReason: dbListing.rejectionReason,
        createdAt: dbListing.createdAt.toISOString(),
        images: dbListing.images.map(img => ({ id: img.id, imageUrl: img.imageUrl, altText: null }))
    };

    return NextResponse.json({ listing });
}
