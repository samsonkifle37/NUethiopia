import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "addis_fallback_secret";

function verifyToken(request: NextRequest) {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
        console.error("[VERIFY_TOKEN] No token found in cookies");
        return null;
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        return decoded;
    } catch (e: any) {
        console.error("[VERIFY_TOKEN] Token verification failed:", e.message, "Using Secret:", JWT_SECRET.substring(0, 3) + "...");
        return null;
    }
}

// PATCH: suspend or unsuspend a user
export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const decoded = verifyToken(request);
    if (!decoded) {
        return NextResponse.json({ 
            error: "Unauthorized", 
            details: "Invalid or missing session token. Please re-login.",
            debug: { hasToken: !!request.cookies.get("auth-token") }
        }, { status: 401 });
    }

    try {
        const { id: targetId } = await context.params;
        const { action } = await request.json();

        if (!targetId) return NextResponse.json({ error: "Missing user id" }, { status: 400 });
        if (decoded.userId === targetId) {
            return NextResponse.json({ error: "Cannot modify your own account" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { id: targetId }, select: { roles: true } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        let updatedRoles = (user.roles || []).filter((r: string) => r !== 'suspended');
        if (action === 'suspend') updatedRoles = [...updatedRoles, 'suspended'];

        await prisma.user.update({
            where: { id: targetId },
            data: { roles: updatedRoles }
        });

        return NextResponse.json({ success: true, suspended: action === 'suspend' });
    } catch (error: any) {
        console.error("[USER_PATCH]", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

// DELETE: permanently delete a user
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const decoded = verifyToken(request);
    if (!decoded) {
        return NextResponse.json({ 
            error: "Unauthorized", 
            details: "Session verification failed. Try logging out and back in.",
            debug: { hasToken: !!request.cookies.get("auth-token") }
        }, { status: 401 });
    }

    try {
        const { id: targetId } = await context.params;

        if (!targetId) return NextResponse.json({ error: "Missing user id" }, { status: 400 });
        
        // Prevent deleting yourself
        if (decoded.userId === targetId) {
            return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { id: targetId } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Perform the delete
        await prisma.user.delete({ where: { id: targetId } });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("[USER_DELETE] Error:", error?.code, error?.message);
        
        // Handle Prism-specific errors or dependency errors
        if (error?.code === 'P2003') {
            return NextResponse.json({ 
                error: "Conflict: Cannot delete user due to related records.",
                details: "Make sure all listings, reviews, and bookings are handled first or cascade is enabled.",
                code: error?.code
            }, { status: 500 });
        }

        return NextResponse.json({
            error: error?.meta?.cause || error?.message || "Delete failed",
            code: error?.code
        }, { status: 500 });
    }
}
