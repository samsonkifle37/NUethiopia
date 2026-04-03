import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "addis_fallback_secret";

function getAdminUser(request: NextRequest): { userId: string } | null {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        return decoded;
    } catch {
        return null;
    }
}

// GET /api/admin/host-listings?status=pending
export async function GET(request: NextRequest) {
    const admin = getAdminUser(request);
    if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check user has admin role
    const user = await prisma.user.findUnique({ where: { id: admin.userId } });
    if (!user || user.accountType !== "admin" && !user.roles?.includes("admin")) {
        return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status")?.toUpperCase() || "PENDING";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (status !== "ALL") {
        where.status = status;
    }

    const dbListings = await prisma.stayListing.findMany({
        where,
        include: {
            images: { take: 1, orderBy: { priority: "asc" } },
            owner: true
        },
        orderBy: { createdAt: "desc" },
    });

    // Map to expected frontend format
    const listings = dbListings.map(l => ({
        id: l.id,
        status: l.status,
        placeType: l.listingType,
        title: l.propertyName,
        description: l.description,
        city: l.city,
        area: l.region || "",
        maxGuests: l.numberOfRooms || 2,
        bedrooms: l.numberOfRooms || 1,
        beds: l.numberOfRooms || 1,
        bathrooms: 1,
        pricePerNight: l.priceRange ? parseFloat(l.priceRange) : 0,
        amenities: l.amenities,
        hostName: l.owner.name,
        hostEmail: l.owner.email,
        hostPhone: l.contactPhone || "",
        rejectionReason: l.rejectionReason,
        createdAt: l.createdAt.toISOString(),
        images: l.images.map(img => ({ id: img.id, imageUrl: img.imageUrl, altText: null }))
    }));

    return NextResponse.json({ listings });
}
