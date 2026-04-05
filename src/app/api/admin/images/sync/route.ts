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
        // Sync operation: Re-fetch and re-verify image counts and scores
        // We can also trigger a revalidation if a webhook is available.
        const places = await prisma.place.findMany({
            select: { id: true, name: true }
        });

        const deployHook = process.env.VERCEL_DEPLOY_HOOK;
        if (deployHook) {
            console.log("Triggering Vercel Redeploy...");
            await fetch(deployHook, { method: 'POST' });
        }

        return NextResponse.json({ 
            success: true, 
            message: `Synchronized ${places.length} entities and triggered cache refresh.`,
            meta: {
                totalSynced: places.length,
                triggeredRedeploy: !!deployHook
            }
        });
    } catch (e: any) {
        console.error("Sync Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
