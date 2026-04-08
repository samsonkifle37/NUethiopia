import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        console.log("🚀 Starting Server-Side Migration...");

        // Note: Prisma multi-statement support varies. We'll run them one by one.
        
        await prisma.$executeRawUnsafe(`
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

        await prisma.$executeRawUnsafe(`
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

        await prisma.$executeRawUnsafe(`
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

        await prisma.$executeRawUnsafe(`
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
        `);

        console.log("✅ Finalizing Sync...");
        
        // Add indexes
        await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "NotificationPreference_userId_key" ON "NotificationPreference"("userId");`);
        await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "ReportGeneral_userId_idx" ON "ReportGeneral"("userId");`);
        await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "ReportPlace_status_idx" ON "ReportPlace"("status");`);

        return NextResponse.json({ success: true, message: "Database schema synced successfully via server handler." });
    } catch (error: any) {
        console.error("Migration Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
