const { Client } = require('pg');
const fs = require('fs');

async function main() {
    const envContent = fs.readFileSync('.env.production.local', 'utf8');
    const dbUrl = envContent.match(/DATABASE_URL="?([^"\n]+)"?/)[1].trim().replace('?pgbouncer=true', '');

    const client = new Client({
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const res = await client.query(`
            SELECT 
                pi.id,
                pi."imageUrl",
                pi.priority,
                pi.status,
                pi."imageSource"
            FROM "Place" p
            JOIN "PlaceImage" pi ON p.id = pi."placeId"
            WHERE p.name ILIKE '%Tolip Olympia%'
            ORDER BY pi.priority ASC
        `);
        
        console.log(`Tolip Olympia Images:`);
        res.rows.forEach(r => console.log(`Priority ${r.priority}: ${r.imageUrl} [${r.status}] (${r.imageSource})`));
    } finally {
        await client.end();
    }
}

main();
