const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const databaseUrl = "postgresql://postgres.hrbxtdzpseitkegkeknt:addisview2026@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const res = await client.query(
      'SELECT "openingHours" FROM "Place" WHERE "openingHours" IS NOT NULL LIMIT 1'
    );
    console.log(JSON.stringify(res.rows[0]?.openingHours, null, 2));
  } catch (err) {
    console.error("SQL Error:", err);
  } finally {
    await client.end();
  }
}

main();
