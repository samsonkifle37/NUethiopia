const { Client } = require('pg');
require('dotenv').config();

async function main() {
    const databaseUrl = "postgresql://postgres.hrbxtdzpseitkegkeknt:addisview2026@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

    const client = new Client({
        connectionString: databaseUrl,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        
        // 1. Add slug column if missing
        await client.query('ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "slug" TEXT UNIQUE');
        
        // 2. Clear existing events for fresh seed
        await client.query('DELETE FROM "Event"');
        
        const now = new Date();
        const tonight = new Date(); tonight.setHours(21, 0, 0);
        const tomorrow = new Date(); tomorrow.setDate(now.getDate() + 1); tomorrow.setHours(19, 0, 0);
        const saturday = new Date(); saturday.setDate(now.getDate() + (6 - now.getDay())); saturday.setHours(14, 30, 0);

        // Featured Event 1
        await client.query(`
            INSERT INTO "Event" (slug, title, description, "startTime", category, "isFeatured", source)
            VALUES ('ethio-jazz-night', 'Ethio-Jazz Night', 'Experience the legendary sound of Mulatu Astatke at African Jazz Village.', $1, 'music', true, 'African Jazz Village')
        `, [tonight]);

        // Event 2
        await client.query(`
            INSERT INTO "Event" (slug, title, description, "startTime", category, source)
            VALUES ('entoto-hike', 'Entoto Mountain Hike', 'Join the weekend hiking club for a bird-eye view of Addis.', $1, 'outdoor', 'Addis Hiking Club')
        `, [saturday]);

        // Event 3
        await client.query(`
            INSERT INTO "Event" (slug, title, description, "startTime", category, source)
            VALUES ('shiro-tasting', 'Tegabino Shiro Tasting', 'A culinary journey through Ethiopia s favorite comfort food.', $1, 'food', 'Foodie Addis')
        `, [tomorrow]);

        console.log("Event setup and seed with slugs complete.");
    } catch (err) {
        console.error("SQL Error:", err);
    } finally {
        await client.end();
    }
}

main();
