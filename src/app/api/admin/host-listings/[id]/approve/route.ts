import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "addis_fallback_secret";

function getAdminUser(request: NextRequest): { userId: string } | null {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) return null;
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch {
        return null;
    }
}

// Map HostPlaceType enum to Place type string
function mapPlaceType(hostPlaceType: string): string {
    const map: Record<string, string> = {
        APARTMENT: "apartment",
        GUESTHOUSE: "guesthouse",
        ENTIRE_HOME: "apartment",
        PRIVATE_ROOM: "guesthouse",
        SHARED_ROOM: "guesthouse",
    };
    return map[hostPlaceType] || "apartment";
}

// POST /api/admin/host-listings/[id]/approve
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = getAdminUser(request);
    if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: admin.userId } });
    if (!user || !user.roles.includes("admin")) {
        return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { id } = await params;

    const listing = await prisma.stayListing.findUnique({
        where: { id },
        include: { images: true, owner: true },
    });

    if (!listing) {
        return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (listing.status !== "PENDING") {
        return NextResponse.json(
            { error: `Listing is already ${listing.status.toLowerCase()}` },
            { status: 400 }
        );
    }

    // 1. Generate slug
    const slug = listing.propertyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    // Check for slug conflicts
    const existingSlug = await prisma.place.findUnique({ where: { slug } });
    const finalSlug = existingSlug ? `${slug}-${Date.now().toString(36)}` : slug;

    // 2. Create Place from listing
    const place = await prisma.place.create({
        data: {
            type: listing.listingType.toLowerCase(),
            name: listing.propertyName,
            slug: finalSlug,
            shortDescription: listing.description.substring(0, 200),
            longDescription: listing.description,
            city: listing.city,
            area: listing.region || "",
            country: "Ethiopia",
            phone: listing.contactPhone,
            email: listing.contactEmail,
            tags: [
                listing.listingType.toLowerCase().replace("_", "-"),
                "hosted-home",
                listing.city.toLowerCase(),
            ],
            source: "user-host",
            isActive: true,
        },
    });

    // 3. Copy images to PlaceImage
    if (listing.images.length > 0) {
        await prisma.placeImage.createMany({
            data: listing.images.map((img, index) => ({
                placeId: place.id,
                imageUrl: img.imageUrl,
                altText: listing.propertyName,
                priority: index,
            })),
        });
    }

    // 4. Update StayListing
    const updated = await prisma.stayListing.update({
        where: { id },
        data: {
            status: "APPROVED"
        },
    });
    
    // Add history
    await prisma.listingSubmissionHistory.create({
       data: { stayListingId: id, action: "APPROVED", adminId: admin.userId }
    });

    return NextResponse.json({
        message: "Listing approved and added to Stays!",
        listing: updated,
        place: { id: place.id, slug: place.slug, name: place.name },
    });
}
