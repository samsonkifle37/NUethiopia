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

// GET /api/user/collections - List all collections with favorite counts
export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const collections = await prisma.favoriteCollection.findMany({
      where: { userId },
      include: {
        favorites: {
          select: {
            id: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const response = collections.map((collection) => ({
      id: collection.id,
      name: collection.name,
      description: collection.description,
      emoji: collection.emoji,
      color: collection.color,
      isDefault: collection.isDefault,
      favoriteCount: collection.favorites.length,
      createdAt: collection.createdAt,
    }));

    return NextResponse.json({ collections: response }, { status: 200 });
  } catch (error) {
    console.error("Get collections error:", error);
    return NextResponse.json(
      { error: "Failed to fetch collections" },
      { status: 500 }
    );
  }
}

// POST /api/user/collections - Create new collection
export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, emoji, color } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Collection name is required" },
        { status: 400 }
      );
    }

    // Check if collection with same name exists for this user
    const existingCollection = await prisma.favoriteCollection.findUnique({
      where: {
        userId_name: {
          userId,
          name: name.trim(),
        },
      },
    });

    if (existingCollection) {
      return NextResponse.json(
        { error: "Collection with this name already exists" },
        { status: 409 }
      );
    }

    const collection = await prisma.favoriteCollection.create({
      data: {
        userId,
        name: name.trim(),
        description: description || null,
        emoji: emoji || null,
        color: color || null,
        isDefault: false,
      },
    });

    return NextResponse.json(
      {
        collection: {
          ...collection,
          favoriteCount: 0,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create collection error:", error);
    return NextResponse.json(
      { error: "Failed to create collection" },
      { status: 500 }
    );
  }
}
