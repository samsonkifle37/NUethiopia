const { Client } = require('pg');
const fs = require('fs');

let dbUrl = "";
const content = fs.readFileSync('.env.production.local', 'utf8');
const match = content.match(/DATABASE_URL="?([^"\n]+)"?/);
if (match) dbUrl = match[1].trim();

async function countHotels() {
    const client = new Client({
        connectionString: dbUrl.replace('?pgbouncer=true', ''),
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const res = await client.query(`
            SELECT COUNT(*) FROM "Place" WHERE city = 'Addis Ababa' AND type ILIKE 'hotel';
        `);
        console.log(`Total hotels in Addis Ababa: ${res.rows[0].count}`);

        const res2 = await client.query(`
            SELECT name FROM "Place" WHERE city = 'Addis Ababa' AND type ILIKE 'hotel' ORDER BY name ASC;
        `);
        res2.rows.forEach(r => console.log(`- ${r.name}`));
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await client.end();
    }
}

countHotels();
