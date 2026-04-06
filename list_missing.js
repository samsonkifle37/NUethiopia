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

async function findAllWithoutImages() {
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
            WHERE p.city = 'Addis Ababa'
            GROUP BY p.id, p.name, p.type
            HAVING COUNT(pi.id) = 0
            ORDER BY p.name ASC;
        `);
        
        console.log(`Total missing: ${res.rows.length}`);
        res.rows.forEach(r => console.log(`- ${r.name} (${r.type})`));
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await client.end();
    }
}

findAllWithoutImages();
