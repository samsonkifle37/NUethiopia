import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "addis_fallback_secret";

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const token = req.cookies.get("auth-token")?.value;
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
        const { action } = await req.json(); // "approve" or "reject"
        const resolvedParams = await context.params;
        const claimId = resolvedParams.id;

        const claim = await prisma.ownerClaim.findUnique({
            where: { id: claimId },
            include: { place: true }
        });

        if (!claim) return NextResponse.json({ error: "Claim not found" }, { status: 404 });

        if (action === "approve") {
            // Update claim status
            await prisma.ownerClaim.update({
                where: { id: claimId },
                data: {
                    status: "APPROVED",
                    resolvedAt: new Date()
                }
            });

            // Update place status
            await prisma.place.update({
                where: { id: claim.placeId },
                data: {
                    ownerVerified: true,
                    ownerId: claim.userId,
                    claimedAt: new Date()
                }
            });

            return NextResponse.json({ success: true, status: "APPROVED" });
        } else if (action === "reject") {
            // Update claim status
            await prisma.ownerClaim.update({
                where: { id: claimId },
                data: {
                    status: "REJECTED",
                    resolvedAt: new Date()
                }
            });

            return NextResponse.json({ success: true, status: "REJECTED" });
        } else {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }
    } catch (error) {
        console.error("Admin claim action failed:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
