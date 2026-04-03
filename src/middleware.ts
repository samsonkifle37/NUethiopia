import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"],
};

const JWT_SECRET = process.env.JWT_SECRET || "addis_fallback_secret";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Exempt the emergency recovery API from middleware (uses x-admin-secret)
    if (pathname === "/api/admin/recover-access") {
        return NextResponse.next();
    }

    // Auth Check
    const token = request.cookies.get("auth-token")?.value;
    
    if (!token) {
        if (pathname.startsWith("/api/")) {
            return NextResponse.json({ error: "Unauthorized: Missing authentication token" }, { status: 401 });
        }
        return NextResponse.redirect(new URL("/auth?redirect=" + encodeURIComponent(pathname), request.url));
    }

    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        
        // Authorization Check
        if (payload.accountType !== "admin") {
            if (pathname.startsWith("/api/")) {
                return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
            }
            return NextResponse.redirect(new URL("/?error=forbidden", request.url));
        }

        // All good, add headers just in case downstream API routes want basic proof without verifying again
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-user-id", String(payload.userId));
        requestHeaders.set("x-user-role", String(payload.accountType));

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
        
    } catch (error) {
        // Invalid token
        if (pathname.startsWith("/api/")) {
            return NextResponse.json({ error: "Unauthorized: Invalid or expired token" }, { status: 401 });
        }
        return NextResponse.redirect(new URL("/auth?redirect=" + encodeURIComponent(pathname), request.url));
    }
}
