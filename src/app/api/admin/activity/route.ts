import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "addis_fallback_secret";

export async function GET(request: NextRequest) {
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
        const [recentUsers, recentHostListings, recentReviews, recentClaims] = await Promise.all([
            prisma.user.findMany({
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: { id: true, name: true, email: true, createdAt: true }
            }),
            prisma.hostListing.findMany({
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: { id: true, title: true, status: true, hostName: true, createdAt: true, city: true }
            }),
            prisma.review.findMany({
                orderBy: { createdAt: 'desc' },
                take: 3,
                select: {
                    id: true, rating: true, createdAt: true,
                    place: { select: { name: true } },
                    user: { select: { name: true } }
                }
            }),
            prisma.ownerClaim.findMany({
                orderBy: { submittedAt: 'desc' },
                take: 3,
                select: {
                    id: true, fullName: true, status: true, submittedAt: true,
                    place: { select: { name: true } }
                }
            }),
        ]);

        const events = [
            ...recentUsers.map(u => ({
                id: u.id,
                type: 'USER_REGISTERED',
                name: u.name,
                detail: u.email,
                status: 'VERIFIED',
                time: u.createdAt,
            })),
            ...recentHostListings.map(l => ({
                id: l.id,
                type: 'LISTING_SUBMITTED',
                name: l.title || 'Untitled Listing',
                detail: `${l.hostName} · ${l.city}`,
                status: l.status,
                time: l.createdAt,
            })),
            ...recentReviews.map(r => ({
                id: r.id,
                type: 'REVIEW_POSTED',
                name: r.place?.name || 'Unknown Place',
                detail: `${r.rating}★ by ${r.user?.name || 'User'}`,
                status: 'SUCCESS',
                time: r.createdAt,
            })),
            ...recentClaims.map(c => ({
                id: c.id,
                type: 'CLAIM_SUBMITTED',
                name: c.place?.name || 'Unknown Place',
                detail: c.fullName,
                status: c.status,
                time: c.submittedAt,
            })),
        ]
            .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
            .slice(0, 10);

        const [userCount, activeHostListings, placeCount, pendingHostListings] = await Promise.all([
            prisma.user.count(),
            prisma.hostListing.count({ where: { status: 'APPROVED' } }),
            prisma.place.count({ where: { isActive: true } }),
            prisma.hostListing.count({ where: { status: 'PENDING' } }),
        ]);

        return NextResponse.json({
            events,
            stats: {
                users: userCount,
                activeStays: activeHostListings,
                directoryItems: placeCount,
                pendingReviews: pendingHostListings,
            }
        });
    } catch (error) {
        console.error("[ADMIN_ACTIVITY]", error);
        return NextResponse.json({
            events: [],
            stats: { users: 0, activeStays: 0, directoryItems: 0, pendingReviews: 0 }
        });
    }
}
