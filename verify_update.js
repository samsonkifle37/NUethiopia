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
                p.name, 
                COUNT(pi.id) as total_count
            FROM "Place" p
            JOIN "PlaceImage" pi ON p.id = pi."placeId"
            WHERE p.name ILIKE '%Tolip Olympia%'
            GROUP BY p.name
        `);
        
        res.rows.forEach(r => console.log(`${r.name}: ${r.total_count} images`));
    } finally {
        await client.end();
    }
}

main();
