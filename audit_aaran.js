const { Client } = require('pg');
const fs = require('fs');

let dbUrl = "";
const content = fs.readFileSync('.env.production.local', 'utf8');
const match = content.match(/DATABASE_URL="?([^"\n]+)"?/);
if (match) dbUrl = match[1].trim();

async function checkAaranImages() {
    const client = new Client({
        connectionString: dbUrl.replace('?pgbouncer=true', ''),
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const res = await client.query(`
            SELECT 
                p.name, 
                pi."imageUrl",
                pi."imageSource",
                pi.status,
                pi."imageTruthType",
                pi."qualityScore"
            FROM "Place" p
            JOIN "PlaceImage" pi ON p.id = pi."placeId"
            WHERE p.name ILIKE '%Aaran Hotel%'
        `);
        
        res.rows.forEach(r => console.log(`${r.name}: ${r.imageUrl} [${r.imageSource}] status=${r.status} type=${r.imageTruthType} score=${r.qualityScore}`));
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await client.end();
    }
}

checkAaranImages();
