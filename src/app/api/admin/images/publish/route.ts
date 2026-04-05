import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
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
        // Update all PENDING images to APPROVED
        const result = await prisma.placeImage.updateMany({
            where: { status: "PENDING" },
            data: { status: "APPROVED" }
        });

        // Also update audits if any
        await prisma.imageAudit.updateMany({
            where: { status: "PENDING" },
            data: { status: "ok" }
        });

        return NextResponse.json({ 
            success: true, 
            message: `Successfully published ${result.count} images to production.`,
            count: result.count
        });
    } catch (e: any) {
        console.error("Publish Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
