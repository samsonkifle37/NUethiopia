const { Client } = require('pg');
const fs = require('fs');

let dbUrl = "";
const content = fs.readFileSync('.env.production.local', 'utf8');
const match = content.match(/DATABASE_URL="?([^"\n]+)"?/);
if (match) dbUrl = match[1].trim();

async function checkTolip() {
    const client = new Client({
        connectionString: dbUrl.replace('?pgbouncer=true', ''),
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const res = await client.query(`
            SELECT 
                p.name, 
                pi.status,
                pi."imageUrl"
            FROM "Place" p
            JOIN "PlaceImage" pi ON p.id = pi."placeId"
            WHERE p.name ILIKE '%Tolip Olympia%'
        `);
        
        res.rows.forEach(r => console.log(`${r.name}: status=${r.status} url=${r.imageUrl}`));
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await client.end();
    }
}

checkTolip();
