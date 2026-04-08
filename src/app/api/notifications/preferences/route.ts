import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let preferences = await prisma.notificationPreference.findUnique({
            where: { userId: session.user.id }
        });

        if (!preferences) {
            // Create default preferences if they don't exist
            preferences = await prisma.notificationPreference.create({
                data: {
                    userId: session.user.id,
                    travel: true,
                    news: false,
                    bookings: true,
                    promos: false
                }
            });
        }

        return NextResponse.json({ preferences });
    } catch (error) {
        console.error("Failed to fetch notification preferences:", error);
        return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { travel, news, bookings, promos } = await request.json();

        const preferences = await prisma.notificationPreference.upsert({
            where: { userId: session.user.id },
            update: { travel, news, bookings, promos },
            create: {
                userId: session.user.id,
                travel,
                news,
                bookings,
                promos
            }
        });

        return NextResponse.json({ preferences });
    } catch (error) {
        console.error("Failed to update notification preferences:", error);
        return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 });
    }
}
