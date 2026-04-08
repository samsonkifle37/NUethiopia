const { prisma } = require('../src/lib/prisma');

async function main() {
    try {
        const counts = await prisma.place.groupBy({
            by: ['type'],
            _count: { id: true }
        });
        console.log("Place Counts by Type:");
        console.log(JSON.stringify(counts, null, 2));

        const addisHotels = await prisma.place.count({
            where: {
                city: { contains: 'Addis', mode: 'insensitive' },
                type: 'hotel'
            }
        });
        console.log(`Hotels in Addis Ababa: ${addisHotels}`);

        const addisTours = await prisma.place.count({
            where: {
                city: { contains: 'Addis', mode: 'insensitive' },
                type: 'tour'
            }
        });
        console.log(`Tour Operators in Addis Ababa: ${addisTours}`);
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
