const { Client } = require('pg');
const fs = require('fs');

async function debugInsert() {
    const envContent = fs.readFileSync('.env.production.local', 'utf8');
    const dbUrl = envContent.match(/DATABASE_URL="?([^"\n]+)"?/)[1].trim().replace('?pgbouncer=true', '');

    const client = new Client({
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        
        console.log("Checking Tolip Olympia Hotel...");
        const res = await client.query(`SELECT id, name, city FROM "Place" WHERE name ILIKE '%Tolip Olympia Hotel%'`);
        console.log("Rows found:", res.rows);
        
        if (res.rows.length === 0) {
            console.log("No hotel found with that exact name. Trying partial search...");
            const res2 = await client.query(`SELECT id, name, city FROM "Place" WHERE name ILIKE '%Tolip Olympia%'`);
            console.log("Partial search results:", res2.rows);
        }

    } finally {
        await client.end();
    }
}

debugInsert();
