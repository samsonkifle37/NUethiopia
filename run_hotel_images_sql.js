const { Client } = require('pg');
const fs = require('fs');

async function main() {
    const envContent = fs.readFileSync('.env.production.local', 'utf8');
    const dbUrl = envContent.match(/DATABASE_URL="?([^"\n]+)"?/)[1].trim().replace('?pgbouncer=true', '');

    const client = new Client({
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log("Connected to database...");

        const sql = fs.readFileSync('hotel-images-data/insert_hotel_images.sql', 'utf8');
        console.log("Executing SQL script (this may take a few seconds)...");
        await client.query(sql);

        console.log("SQL script executed successfully!");
    } catch (err) {
        console.error("Migration failed:", err.message);
    } finally {
        await client.end();
    }
}

main();
