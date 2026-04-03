import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * 🔒 CRITICAL ADMIN RECOVERY API
 * 
 * This is a temporary emergency route to ensure the production admin account
 * is correctly set up in the live database.
 * 
 * REQUIRED HEADER: x-admin-secret (must match ADMIN_SEED_SECRET env)
 */
export async function POST(request: NextRequest) {
    try {
        const secret = request.headers.get("x-admin-secret");
        
        if (!process.env.ADMIN_SEED_SECRET || secret !== process.env.ADMIN_SEED_SECRET) {
            return NextResponse.json({ error: "Unauthorized access to recovery" }, { status: 401 });
        }

        const email = "nuethiopia2026@gmail.com";
        const rawPassword = "NuEthiopia2026";
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        console.log(`[RECOVERY] Synchronizing admin account: ${email}`);

        // Ensure user exists or update them
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                accountType: "admin",
                roles: ["traveller", "admin"],
                isEmailVerified: true,
                passwordHash: hashedPassword,
                name: "Nu Ethiopia Admin"
            },
            create: {
                email,
                name: "Nu Ethiopia Admin",
                passwordHash: hashedPassword,
                accountType: "admin",
                roles: ["traveller", "admin"],
                isEmailVerified: true
            }
        });

        return NextResponse.json({
            success: true,
            message: `Admin account ${email} has been synchronized and password reset to NuEthiopia2026.`,
            userId: user.id
        });

    } catch (error: any) {
        console.error("[RECOVERY] Fatal Error:", error);
        return NextResponse.json({ error: "Recovery failed", details: error.message }, { status: 500 });
    }
}
