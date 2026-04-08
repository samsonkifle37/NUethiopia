import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const places = await prisma.place.findMany({
            where: {
                city: { contains: 'Addis', mode: 'insensitive' },
                type: { in: ['hotel', 'tour'] }
            },
            include: {
                images: true
            }
        });
        
        return NextResponse.json({ success: true, count: places.length, places });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
