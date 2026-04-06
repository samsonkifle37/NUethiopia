import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Travel Status...");
  const regions = [
    { region: "Addis Ababa", status: "GREEN", summary: "Safe and vibrant.", details: "All sectors in Addis are currently stable. Standard urban caution applies." },
    { region: "Amhara", status: "YELLOW", summary: "Caution in certain zones.", details: "Travelers to Lalibela and Gondar are advised to check local reports daily. Main tourist sites remain open." },
    { region: "Tigray", status: "YELLOW", summary: "Gradual reopening.", details: "Infrastructure is being restored. Peace remains stable but caution is advised in border areas." },
    { region: "Oromia", status: "YELLOW", summary: "Localized caution.", details: "Safe in major cities and main roads, but avoid unpaved rural routes in the weatern sectors." },
    { region: "Southern Regions", status: "GREEN", summary: "Stable for tourism.", details: "Omo Valley and Arba Minch areas are fully operational and safe for visitors." },
    { region: "Afar", status: "GREEN", summary: "Safe for expeditions.", details: "Danakil Depression tours are running normally with standard security escorts provided by operators." },
  ];

  for (const r of regions) {
    await prisma.travelStatus.upsert({
      where: { region: r.region },
      update: r,
      create: r,
    });
  }

  console.log("Seeding Species...");
  const species = [
    {
      name: "Gelada Baboon",
      scientificName: "Theropithecus gelada",
      type: "ANIMAL",
      description: "Often called the Bleeding-heart Monkey, these are unique grass-eating primates endemic to the Ethiopian Highlands.",
      habitat: "Simien Mountains National Park",
      culturalSignificance: "A symbol of the Ethiopian high altitude biodiversity.",
      funFact: "They have a distinctive red patch of skin on their chest that brightens during social interactions.",
      imageUrl: "https://hrbxtdzpseitkegkeknt.supabase.co/storage/v1/object/public/species/gelada.jpg",
      regionTags: ["Amhara", "Highlands"]
    },
    {
      name: "Ethiopian Wolf",
      scientificName: "Canis simensis",
      type: "ANIMAL",
      description: "The world's rarest canid, a slender predator specialized in hunting plateau rats.",
      habitat: "Bale Mountains and Simien Mountains",
      culturalSignificance: "The National animal of Ethiopia's endemic fauna.",
      funFact: "They live in social packs but hunt rodents alone.",
      imageUrl: "https://hrbxtdzpseitkegkeknt.supabase.co/storage/v1/object/public/species/wolf.jpg",
      regionTags: ["Oromia", "Bale"]
    },
    {
      name: "Enset (False Banana)",
      scientificName: "Ensete ventricosum",
      type: "PLANT",
      description: "A vital food security crop that looks like a banana tree but produces no fruit; the trunk is processed into food.",
      habitat: "Southern Highlands",
      culturalSignificance: "Known as the 'Tree against Hunger', it feeds 20 million people.",
      funFact: "A single Enset tree can provide food for one person for an entire year.",
      imageUrl: "https://hrbxtdzpseitkegkeknt.supabase.co/storage/v1/object/public/species/enset.jpg",
      regionTags: ["Southern", "Gurage"]
    }
  ];

  for (const s of species) {
    await prisma.species.upsert({
      where: { name: s.name },
      update: s,
      create: s,
    });
  }

  console.log("Seeding Complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
