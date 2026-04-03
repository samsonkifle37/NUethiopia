import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/admin/promote — make a user admin (protected by seed secret)
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "addis_fallback_secret";

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
        const { secret, email } = await request.json();

        if (secret !== process.env.ADMIN_SEED_SECRET) {
            return NextResponse.json({ error: "Unauthorized - secret mismatch" }, { status: 401 });
        }

        const user = await prisma.user.update({
            where: { email },
            data: { 
                roles: ["traveller", "admin"],
                accountType: "admin"
            },
        });

        return NextResponse.json({
            message: `${user.name} (${user.email}) is now an admin`,
            roles: user.roles,
        });
    } catch (error) {
        console.error("Promote error:", error);
        return NextResponse.json({ error: "Failed to promote user" }, { status: 500 });
    }
}
