import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const city = searchParams.get("city") || "Addis Ababa";

        // Logic for "happening now"
        // 1. Featured card: Highest verificationScore + priority (verified places)
        // 2. Secondary cards: Dining (open now) + Alternative (coffee/culture)
        
        // Let's get the absolute best verified place first
        const featured = await prisma.place.findFirst({
            where: {
                city: { contains: city, mode: "insensitive" },
                status: "APPROVED",
                isActive: true,
                verificationScore: { gte: 80 },
                images: { some: {} } // Must have images
            },
            include: {
                images: { orderBy: { priority: "asc" }, take: 1 },
                _count: { select: { reviews: true } }
            },
            orderBy: [
                { verificationScore: "desc" },
                { visualScore: "desc" }
            ]
        });

        // Secondary 1: Dining (open now approx)
        const dining = await prisma.place.findFirst({
            where: {
                city: { contains: city, mode: "insensitive" },
                status: "APPROVED",
                isActive: true,
                type: "restaurant",
                id: { not: featured?.id || "" }
            },
            include: {
                images: { orderBy: { priority: "asc" }, take: 1 }
            },
            orderBy: { verificationScore: "desc" }
        });

        // Secondary 2: Alternative (coffee, culture, night)
        const alt = await prisma.place.findFirst({
            where: {
                city: { contains: city, mode: "insensitive" },
                status: "APPROVED",
                isActive: true,
                type: { in: ["coffee", "museum", "club", "park"] },
                id: { notIn: [featured?.id || "", dining?.id || ""] }
            },
            include: {
                images: { orderBy: { priority: "asc" }, take: 1 }
            },
            orderBy: { verificationScore: "desc" }
        });

        // Attach mock "urgency" and "micro-signals" as requested
        const addSignals = (p: any, type: string) => {
            if (!p) return null;
            
            let urgency = "";
            let signal = "Open now";
            
            if (type === "featured") {
                urgency = "Last seats";
                signal = "Popular tonight";
            } else if (type === "dining") {
                urgency = "Filling up fast";
                signal = "3 tables left";
            } else {
                signal = "Quiet right now";
            }

            return {
                ...p,
                urgency,
                microSignal: signal,
                distance: "1.2km away" // Mock distance for UI
            };
        };

        return NextResponse.json({
            featured: addSignals(featured, "featured"),
            secondary: [
                addSignals(dining, "dining"),
                addSignals(alt, "alt")
            ].filter(Boolean)
        });

    } catch (error) {
        console.error("Error in happening-now API:", error);
        return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 500 });
    }
}
