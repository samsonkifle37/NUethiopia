const { Client } = require('pg');
const fs = require('fs');

let dbUrl = "";
const content = fs.readFileSync('.env.production.local', 'utf8');
const match = content.match(/DATABASE_URL="?([^"\n]+)"?/);
if (match) dbUrl = match[1].trim();

async function checkTypes() {
    const client = new Client({
        connectionString: dbUrl.replace('?pgbouncer=true', ''),
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const res = await client.query(`
            SELECT DISTINCT type FROM "Place" WHERE city = 'Addis Ababa';
        `);
        console.log("Types:");
        res.rows.forEach(r => console.log(`- ${r.type}`));

        const res2 = await client.query(`
            SELECT name, type FROM "Place" WHERE city = 'Addis Ababa' LIMIT 50;
        `);
        console.log("\nExamples:");
        res2.rows.forEach(r => console.log(`- ${r.name} [${r.type}]`));
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await client.end();
    }
}

checkTypes();
