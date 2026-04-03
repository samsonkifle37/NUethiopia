import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "addis_fallback_secret";

export async function GET(request: NextRequest) {
    try {
        // Verify the user has a valid session (any authenticated user reaching /admin/* is already behind auth)
        const token = request.cookies.get("auth-token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized - no session" }, { status: 401 });
        }

        try {
            jwt.verify(token, JWT_SECRET);
        } catch {
            return NextResponse.json({ error: "Unauthorized - invalid session" }, { status: 401 });
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                accountType: true,
                roles: true,
                isEmailVerified: true,
                createdAt: true,
                _count: {
                    select: {
                        itineraries: true,
                        reviews: true,
                        favorites: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ users });
    } catch (error) {
        console.error("[USERS_GET]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
