const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("No DATABASE_URL found");
    process.exit(1);
  }

  // Handle PgBouncer param for pg-client
  const cleanUrl = dbUrl.replace('?pgbouncer=true', '');
  
  console.log("Syncing database schema manually via SQL...");
  const client = new Client({
    connectionString: cleanUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    // Create SupportRequest table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "SupportRequest" (
        "id" TEXT NOT NULL,
        "userId" TEXT,
        "email" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'OPEN',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "SupportRequest_pkey" PRIMARY KEY ("id")
      );
    `);

    // Create ReportGeneral table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "ReportGeneral" (
        "id" TEXT NOT NULL,
        "userId" TEXT,
        "issueType" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "screenshotUrl" TEXT,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "ReportGeneral_pkey" PRIMARY KEY ("id")
      );
    `);

    // Create ReportPlace table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "ReportPlace" (
        "id" TEXT NOT NULL,
        "placeId" TEXT NOT NULL,
        "userId" TEXT,
        "issueType" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "screenshotUrl" TEXT,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "ReportPlace_pkey" PRIMARY KEY ("id")
      );
    `);

    // Create NotificationPreference table (if missing)
    await client.query(`
      CREATE TABLE IF NOT EXISTS "NotificationPreference" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "email" BOOLEAN NOT NULL DEFAULT true,
        "push" BOOLEAN NOT NULL DEFAULT true,
        "sms" BOOLEAN NOT NULL DEFAULT false,
        "promos" BOOLEAN NOT NULL DEFAULT true,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
      );
      CREATE UNIQUE INDEX IF NOT EXISTS "NotificationPreference_userId_key" ON "NotificationPreference"("userId");
    `);

    console.log("✅ Schema synced successfully. Missing tables have been created.");
  } catch (err) {
    console.error("❌ SQL Error:", err);
  } finally {
    await client.end();
  }
}

main();
