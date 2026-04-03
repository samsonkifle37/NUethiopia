import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "addis_fallback_secret";

// POST /api/host-listings/draft
export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get("auth-token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, accountType: string };
        
        // Allow hosts/admins/business types to draft
        if (decoded.accountType === "user") {
            return NextResponse.json({ error: "Only hosts and businesses can create listings" }, { status: 403 });
        }

        const body = await request.json();
        
        const { 
            propertyName, 
            listingType, 
            description, 
            city, 
            fullAddress, 
            contactPhone, 
            priceRange, 
            currency 
        } = body;

        if (!propertyName || !city || !fullAddress) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const listing = await prisma.stayListing.create({
            data: {
                ownerId: decoded.userId,
                propertyName,
                listingType: listingType || "Hotel",
                description: description || "",
                city,
                fullAddress,
                contactPhone: contactPhone || null,
                priceRange: priceRange || null,
                currency: currency || "ETB",
                status: "DRAFT"
            }
        });

        // Add history log
        try {
            await prisma.listingSubmissionHistory.create({
                data: {
                    stayListingId: listing.id,
                    action: "DRAFT_CREATED",
                    notes: "Initial draft saved by owner via web app."
                }
            });
        } catch (e) {
            console.warn("History log skipped:", e);
        }

        return NextResponse.json({ success: true, listing });
    } catch (error) {
        console.error("Error creating draft listing:", error);
        return NextResponse.json({ error: "Failed to create listing draft" }, { status: 500 });
    }
}
