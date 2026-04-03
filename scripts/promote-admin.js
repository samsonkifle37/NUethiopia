const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const email = "nuethiopia2026@gmail.com";
  console.log(`Promoting ${email} to admin via raw SQL...`);

  try {
    const result = await prisma.$executeRawUnsafe(
      `UPDATE "User" SET "accountType" = 'admin', roles = ARRAY['traveller', 'admin'], "isEmailVerified" = true WHERE email = $1`,
      email
    );
    console.log(`Success! Updated ${result} row(s).`);
  } catch (error) {
    console.error("Critical failure during raw SQL execution:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
