const { Client } = require('pg');
const fs = require('fs');

let dbUrl = "";
const content = fs.readFileSync('.env.production.local', 'utf8');
const match = content.match(/DATABASE_URL="?([^"\n]+)"?/);
if (match) dbUrl = match[1].trim();

async function checkUuid() {
    const client = new Client({
        connectionString: dbUrl.replace('?pgbouncer=true', ''),
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const res = await client.query(`
            SELECT id, "imageUrl" FROM "PlaceImage" WHERE id = '02981baa-6fa0-43b8-9fca-784bc0857bec'
        `);
        
        if (res.rows.length > 0) {
            console.log("UUID exists! Guide was partially/fully run.");
            console.log(`URL: ${res.rows[0].imageUrl}`);
        } else {
            console.log("UUID NOT found. Guide script NOT run yet.");
        }
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await client.end();
    }
}

checkUuid();
