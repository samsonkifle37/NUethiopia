import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
    try {
        const results = { fixed: 0, errors: [] as string[] };

        const cases = [
            { 
                name: "Radisson Blu Hotel Addis Ababa", 
                newUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200", 
                priorityFix: true 
            },
            { 
                name: "Hyatt Regency Addis Ababa", 
                localUrl: "/uploads/places/hyattregencyaddisababa_0.jpg",
                priorityFix: true 
            },
            { 
                name: "Golden Tulip Addis Ababa", 
                localUrl: "/uploads/places/golden_tulip_hero.jpg",
                priorityFix: true 
            },
            { 
                name: "Monarch Parkview Hotel", 
                localUrl: "/uploads/places/monarch_hero.jpg",
                priorityFix: true 
            },
            { 
                name: "Swiss Inn Nexus Hotel", 
                localUrl: "/uploads/places/swiss_inn_hero.jpg",
                priorityFix: true 
            },
            { 
                name: "Best Western Plus Pearl Addis", 
                newUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
                priorityFix: true 
            },
            {
                name: "Elilly International Hotel",
                localUrl: "/uploads/places/elillyinternationalhotel_0.png",
                priorityFix: true
            }
        ];

        for (const c of cases) {
            try {
                const place = await prisma.place.findFirst({
                    where: { name: { contains: c.name.split(' ')[0], mode: 'insensitive' }, city: 'Addis Ababa' }
                });

                if (place) {
                    // 1. Reset all priorities to > 0
                    await prisma.placeImage.updateMany({
                        where: { placeId: place.id },
                        data: { priority: 10 }
                    });

                    // 2. Add or Update the hero image
                    const heroUrl = c.localUrl || c.newUrl;
                    if (heroUrl) {
                        const existing = await prisma.placeImage.findFirst({
                            where: { placeId: place.id, imageUrl: heroUrl }
                        });

                        if (existing) {
                            await prisma.placeImage.update({
                                where: { id: existing.id },
                                data: { priority: 0, status: 'APPROVED' }
                            });
                        } else {
                            await prisma.placeImage.create({
                                data: {
                                    placeId: place.id,
                                    imageUrl: heroUrl,
                                    priority: 0,
                                    status: 'APPROVED',
                                    imageTruthType: 'place_real'
                                }
                            });
                        }
                    }
                    results.fixed++;
                }
            } catch (e: any) {
                results.errors.push(`Error fixing ${c.name}: ${e.message}`);
            }
        }

        return NextResponse.json({ success: true, results });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
