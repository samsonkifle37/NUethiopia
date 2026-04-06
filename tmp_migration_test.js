const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

async function main() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log("Connected.");
        
        await client.query("BEGIN;");
        
        console.log("Running migration part 1...");
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
        
        console.log("Running migration part 2...");
        // Add other tables from run-pg-migration.js if needed
        
        await client.query("COMMIT;");
        console.log("Migration SUCCESS.");
    } catch (e) {
        await client.query("ROLLBACK;");
        console.error("Migration FAILED:", e.message);
        console.error(e);
    } finally {
        await client.end();
    }
}

main();
