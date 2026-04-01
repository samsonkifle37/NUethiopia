import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

function getUserId(request: NextRequest): string | null {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

// GET /api/user/collections/[id] - Get single collection with all favorites
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const collection = await prisma.favoriteCollection.findFirst({
      where: {
        id: params.id,
        userId, // Ensure user owns this collection
      },
      include: {
        favorites: {
          include: {
            place: {
              include: {
                images: {
                  take: 1,
                  orderBy: { priority: "asc" },
                },
                _count: {
                  select: {
                    reviews: true,
                    favorites: true,
                  },
                },
              },
            },
          },
          orderBy: { addedAt: "desc" },
        },
      },
    });

    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        collection: {
          ...collection,
          favorites: collection.favorites.map((fav) => ({
            id: fav.id,
            place: {
              id: fav.place.id,
              name: fav.place.name,
              slug: fav.place.slug,
              type: fav.place.type,
              city: fav.place.city,
              shortDescription: fav.place.shortDescription,
              priceLevel: fav.place.priceLevel,
              image: fav.place.images[0]?.imageUrl || null,
              reviewCount: fav.place._count.reviews,
              favoriteCount: fav.place._count.favorites,
            },
            addedAt: fav.addedAt,
          })),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get collection error:", error);
    return NextResponse.json(
      { error: "Failed to fetch collection" },
      { status: 500 }
    );
  }
}

// PATCH /api/user/collections/[id] - Update collection metadata
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify collection belongs to user
    const existing = await prisma.favoriteCollection.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, description, emoji, color } = body;

    // If name is being changed, check for duplicates
    if (name && name !== existing.name) {
      const duplicate = await prisma.favoriteCollection.findUnique({
        where: {
          userId_name: {
            userId,
            name: name.trim(),
          },
        },
      });

      if (duplicate) {
        return NextResponse.json(
          { error: "Collection with this name already exists" },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.favoriteCollection.update({
      where: { id: params.id },
      data: {
        ...(name && { name: name.trim() }),
        ...(description !== undefined && { description: description || null }),
        ...(emoji !== undefined && { emoji: emoji || null }),
        ...(color !== undefined && { color: color || null }),
      },
    });

    return NextResponse.json({ collection: updated }, { status: 200 });
  } catch (error) {
    console.error("Update collection error:", error);
    return NextResponse.json(
      { error: "Failed to update collection" },
      { status: 500 }
    );
  }
}

// DELETE /api/user/collections/[id] - Delete collection
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify collection belongs to user
    const collection = await prisma.favoriteCollection.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    await prisma.favoriteCollection.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Delete collection error:", error);
    return NextResponse.json(
      { error: "Failed to delete collection" },
      { status: 500 }
    );
  }
}
