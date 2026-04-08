const { Client } = require('pg');
require('dotenv').config();

async function main() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const res = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'Place'");
        console.log(res.rows.map(r => r.column_name).sort());
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

main();
