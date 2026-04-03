const { Client } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
  await client.connect();
  console.log("Connected to Supabase via port 6543!");

  try {
    await client.query("BEGIN");

    console.log("Adding columns to User table...");
    await client.query(`
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phone" TEXT;
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isEmailVerified" BOOLEAN NOT NULL DEFAULT false;
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "accountType" TEXT NOT NULL DEFAULT 'user';
    `);

    console.log("Creating VerificationToken table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS "VerificationToken" (
        "id" TEXT NOT NULL,
        "token" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "expiresAt" TIMESTAMP(3) NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
      );
    `);
    
    try {
      await client.query(`CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");`);
    } catch(e) { console.warn("Index may already exist"); }

    console.log("Creating PasswordResetToken table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS "PasswordResetToken" (
        "id" TEXT NOT NULL,
        "token" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "expiresAt" TIMESTAMP(3) NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
      );
    `);
    try {
      await client.query(`CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");`);
    } catch(e) {}

    console.log("Creating BusinessProfile table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS "BusinessProfile" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "businessName" TEXT NOT NULL,
        "taxId" TEXT,
        "website" TEXT,
        "businessAddress" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "BusinessProfile_pkey" PRIMARY KEY ("id")
      );
    `);
    try {
      await client.query(`CREATE UNIQUE INDEX "BusinessProfile_userId_key" ON "BusinessProfile"("userId");`);
    } catch(e) {}

    console.log("Creating PaymentCustomer table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS "PaymentCustomer" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "stripeCustomerId" TEXT,
        "paypalCustomerId" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "PaymentCustomer_pkey" PRIMARY KEY ("id")
      );
    `);
    try {
      await client.query(`CREATE UNIQUE INDEX "PaymentCustomer_userId_key" ON "PaymentCustomer"("userId");`);
    } catch(e) {}

    console.log("Creating SubscriptionPlan table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS "SubscriptionPlan" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "priceMonthly" DOUBLE PRECISION NOT NULL,
        "currency" TEXT NOT NULL DEFAULT 'USD',
        "maxListings" INTEGER NOT NULL,
        "isFeatured" BOOLEAN NOT NULL DEFAULT false,
        "stripePriceId" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("id")
      );
    `);

    console.log("Creating Subscription table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS "Subscription" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "planId" TEXT NOT NULL,
        "status" TEXT NOT NULL,
        "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
        "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
        "stripeSubscriptionId" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
      );
    `);
    
    console.log("Creating PaymentTransaction table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS "PaymentTransaction" (
        "id" TEXT NOT NULL,
        "customerId" TEXT NOT NULL,
        "amount" DOUBLE PRECISION NOT NULL,
        "currency" TEXT NOT NULL,
        "status" TEXT NOT NULL,
        "stripePaymentId" TEXT,
        "description" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PaymentTransaction_pkey" PRIMARY KEY ("id")
      );
    `);

    console.log("Creating AdminActionLog table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS "AdminActionLog" (
        "id" TEXT NOT NULL,
        "adminId" TEXT NOT NULL,
        "action" TEXT NOT NULL,
        "targetId" TEXT NOT NULL,
        "details" JSONB,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "AdminActionLog_pkey" PRIMARY KEY ("id")
      );
    `);

    console.log("Creating NotificationLog table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS "NotificationLog" (
        "id" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "userId" TEXT,
        "isRead" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id")
      );
    `);

    console.log("Creating EmailLog table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS "EmailLog" (
        "id" TEXT NOT NULL,
        "to" TEXT NOT NULL,
        "subject" TEXT NOT NULL,
        "body" TEXT,
        "status" TEXT NOT NULL,
        "errorMessage" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
      );
    `);

    console.log("Creating StayListing table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS "StayListing" (
        "id" TEXT NOT NULL,
        "ownerId" TEXT NOT NULL,
        "propertyName" TEXT NOT NULL,
        "listingType" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "fullAddress" TEXT NOT NULL,
        "city" TEXT NOT NULL,
        "region" TEXT,
        "latitude" DOUBLE PRECISION,
        "longitude" DOUBLE PRECISION,
        "contactPhone" TEXT,
        "contactEmail" TEXT,
        "website" TEXT,
        "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
        "numberOfRooms" INTEGER,
        "priceRange" TEXT,
        "currency" TEXT NOT NULL DEFAULT 'ETB',
        "checkInTime" TEXT,
        "checkOutTime" TEXT,
        "houseRules" TEXT,
        "nearbyLandmarks" TEXT,
        "socialLinks" JSONB,
        "coverImage" TEXT,
        "status" TEXT NOT NULL DEFAULT 'DRAFT',
        "rejectionReason" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "StayListing_pkey" PRIMARY KEY ("id")
      );
    `);

    console.log("Creating StayListingImage table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS "StayListingImage" (
        "id" TEXT NOT NULL,
        "stayListingId" TEXT NOT NULL,
        "imageUrl" TEXT NOT NULL,
        "isCover" BOOLEAN NOT NULL DEFAULT false,
        "priority" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "StayListingImage_pkey" PRIMARY KEY ("id")
      );
    `);

    console.log("Creating ListingSubmissionHistory table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS "ListingSubmissionHistory" (
        "id" TEXT NOT NULL,
        "stayListingId" TEXT NOT NULL,
        "action" TEXT NOT NULL,
        "notes" TEXT,
        "adminId" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "ListingSubmissionHistory_pkey" PRIMARY KEY ("id")
      );
    `);

    await client.query("COMMIT");
    console.log("SUCCESS! All tables migrated.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Migration failed", err);
  } finally {
    client.end();
  }
}

runMigration();
