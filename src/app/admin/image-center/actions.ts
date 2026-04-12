"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "addis_fallback_secret";

async function verifyAdmin() {
    const token = (await cookies()).get("auth-token")?.value;
    if (!token) throw new Error("Unauthorized");
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        if (decoded.accountType !== "admin") {
            throw new Error("Forbidden: Admin access required");
        }
        return decoded;
    } catch {
        throw new Error("Unauthorized");
    }
}

export type ImageFilter = 'ALL' | 'PENDING' | 'FAILED' | 'APPROVED' | 'MIRRORED';

export async function getPipelineImages(filter: ImageFilter, offset: number = 0) {
    await verifyAdmin();

    const PAGE_SIZE = 50;

    // Fetch PlaceImages
    const placeImages = await prisma.placeImage.findMany({
        where: 
            filter === 'ALL' ? {} : 
            filter === 'MIRRORED' ? { isMirrored: true } : 
            { status: filter },
        include: { place: { select: { id: true, name: true, type: true } } },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: PAGE_SIZE
    });

    // Normalize
    const normalizedPlaceImages = placeImages.map(pi => ({
        ...pi,
        _isDiscovery: false
    }));

    // If we have enough from placeImages, we might not need discovery yet, 
    // but for simplicity in "ALL" we just return what we find.
    // However, user wants to see "ALL" 6000+.
    // A better way is to unify them at the DB level, but Prisma doesn't do UNION easily.
    
    return JSON.parse(JSON.stringify(normalizedPlaceImages));
}

export async function getPipelineStats() {
    await verifyAdmin();
    
    const [placeStats, discoveryStats] = await Promise.all([
        prisma.placeImage.groupBy({
            by: ['status'],
            _count: { id: true }
        }),
        prisma.discoveryPost.groupBy({
            by: ['status'],
            _count: { id: true }
        })
    ]);
    
    const mirroredCount = await prisma.placeImage.count({ where: { isMirrored: true } });
    const totalPlace = await prisma.placeImage.count();
    const totalDiscovery = await prisma.discoveryPost.count();

    const lastRun = await prisma.placeImage.findFirst({
        where: { verifiedAt: { not: null } },
        orderBy: { verifiedAt: 'desc' },
        select: { verifiedAt: true }
    });

    // Merge stats
    const statusMap: Record<string, number> = {};
    [...placeStats, ...discoveryStats].forEach(s => {
        statusMap[s.status] = (statusMap[s.status] || 0) + s._count.id;
    });

    const groups = Object.entries(statusMap).map(([status, count]) => ({
        status,
        _count: { id: count }
    }));
    
    return {
        groups,
        mirroredCount,
        totalCount: totalPlace + totalDiscovery,
        lastRunAt: lastRun?.verifiedAt ? lastRun.verifiedAt.toISOString() : null
    }
}

export async function updateImageState(id: string, action: 'APPROVE' | 'REJECT' | 'SET_PRIMARY' | 'RETRY', newUrl?: string) {
    await verifyAdmin();

    const isDiscovery = id.startsWith('DP-');
    const realId = isDiscovery ? id.replace('DP-', '') : id;

    if (isDiscovery) {
        if (action === 'REJECT') {
            await prisma.discoveryPost.update({
                where: { id: realId },
                data: { status: 'FAILED' }
            });
        }
        if (action === 'APPROVE') {
            await prisma.discoveryPost.update({
                where: { id: realId },
                data: { status: 'APPROVED' }
            });
        }
    } else {
        if (action === 'REJECT') {
            await prisma.placeImage.update({
                where: { id: realId },
                data: { status: 'FAILED', rejectionReason: 'Admin Manual Rejection' }
            });
        }

        if (action === 'APPROVE') {
            const img = await prisma.placeImage.findUnique({ where: { id: realId }});
            await prisma.placeImage.update({
                where: { id: realId },
                data: { status: 'APPROVED', qualityScore: Math.max(img?.qualityScore || 0, 80) }
            });
        }

        if (action === 'SET_PRIMARY') {
            const img = await prisma.placeImage.findUnique({ where: { id: realId }});
            if (img) {
                await prisma.placeImage.updateMany({
                    where: { placeId: img.placeId, priority: 0 },
                    data: { priority: 1 }
                });
                await prisma.placeImage.update({
                    where: { id: realId },
                    data: { priority: 0, status: 'APPROVED' }
                });
            }
        }

        if (newUrl) {
             await prisma.placeImage.update({
                 where: { id: realId },
                 data: { imageUrl: newUrl, status: 'PENDING', isMirrored: false } as any
             });
        }
    }

    revalidatePath('/admin/image-center');
}

export async function getPlaceImagesByPlaceId(placeId: string) {
    if (!placeId || placeId === 'NONE') return [];
    await verifyAdmin();
    const images = await prisma.placeImage.findMany({
        where: { placeId },
        orderBy: { priority: 'asc' }
    });
    return JSON.parse(JSON.stringify(images));
}

export async function uploadEntityImage(placeId: string, imageUrl: string) {
    await verifyAdmin();
    if (!placeId || placeId === 'NONE') return;
    
    await prisma.placeImage.create({
        data: {
            placeId,
            imageUrl,
            status: 'APPROVED',
            qualityScore: 90,
            imageTruthType: 'place_real'
        }
    });
    revalidatePath('/admin/image-center');
}

export async function deleteEntityImage(id: string) {
    await verifyAdmin();
    const isDiscovery = id.startsWith('DP-');
    const realId = isDiscovery ? id.replace('DP-', '') : id;

    if (isDiscovery) {
        await prisma.discoveryPost.delete({ where: { id: realId } });
    } else {
        await prisma.placeImage.delete({ where: { id: realId } });
    }
    revalidatePath('/admin/image-center');
}
