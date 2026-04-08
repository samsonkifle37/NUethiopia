import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const counts = await prisma.place.groupBy({
            by: ['type', 'status'],
            _count: { id: true }
        });
        
        const imageCount = await prisma.placeImage.count();
        
        const latestUpdates = await prisma.place.findMany({
            where: { city: 'Addis Ababa', isActive: true },
            orderBy: { updatedAt: 'desc' },
            take: 10,
            select: { name: true, phone: true, subcategory: true, updatedAt: true }
        });

        const mergedCount = await prisma.place.count({
            where: { status: 'ARCHIVED' }
        });

        return NextResponse.json({ 
            success: true, 
            counts, 
            imageCount, 
            mergedCount,
            latestUpdates 
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
