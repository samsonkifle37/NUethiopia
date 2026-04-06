import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import * as fs from 'fs';
import * as path from 'path';

export async function POST(request: NextRequest) {
    try {
        const dataPath = path.join(process.cwd(), 'tmp', 'hotels_ingestion_data.json');
        if (!fs.existsSync(dataPath)) {
            return NextResponse.json({ error: "Data file missing" }, { status: 404 });
        }
        
        const hotels = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const results = [];

        console.log(`Starting ingestion of ${hotels.length} hotels via API...`);

        for (const h of hotels) {
            const slug = h.name.toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/--+/g, '-')
                .trim();

            // Calculate verification score
            let score = 0;
            if (h.contact.website) score += 30;
            if (h.reviews.reviewCount > 0) score += 20;
            if (h.coordinates.lat && h.coordinates.lng) score += 20;
            if (h.images.length >= 3) score += 30;

            const place = await prisma.place.upsert({
                where: { slug: slug },
                update: {
                    name: h.name,
                    type: 'hotel',
                    shortDescription: h.description,
                    longDescription: h.description,
                    city: h.city,
                    country: h.country,
                    latitude: h.coordinates.lat,
                    longitude: h.coordinates.lng,
                    websiteUrl: h.contact.website,
                    phone: h.contact.phone,
                    email: h.contact.email,
                    amenities: h.amenities,
                    highlights: h.highlights,
                    verificationScore: score,
                    verificationLevel: score,
                    reviewCount: h.reviews.reviewCount,
                    status: "APPROVED",
                    isActive: true
                },
                create: {
                    name: h.name,
                    slug: slug,
                    type: 'hotel',
                    shortDescription: h.description,
                    longDescription: h.description,
                    city: h.city,
                    country: h.country,
                    latitude: h.coordinates.lat,
                    longitude: h.coordinates.lng,
                    websiteUrl: h.contact.website,
                    phone: h.contact.phone,
                    email: h.contact.email,
                    amenities: h.amenities,
                    highlights: h.highlights,
                    verificationScore: score,
                    verificationLevel: score,
                    reviewCount: h.reviews.reviewCount,
                    status: "APPROVED",
                    isActive: true
                }
            });

            // Handle images
            await prisma.placeImage.deleteMany({
                where: { placeId: place.id }
            });

            for (let i = 0; i < h.images.length; i++) {
                const img = h.images[i];
                await prisma.placeImage.create({
                    data: {
                        placeId: place.id,
                        imageUrl: img.url,
                        imageSource: img.source,
                        imageTruthType: img.imageTruthType || "place_real",
                        priority: i,
                        status: "APPROVED"
                    }
                });
            }

            // Sync reviews
            const existingReviews = await prisma.review.count({ where: { placeId: place.id } });
            if (existingReviews === 0 && h.reviews.rating) {
                const systemUser = await prisma.user.findFirst({ where: { accountType: 'admin' } });
                if (systemUser) {
                    await prisma.review.create({
                        data: {
                            placeId: place.id,
                            userId: systemUser.id,
                            rating: Math.round(h.reviews.rating),
                            title: "Verified External Rating",
                            body: `Aggregated rating of ${h.reviews.rating} from ${h.reviews.source} based on ${h.reviews.reviewCount} reviews.`
                        }
                    });
                }
            }

            results.push({ name: h.name, status: "success", id: place.id });
        }

        return NextResponse.json({ success: true, processed: results.length });
    } catch (error: any) {
        console.error("API Ingestion Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
