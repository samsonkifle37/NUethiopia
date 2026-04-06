const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

let dbUrl = "";
const envPaths = ['.env.production.local', '.env.local', '.env'];
for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const match = content.match(/DATABASE_URL="?([^"\n]+)"?/);
        if (match) {
            dbUrl = match[1].trim();
            break;
        }
    }
}

async function checkImages() {
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
            WHERE p.city = 'Addis Ababa'
            GROUP BY p.id, p.name
            HAVING COUNT(pi.id) > 0
            ORDER BY image_count DESC;
        `);
        
        fs.writeFileSync('hotel_images_count.json', JSON.stringify(res.rows, null, 2));
        console.log(`Saved report to hotel_images_count.json`);
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await client.end();
    }
}

checkImages();
