const { Client } = require('pg');
const fs = require('fs');

async function main() {
    // Determine the connection string from process.env or fallback to direct URL
    // since some connection string formats are Prisma specific (pgbouncer parameter).
    const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
    
    console.log("Connecting to Database using pg...");
    const client = new Client({
        connectionString: dbUrl.replace('?pgbouncer=true', ''),
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        
        const sql = fs.readFileSync('apply-rls.sql', 'utf8');
        console.log("Executing SQL...");
        await client.query(sql);

        console.log("RLS applied successfully via pg client.");
    } catch (e) {
        console.error("Failed to execute SQL:");
        console.error(e);
    } finally {
        await client.end();
    }
}

main();
