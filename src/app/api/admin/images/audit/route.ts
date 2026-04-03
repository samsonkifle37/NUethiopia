import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "addis_fallback_secret";

export async function GET(request: NextRequest) {
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
        const stats = await prisma.imageAudit.groupBy({
            by: ['status'],
            _count: { id: true }
        });

        const items = await prisma.imageAudit.findMany({
            orderBy: { checkedAt: 'desc' },
            take: 100
        });

        const places = await prisma.place.findMany({
            where: { id: { in: items.map((i: any) => i.entityId) } },
            include: { images: true }
        });

        const placeMap = new Map(places.map(p => [p.id, p]));

        const mappedItems = items.map((item: any) => {
            const p: any = placeMap.get(item.entityId);
            return {
                ...item,
                primaryImagePresent: (p?.images?.length ?? 0) > 0,
                galleryCount: p?.images?.length ?? 0,
                mapsLinkPresent: !!p?.googleMapsUrl,
                websitePresent: !!p?.websiteUrl,
                contactDetailsPresent: !!(p?.phone || p?.email || p?.bookingUrl)
            };
        });

        return NextResponse.json({ stats, items: mappedItems });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch audit" }, { status: 500 });
    }
}
