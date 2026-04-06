const { Client } = require('pg');
const fs = require('fs');

async function cleanup() {
    const envContent = fs.readFileSync('.env.production.local', 'utf8');
    const dbUrl = envContent.match(/DATABASE_URL="?([^"\n]+)"?/)[1].trim().replace('?pgbouncer=true', '');

    const client = new Client({
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        
        console.log("Identifying hotels with Unsplash images...");
        const res = await client.query(`
            SELECT DISTINCT "placeId" FROM "PlaceImage" WHERE "imageSource" = 'unsplash';
        `);
        
        const placeIds = res.rows.map(r => r.placeId);
        
        if (placeIds.length > 0) {
            console.log(`Found ${placeIds.length} hotels with Unsplash images. Removing non-Unsplash images...`);
            const delRes = await client.query(`
                DELETE FROM "PlaceImage"
                WHERE "placeId" = ANY($1) AND "imageSource" != 'unsplash';
            `, [placeIds]);
            console.log(`✓ Deleted ${delRes.rowCount} old images.`);
        } else {
            console.log("No Unsplash images found in database.");
        }

    } finally {
        await client.end();
    }
}

cleanup();
