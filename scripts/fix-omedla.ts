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
  
  if (place.images.length >= 4) {
    // Current first image to delete
    const firstImage = place.images[0];
    // Current fourth image to make first
    const fourthImage = place.images[3];
    
    console.log("Deleting first image:", firstImage.imageUrl);
    await prisma.placeImage.delete({ where: { id: firstImage.id } });
    
    console.log("Updating priority for fourth image to be first:", fourthImage.imageUrl);
    await prisma.placeImage.update({
      where: { id: fourthImage.id },
      data: { priority: 0 } // Assuming priority 0 is first, or we can use a lower number if 0 is already taken by something else, but since we deleted the existing 0, 0 should be fine.
    });
    
    console.log("Fix completed.");
  } else {
    console.log(`Not enough images. Found ${place.images.length}.`);
    for (const img of place.images) {
      console.log(`Img: ${img.imageUrl} (Priority ${img.priority})`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
