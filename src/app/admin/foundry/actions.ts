'use server';

import { prisma } from '@/lib/prisma';
import { IngestionStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getIngestionListings(filters: { status?: IngestionStatus | 'ALL', city?: string, category?: string } = {}) {
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

        return listings.map((l: any) => ({
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
            createdAt: l.createdAt,
        }));
    } catch {
        // Fallback: If IngestionListing table doesn't exist yet, use Place
        const places = await prisma.place.findMany({
            where: filters.city ? { city: filters.city } : filters.category ? { type: filters.category } : {},
            orderBy: { createdAt: 'desc' },
            take: 200,
            select: {
                id: true, name: true, type: true, city: true, district: true,
                status: true, shortDescription: true, tags: true, slug: true,
                verificationScore: true, source: true, createdAt: true,
            }
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
            createdAt: l.createdAt,
        }));
    }
}

export async function approveListing(id: string) {
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

export async function bulkPublish(ids: string[]) {
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
