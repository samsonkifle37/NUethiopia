const { Client } = require('pg');
require('dotenv').config({ path: '.env' });

const client = new Client({ connectionString: process.env.DATABASE_URL });

client.connect().then(async () => {
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS public."DiscoveryPost" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "imageUrl" TEXT NOT NULL,
        "placeId" TEXT,
        "locationName" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "likesCount" INTEGER NOT NULL DEFAULT 0,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "DiscoveryPost_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "DiscoveryPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "DiscoveryPost_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES public."Place"("id") ON DELETE SET NULL ON UPDATE CASCADE
      );
      CREATE INDEX IF NOT EXISTS "DiscoveryPost_userId_idx" ON public."DiscoveryPost"("userId");
      CREATE INDEX IF NOT EXISTS "DiscoveryPost_status_idx" ON public."DiscoveryPost"("status");
      CREATE INDEX IF NOT EXISTS "DiscoveryPost_category_idx" ON public."DiscoveryPost"("category");

      CREATE TABLE IF NOT EXISTS public."NotificationPreference" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "travel" BOOLEAN NOT NULL DEFAULT true,
        "news" BOOLEAN NOT NULL DEFAULT false,
        "bookings" BOOLEAN NOT NULL DEFAULT true,
        "promos" BOOLEAN NOT NULL DEFAULT false,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE UNIQUE INDEX IF NOT EXISTS "NotificationPreference_userId_key" ON public."NotificationPreference"("userId");
    `);
    console.log('Tables created successfully');
  } catch (err) {
    console.error('Error creating tables:', err);
  } finally {
    process.exit(0);
  }
}).catch(console.error);
