const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const email = "samsonkifle31@googlemail.com";
  const databaseUrl = "postgresql://postgres.hrbxtdzpseitkegkeknt:addisview2026@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

  console.log(`Manually verifying ${email} via pg...`);

  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const res = await client.query(
      'UPDATE "User" SET "isEmailVerified" = true WHERE email = $1',
      [email]
    );
    console.log(`Success! Verified ${res.rowCount} user(s).`);
  } catch (err) {
    console.error("SQL Error:", err);
  } finally {
    await client.end();
  }
}

main();
