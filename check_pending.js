const { Client } = require('pg');
const fs = require('fs');

let dbUrl = "";
const content = fs.readFileSync('.env.production.local', 'utf8');
const match = content.match(/DATABASE_URL="?([^"\n]+)"?/);
if (match) dbUrl = match[1].trim();

async function checkPendingImages() {
    const client = new Client({
        connectionString: dbUrl.replace('?pgbouncer=true', ''),
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const res = await client.query(`
            SELECT 
                p.name, 
                COUNT(pi.id) as pending_count
            FROM "Place" p
            JOIN "PlaceImage" pi ON p.id = pi."placeId"
            WHERE pi.status = 'PENDING'
            GROUP BY p.id, p.name
            ORDER BY pending_count DESC;
        `);
        
        console.log("Hotels with PENDING images:");
        res.rows.forEach(r => console.log(`${r.name}: ${r.pending_count} pending images`));
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await client.end();
    }
}

checkPendingImages();
