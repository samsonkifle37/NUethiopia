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
        console.log("Connected. Adding columns...");
        
        await client.query('ALTER TABLE "Place" ADD COLUMN IF NOT EXISTS "hasLiveEvent" BOOLEAN DEFAULT FALSE');
        await client.query('ALTER TABLE "Place" ADD COLUMN IF NOT EXISTS "eventStartTime" TIMESTAMP');
        await client.query('ALTER TABLE "Place" ADD COLUMN IF NOT EXISTS "eventEndTime" TIMESTAMP');
        await client.query('ALTER TABLE "Place" ADD COLUMN IF NOT EXISTS "availabilityStatus" TEXT');
        
        console.log("Columns added successfully.");
    } catch (err) {
        console.error("SQL Error:", err);
    } finally {
        await client.end();
    }
}

main();
