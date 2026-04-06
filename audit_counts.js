const { Client } = require('pg');
const fs = require('fs');

let dbUrl = "";
const content = fs.readFileSync('.env.production.local', 'utf8');
const match = content.match(/DATABASE_URL="?([^"\n]+)"?/);
if (match) dbUrl = match[1].trim();

async function checkImageCounts() {
    const client = new Client({
        connectionString: dbUrl.replace('?pgbouncer=true', ''),
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const res = await client.query(`
            SELECT 
                p.name, 
                COUNT(pi.id) as image_count
            FROM "Place" p
            LEFT JOIN "PlaceImage" pi ON p.id = pi."placeId"
            WHERE p.city = 'Addis Ababa' AND p.type ILIKE 'hotel'
            GROUP BY p.id, p.name
            ORDER BY image_count ASC;
        `);
        
        console.log(`Hotels and their image counts (showing first 50):`);
        res.rows.slice(0, 50).forEach(r => console.log(`${r.name}: ${r.image_count} images`));
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await client.end();
    }
}

checkImageCounts();
