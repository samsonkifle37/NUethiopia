const { Client } = require('pg');
const fs = require('fs');

let dbUrl = "";
const content = fs.readFileSync('.env.production.local', 'utf8');
const match = content.match(/DATABASE_URL="?([^"\n]+)"?/);
if (match) dbUrl = match[1].trim();

async function findHotelsWithoutImages() {
    const client = new Client({
        connectionString: dbUrl.replace('?pgbouncer=true', ''),
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const res = await client.query(`
            SELECT 
                p.name, 
                p.type
            FROM "Place" p
            LEFT JOIN "PlaceImage" pi ON p.id = pi."placeId"
            WHERE p.city = 'Addis Ababa' AND p.type ILIKE 'hotel'
            GROUP BY p.id, p.name, p.type
            HAVING COUNT(pi.id) = 0
            ORDER BY p.name ASC;
        `);
        
        console.log(`\nHotels in Addis Ababa WITHOUT images (Case-Insensitive):`);
        if (res.rows.length === 0) {
            console.log("All hotels have images!");
        } else {
            console.log(`Total: ${res.rows.length} hotels needing images.`);
            res.rows.forEach(r => console.log(`- ${r.name}`));
        }
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await client.end();
    }
}

findHotelsWithoutImages();
