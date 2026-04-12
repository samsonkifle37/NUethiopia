'use server';

import { prisma } from '@/lib/prisma';
import { IngestionStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "addis_fallback_secret";

async function verifyAdmin() {
    const token = (await cookies()).get("auth-token")?.value;
    if (!token) throw new Error("Unauthorized");
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        if (decoded.accountType !== "admin") throw new Error("Forbidden");
        return decoded;
    } catch {
        throw new Error("Unauthorized");
    }
}

export async function getIngestionListings(filters: { status?: IngestionStatus | 'ALL', city?: string, category?: string, showGems?: boolean } = {}) {
    await verifyAdmin();
    const where: any = {};
    if (filters.status && filters.status !== 'ALL') where.status = filters.status;
    if (filters.city) where.city = filters.city;
    if (filters.category) where.category = filters.category;

    try {
        const listings = await prisma.ingestionListing.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 200,
        });

        // Fetch Gems if requested or if no filters are narrow
        let gems: any[] = [];
        if (filters.showGems || !filters.category) {
            gems = await (prisma as any).discoveryPost.findMany({
                where: { status: filters.status === 'PUBLISHED' ? 'APPROVED' : 'PENDING' },
                include: { user: { select: { name: true } } },
                take: 50
            });
        }

        const normalizedGems = gems.map(g => ({
            id: g.id,
            name: g.title,
            category: g.category,
            city: 'Addis Ababa',
            district: g.user?.name || 'Local Guide',
            status: g.status === 'APPROVED' ? 'PUBLISHED' : 'PENDING',
            shortDescription: g.title,
            tags: ['GEM', 'COMMUNITY'],
            slug: g.id,
            confidenceScore: 0.95,
            sourceProvenance: { fields: { raw_osm: { osm_type: null } } },
            images: [{ imageUrl: g.imageUrl }],
            isGem: true,
            createdAt: g.createdAt,
        }));

        const normalizedListings = listings.map((l: any) => ({
            id: l.id,
            name: l.name,
            category: l.category,
            city: l.city,
            district: l.district,
            status: l.status,
            shortDescription: l.shortDescription,
            tags: l.tags,
            slug: l.slug,
            confidenceScore: l.confidenceScore ?? 0,
            sourceProvenance: l.sourceProvenance,
            images: [], // IngestionListings usually start with 0 images until sync
            createdAt: l.createdAt,
        }));

        return [...normalizedGems, ...normalizedListings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch {
        // Fallback for missing table
        const places = await prisma.place.findMany({
            where: filters.city ? { city: filters.city } : filters.category ? { type: filters.category } : {},
            include: { images: true },
            orderBy: { createdAt: 'desc' },
            take: 200,
        });

        return places.map(l => ({
            id: l.id,
            name: l.name,
            category: l.type,
            city: l.city,
            district: l.district,
            status: l.status,
            shortDescription: l.shortDescription,
            tags: l.tags,
            slug: l.slug,
            confidenceScore: (l.verificationScore ?? 30) / 100,
            sourceProvenance: { fields: { raw_osm: { osm_type: l.source?.includes('osm') ? 'node' : null } } },
            images: l.images.map(img => ({ imageUrl: img.imageUrl })),
            createdAt: l.createdAt,
        }));
    }
}

export async function uploadListingImage(id: string, imageUrl: string) {
    await verifyAdmin();
    try {
        // Find if it's a place or ingestion
        const place = await prisma.place.findUnique({ where: { id } });
        if (place) {
            await prisma.placeImage.create({
                data: {
                    placeId: id,
                    imageUrl,
                    imageTruthType: 'place_real'
                }
            });
        }
    } catch (e) {
        console.error("Upload failed", e);
    }
    revalidatePath('/admin/foundry');
}

export async function approveListing(id: string) {
    await verifyAdmin();
    try {
        await prisma.ingestionListing.update({
            where: { id },
            data: { status: IngestionStatus.PUBLISHED }
        });
    } catch {
        await prisma.place.update({ where: { id }, data: { status: 'APPROVED', isActive: true } });
    }
    revalidatePath('/admin/foundry');
}

export async function rejectListing(id: string) {
    await verifyAdmin();
    try {
        await prisma.ingestionListing.update({
            where: { id },
            data: { status: IngestionStatus.REJECTED }
        });
    } catch {
        await prisma.place.update({ where: { id }, data: { status: 'REJECTED', isActive: false } });
    }
    revalidatePath('/admin/foundry');
}

export async function rerunImageLookup(id: string) {
    await verifyAdmin();
    try {
        await prisma.ingestionListing.update({
            where: { id },
            data: { status: IngestionStatus.REVIEW, confidenceScore: { increment: 0.05 } }
        });
    } catch {
        await prisma.place.update({ where: { id }, data: { verificationScore: { increment: 5 } } });
    }
    revalidatePath('/admin/foundry');
}

export async function updateListingDescription(id: string, description: string) {
    await verifyAdmin();
    try {
        const place = await prisma.place.findUnique({ where: { id } });
        if (place) {
            await prisma.place.update({
                where: { id },
                data: { shortDescription: description }
            });
        }
    } catch (e) {
        console.error("Update failed", e);
    }
    revalidatePath('/admin/foundry');
}

export async function getFoundryMetadata() {
    await verifyAdmin();
    try {
        const [ingestionCities, ingestionCats, placeCities, placeCats] = await Promise.all([
            prisma.ingestionListing.findMany({ select: { city: true }, distinct: ['city'] }),
            prisma.ingestionListing.findMany({ select: { category: true }, distinct: ['category'] }),
            prisma.place.findMany({ select: { city: true }, distinct: ['city'] }),
            prisma.place.findMany({ select: { type: true }, distinct: ['type'] }),
        ]);

        const cities = Array.from(new Set([
            ...ingestionCities.map(c => c.city),
            ...placeCities.map(c => c.city)
        ])).filter(Boolean).sort();

        const categories = Array.from(new Set([
            ...ingestionCats.map(c => c.category),
            ...placeCats.map(c => c.type)
        ])).filter(Boolean).sort();

        return { cities, categories };
    } catch {
        // Fallback if IngestionListing doesn't exist yet
        const [placeCities, placeCats] = await Promise.all([
            prisma.place.findMany({ select: { city: true }, distinct: ['city'] }),
            prisma.place.findMany({ select: { type: true }, distinct: ['type'] }),
        ]);
        return {
            cities: Array.from(new Set(placeCities.map(c => c.city))).filter(Boolean).sort(),
            categories: Array.from(new Set(placeCats.map(c => c.type))).filter(Boolean).sort()
        };
    }
}

export async function bulkPublish(ids: string[]) {
    await verifyAdmin();
    if (ids.length === 0) return;
    try {
        await prisma.ingestionListing.updateMany({
            where: { id: { in: ids } },
            data: { status: IngestionStatus.PUBLISHED }
        });
    } catch {
        await prisma.place.updateMany({
            where: { id: { in: ids } },
            data: { status: 'APPROVED', isActive: true }
        });
    }
    revalidatePath('/admin/foundry');
}
