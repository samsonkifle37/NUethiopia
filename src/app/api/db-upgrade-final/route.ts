import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from 'fs';
import path from 'path';

export async function POST() {
    try {
        const planPath = path.join(process.cwd(), 'scripts', 'upgrade_plan.json');
        if (!fs.existsSync(planPath)) {
            return NextResponse.json({ error: "Upgrade plan not found" }, { status: 404 });
        }

        const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'));
        const results = {
            updated: 0,
            created: 0,
            merged: 0,
            imagesLinked: 0,
            errors: [] as string[]
        };

        // 1. Process Merges (Deduplication)
        for (const merge of plan.merges) {
            try {
                // Find duplicate and master
                const duplicate = await prisma.place.findUnique({ where: { id: merge.duplicateId }, include: { images: true } });
                const master = await prisma.place.findUnique({ where: { id: merge.masterId } });

                if (duplicate && master) {
                    // Move images to master
                    for (const img of duplicate.images) {
                        await prisma.placeImage.update({
                            where: { id: img.id },
                            data: { placeId: master.id }
                        });
                    }
                    // Mark duplicate as inactive/merged instead of deleting (safe approach)
                    await prisma.place.update({
                        where: { id: duplicate.id },
                        data: { 
                            isActive: false, 
                            status: 'ARCHIVED',
                            shortDescription: `[MERGED into ${master.id}] ${duplicate.shortDescription || ''}`
                        }
                    });
                    results.merged++;
                }
            } catch (e: any) {
                results.errors.push(`Merge Error (${merge.duplicateId}): ${e.message}`);
            }
        }

        // 2. Process Updates
        for (const update of plan.updates) {
            try {
                await prisma.place.update({
                    where: { id: update.id },
                    data: {
                        name: update.name,
                        phone: update.phone,
                        email: update.email,
                        websiteUrl: update.websiteUrl,
                        subcategory: update.subcategory,
                        shortDescription: update.description,
                        status: 'APPROVED',
                        verificationLevel: 100 // Upgraded via directory
                    }
                });
                results.updated++;
            } catch (e: any) {
                results.errors.push(`Update Error (${update.id}): ${e.message}`);
            }
        }

        // 3. Process Creates
        for (const create of plan.creates) {
            try {
                const slug = create.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.random().toString(36).substring(2, 5);
                const newPlace = await prisma.place.create({
                    data: {
                        name: create.name,
                        slug: slug,
                        type: create.type,
                        city: 'Addis Ababa',
                        phone: create.phones[0],
                        email: create.emails[0],
                        websiteUrl: create.websites[0],
                        subcategory: create.subcategory,
                        shortDescription: create.description || `Luxury ${create.type} in Addis Ababa`,
                        status: 'APPROVED',
                        verificationLevel: 100,
                        isActive: true,
                        source: 'directory-import'
                    }
                });
                results.created++;
                
                // Add to plan's items for image linking
                create.id = newPlace.id;
            } catch (e: any) {
                results.errors.push(`Create Error (${create.name}): ${e.message}`);
            }
        }

        // 4. Link Images
        for (const img of plan.images) {
            try {
                // Find the entity by name (since we updated/created records with these names)
                const entity = await prisma.place.findFirst({
                    where: { 
                        name: img.entityName,
                        city: 'Addis Ababa'
                    }
                });

                if (entity) {
                    // Check if image already exists
                    const existing = await prisma.placeImage.findFirst({
                        where: { placeId: entity.id, imageUrl: img.fileName }
                    });

                    if (!existing) {
                        await prisma.placeImage.create({
                            data: {
                                placeId: entity.id,
                                imageUrl: img.fileName,
                                priority: img.priority,
                                status: 'APPROVED',
                                imageTruthType: img.isHero ? 'place_real' : 'representative'
                            }
                        });
                        results.imagesLinked++;
                    }
                }
            } catch (e: any) {
                results.errors.push(`Image Link Error (${img.fileName}): ${e.message}`);
            }
        }

        return NextResponse.json({ success: true, results });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
