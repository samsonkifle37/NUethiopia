const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function main() {
  const email = "nuethiopia2026@gmail.com";
  const rawPassword = "NuEthiopia2026";
  const databaseUrl = "postgresql://postgres.hrbxtdzpseitkegkeknt:addisview2026@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

  console.log(`Updating password and admin status for ${email}...`);

  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const res = await client.query(
      'UPDATE "User" SET "accountType" = $1, roles = $2, "isEmailVerified" = $3, "passwordHash" = $4 WHERE email = $5',
      ['admin', ['traveller', 'admin'], true, hashedPassword, email]
    );
    console.log(`Success! Updated ${res.rowCount} row(s).`);
    
    if (res.rowCount === 0) {
      console.log("User not found. Attempting to create user...");
      const createRes = await client.query(
        'INSERT INTO "User" (id, email, "passwordHash", "accountType", roles, "isEmailVerified", "createdAt", "updatedAt", name) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW(), $7)',
        [require('crypto').randomUUID(), email, hashedPassword, 'admin', ['traveller', 'admin'], true, 'Nu Ethiopia Admin']
      );
      console.log(`Created new admin user with rowCount: ${createRes.rowCount}`);
    }
  } catch (err) {
    console.error("SQL Error:", err);
  } finally {
    await client.end();
  }
}

main();
