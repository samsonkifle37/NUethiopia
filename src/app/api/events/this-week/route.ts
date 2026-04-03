import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const now = new Date();
        const next7Days = new Date();
        next7Days.setDate(now.getDate() + 7);

        // Fetch direct events
        const events = await (prisma as any).event.findMany({
            where: {
                startTime: {
                    gte: now,
                    lte: next7Days
                }
            },
            orderBy: [
                { isFeatured: "desc" },
                { startTime: "asc" }
            ],
            take: 3,
            include: {
                place: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        type: true,
                        images: { orderBy: { priority: "asc" }, take: 1 }
                    }
                }
            }
        });

        let results = events.map((ev: any) => ({
            id: ev.id,
            slug: ev.slug,
            title: ev.title,
            shortDescription: ev.description,
            category: ev.category,
            startTime: ev.startTime,
            endTime: ev.endTime,
            badgeLabel: getSmartLabel(ev.startTime),
            placeId: ev.placeId,
            placeSlug: ev.place?.slug,
            imageUrl: ev.imageUrl || (ev.place?.images?.[0]?.imageUrl) || null,
            icon: getCategoryIcon(ev.category)
        }));

        // Fallback rule: if less than 3, fill with dynamic recommendations from places
        if (results.length < 3) {
            const extra = await (prisma as any).place.findMany({
                where: {
                    status: "APPROVED",
                    isActive: true,
                    // Avoid duplicating places already in results
                    NOT: { id: { in: results.filter((r: any) => r.placeId).map((r: any) => r.placeId) } },
                    OR: [
                        { type: { in: ["coffee", "culture", "tour"] } },
                        { hasLiveEvent: true }
                    ]
                },
                take: 3 - results.length,
                include: { images: { orderBy: { priority: "asc" }, take: 1 } }
            });

            const extraResults = extra.map((p: any) => ({
                id: p.id,
                slug: null, // No specific event slug, will route to place
                title: p.name,
                shortDescription: p.shortDescription || "Local experience in Addis.",
                category: getPlaceCategory(p.type),
                startTime: now,
                badgeLabel: "Featured",
                placeId: p.id,
                placeSlug: p.slug,
                imageUrl: p.images?.[0]?.imageUrl || null,
                icon: getCategoryIcon(getPlaceCategory(p.type))
            }));
            results = [...results, ...extraResults];
        }

        return NextResponse.json({ events: results.slice(0, 3) });
    } catch (error) {
        console.error("Events API Error:", error);
        return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
    }
}

function getPlaceCategory(type: string) {
    if (type === "coffee") return "food";
    if (type === "culture") return "culture";
    if (type === "tour") return "outdoor";
    return "culture";
}

function getCategoryIcon(cat: string) {
    switch (cat.toLowerCase()) {
        case "music": return "🎷";
        case "food": return "☕";
        case "outdoor": return "🥾";
        case "culture": return "🏛";
        default: return "🗓️";
    }
}

function getSmartLabel(time: Date) {
    const now = new Date();
    const eventDate = new Date(time);
    
    const diffMs = eventDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 2 && diffHours > 0) return "Starting soon";
    if (eventDate.getDate() === now.getDate()) return "Tonight";
    
    const day = eventDate.getDay();
    if (day === 0 || day === 6) return "This weekend";
    
    return eventDate.toLocaleDateString("en-US", { weekday: "short" });
}
