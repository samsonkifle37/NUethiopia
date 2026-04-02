import 'dotenv/config';
import prisma from '../src/lib/prisma';

async function main() {
  const place = await prisma.place.findFirst({
    where: { name: { contains: 'Omedla' } },
    include: { images: { orderBy: { priority: 'asc' } } }
  })

  if (!place) {
    console.log("Could not find Omedla Hotel.")
    return
  }

  console.log(`Found ${place.name} with id ${place.id} and ${place.images.length} images.`)
  
  if (place.images.length > 0) {
    for (let i = 0; i < place.images.length; i++) {
       console.log(`Image ${i+1} [ID: ${place.images[i].id}]: ${place.images[i].imageUrl} (Priority: ${place.images[i].priority}, Status: ${place.images[i].status})`)
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
