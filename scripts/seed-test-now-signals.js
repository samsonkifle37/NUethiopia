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
        console.log("Seeding live events for TEST...");
        
        await client.query(`UPDATE "Place" SET "hasLiveEvent" = true, "eventStartTime" = NOW(), "eventEndTime" = NOW() + interval '4 hours', "availabilityStatus" = 'last_seats' WHERE "slug" = 'yummy-pizza'`);
        
        // Correct SQL: using ctid for LIMIT 1 equivalent or just picking one
        await client.query(`UPDATE "Place" SET "availabilityStatus" = 'filling_up' WHERE "id" IN (SELECT "id" FROM "Place" WHERE "type" = 'restaurant' AND "slug" != 'yummy-pizza' LIMIT 1)`);
        
        console.log("Seeded TEST signals successfully.");
    } catch (err) {
        console.error("SQL Error:", err);
    } finally {
        await client.end();
    }
}

main();
