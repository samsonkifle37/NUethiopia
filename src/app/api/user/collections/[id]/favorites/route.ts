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

// POST /api/user/collections/[id]/favorites - Add favorite to collection
export async function POST(
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

    const body = await request.json();
    const { placeId } = body;

    if (!placeId) {
      return NextResponse.json(
        { error: "placeId is required" },
        { status: 400 }
      );
    }

    // Verify place exists
    const place = await prisma.place.findUnique({
      where: { id: placeId },
    });

    if (!place) {
      return NextResponse.json({ error: "Place not found" }, { status: 400 });
    }

    // Get or create favorite for this user
    let favorite = await prisma.favorite.findUnique({
      where: {
        userId_placeId: {
          userId,
          placeId,
        },
      },
    });

    if (!favorite) {
      favorite = await prisma.favorite.create({
        data: {
          userId,
          placeId,
        },
      });
    }

    // Check if already in collection
    const existing = await prisma.favoriteInCollection.findUnique({
      where: {
        collectionId_favoriteId: {
          collectionId: params.id,
          favoriteId: favorite.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Place already in this collection" },
        { status: 409 }
      );
    }

    // Get the highest orderIndex
    const lastItem = await prisma.favoriteInCollection.findFirst({
      where: { collectionId: params.id },
      orderBy: { orderIndex: "desc" },
    });

    const newOrderIndex = (lastItem?.orderIndex || 0) + 1;

    // Add favorite to collection
    const favoriteInCollection = await prisma.favoriteInCollection.create({
      data: {
        collectionId: params.id,
        favoriteId: favorite.id,
        orderIndex: newOrderIndex,
      },
    });

    return NextResponse.json(
      { success: true, favoriteInCollection },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add favorite to collection error:", error);
    return NextResponse.json(
      { error: "Failed to add favorite to collection" },
      { status: 500 }
    );
  }
}

// DELETE /api/user/collections/[id]/favorites/[placeId] - Remove favorite from collection
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; placeId: string } }
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

    // Find favorite
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_placeId: {
          userId,
          placeId: params.placeId,
        },
      },
    });

    if (!favorite) {
      return NextResponse.json(
        { error: "Favorite not found" },
        { status: 404 }
      );
    }

    // Remove from collection
    await prisma.favoriteInCollection.deleteMany({
      where: {
        collectionId: params.id,
        favoriteId: favorite.id,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Remove favorite from collection error:", error);
    return NextResponse.json(
      { error: "Failed to remove favorite from collection" },
      { status: 500 }
    );
  }
}
