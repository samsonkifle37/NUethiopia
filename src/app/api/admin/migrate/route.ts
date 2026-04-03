import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "addis_fallback_secret";

// Temporary migration endpoint — creates the HostListing tables
// DELETE this file after running once
export async function POST(request: NextRequest) {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { accountType: string };
        if (decoded.accountType !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Create enums
        await prisma.$executeRawUnsafe(`
            DO $$ BEGIN
                CREATE TYPE "HostListingStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        await prisma.$executeRawUnsafe(`
            DO $$ BEGIN
                CREATE TYPE "HostPlaceType" AS ENUM ('APARTMENT', 'GUESTHOUSE', 'ENTIRE_HOME', 'PRIVATE_ROOM', 'SHARED_ROOM');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        // Create HostListing table
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "HostListing" (
                "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
                "status" "HostListingStatus" NOT NULL DEFAULT 'PENDING',
                "placeType" "HostPlaceType" NOT NULL,
                "title" TEXT NOT NULL,
                "description" TEXT NOT NULL,
                "city" TEXT NOT NULL,
                "area" TEXT NOT NULL DEFAULT '',
                "country" TEXT NOT NULL DEFAULT 'Ethiopia',
                "maxGuests" INTEGER NOT NULL,
                "bedrooms" INTEGER NOT NULL,
                "beds" INTEGER NOT NULL,
                "bathrooms" INTEGER NOT NULL,
                "pricePerNight" DOUBLE PRECISION NOT NULL,
                "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
                "hostName" TEXT NOT NULL,
                "hostEmail" TEXT NOT NULL,
                "hostPhone" TEXT NOT NULL,
                "rejectionReason" TEXT,
                "approvedByUserId" TEXT,
                "approvedAt" TIMESTAMP(3),
                "linkedPlaceId" TEXT,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "HostListing_pkey" PRIMARY KEY ("id")
            );
        `);

        // Create HostListingImage table
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "HostListingImage" (
                "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
                "hostListingId" TEXT NOT NULL,
                "imageUrl" TEXT NOT NULL,
                "altText" TEXT,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "HostListingImage_pkey" PRIMARY KEY ("id")
            );
        `);

        // Add foreign keys (idempotent)
        await prisma.$executeRawUnsafe(`
            DO $$ BEGIN
                ALTER TABLE "HostListingImage"
                    ADD CONSTRAINT "HostListingImage_hostListingId_fkey"
                    FOREIGN KEY ("hostListingId") REFERENCES "HostListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        await prisma.$executeRawUnsafe(`
            DO $$ BEGIN
                ALTER TABLE "HostListing"
                    ADD CONSTRAINT "HostListing_linkedPlaceId_fkey"
                    FOREIGN KEY ("linkedPlaceId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        // Create index on status
        await prisma.$executeRawUnsafe(`
            CREATE INDEX IF NOT EXISTS "HostListing_status_idx" ON "HostListing"("status");
        `);

        return NextResponse.json({ message: "Migration complete — HostListing tables created!" });
    } catch (error) {
        console.error("Migration error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
