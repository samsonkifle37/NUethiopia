import prisma from "@/lib/prisma";

export async function getPlacesServer({
  types,
  search,
  neighborhood,
  limit = 18,
  offset = 0,
  city
}: {
  types?: string;
  search?: string;
  neighborhood?: string;
  limit?: number;
  offset?: number;
  city?: string;
}) {
  const where: any = { isActive: true, status: 'APPROVED' };

  if (types) {
    const typeList = types.split(",").map((t) => t.trim());
    if (typeList.includes("must-see")) {
      where.featured = true;
      const otherTypes = typeList.filter(t => t !== "must-see");
      if (otherTypes.length > 0) {
        where.type = { in: otherTypes };
      }
    } else {
      where.type = { in: typeList };
    }
  }

  if (city) {
    where.city = { contains: city, mode: "insensitive" };
  }

  if (neighborhood) {
    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : []),
      {
        OR: [
          { area: { contains: neighborhood, mode: "insensitive" } },
          { neighborhood: { contains: neighborhood, mode: "insensitive" } },
        ]
      }
    ];
  }

  if (search) {
    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : []),
      {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { shortDescription: { contains: search, mode: "insensitive" } },
          { city: { contains: search, mode: "insensitive" } },
          { area: { contains: search, mode: "insensitive" } },
          { tags: { hasSome: [search.toLowerCase()] } },
        ]
      }
    ];
  }

  const [places, total] = await Promise.all([
    prisma.place.findMany({
      where,
      include: {
        images: {
          orderBy: { priority: "asc" },
          take: 3,
        },
        _count: { select: { reviews: true, favorites: true } },
      },
      orderBy: [
        { ownerVerified: "desc" },
        { featured: "desc" },
        { verificationScore: "desc" },
        { createdAt: "desc" }
      ],
      take: limit,
      skip: offset,
    }),
    prisma.place.count({ where }),
  ]);

  const audits = await prisma.imageAudit.findMany({
    where: { entityId: { in: places.map((p) => p.id) } },
    select: { entityId: true, status: true }
  });
  const auditMap = new Map(audits.map((a: any) => [a.entityId, a.status]));

  const placesWithExtras = await Promise.all(
    places.map(async (place) => {
      const agg = await prisma.review.aggregate({
        where: { placeId: place.id },
        _avg: { rating: true },
      });
      return {
        ...place,
        avgRating: agg._avg.rating || null,
        auditStatus: auditMap.get(place.id) || null
      };
    })
  );

  return {
    places: JSON.parse(JSON.stringify(placesWithExtras)), // Ensure serialization
    total,
    limit,
    offset
  };
}
