const { Client } = require('pg');
const fs = require('fs');

let dbUrl = "";
const content = fs.readFileSync('.env.production.local', 'utf8');
const match = content.match(/DATABASE_URL="?([^"\n]+)"?/);
if (match) dbUrl = match[1].trim();

async function checkSpecificImages() {
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
            WHERE p.name ILIKE '%Aaran Hotel%' OR p.name ILIKE '%Abem Hotel%'
            GROUP BY p.id, p.name;
        `);
        
        if (res.rows.length === 0) {
            console.log("No hotels found matching criteria.");
        } else {
            res.rows.forEach(r => console.log(`${r.name}: ${r.image_count} images`));
        }
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await client.end();
    }
}

checkSpecificImages();
