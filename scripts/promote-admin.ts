import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "nuethiopia2026@gmail.com";
  console.log(`Promoting ${email} to admin...`);

  await (prisma as any).$executeRawUnsafe(
    `UPDATE "User" SET "accountType" = 'admin', roles = ARRAY['traveller', 'admin'], "isEmailVerified" = true WHERE email = $1`,
    email
  );
  console.log("Success! Raw SQL promotion completed.");
    await prisma.$disconnect();
}

main();
