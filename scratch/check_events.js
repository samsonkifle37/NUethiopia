const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const events = await prisma.event.findMany();
  console.log('Total Events:', events.length);
  if (events.length > 0) {
    console.log('Sample Event:', events[0]);
  } else {
    // Seed a few events for April 2026 if empty
    await prisma.event.create({
      data: {
        title: "Addis Jazz Night",
        slug: "addis-jazz-night",
        description: "A night of soul and jazz at Fendika.",
        startTime: new Date("2026-04-15T19:00:00Z"),
        category: "music",
        isFeatured: true
      }
    });
    await prisma.event.create({
      data: {
        title: "Coffee Cupping Expo",
        slug: "coffee-cupping-expo",
        description: "Experience the art of Ethiopian coffee.",
        startTime: new Date("2026-04-20T10:00:00Z"),
        category: "culture",
        isFeatured: true
      }
    });
    console.log('Seeded 2 events for April 2026');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
