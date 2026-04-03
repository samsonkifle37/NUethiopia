const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const email = "nuethiopia2026@gmail.com";
  const databaseUrl = "postgresql://postgres.hrbxtdzpseitkegkeknt:addisview2026@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const res = await client.query(
      'SELECT id, email, "passwordHash", "accountType", roles FROM "User" WHERE email = $1',
      [email]
    );
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error("SQL Error:", err);
  } finally {
    await client.end();
  }
}

main();
