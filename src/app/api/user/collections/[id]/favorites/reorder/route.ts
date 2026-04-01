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

// PATCH /api/user/collections/[id]/favorites/reorder - Reorder favorites in collection
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
    const { favoriteIds } = body;

    if (!Array.isArray(favoriteIds) || favoriteIds.length === 0) {
      return NextResponse.json(
        { error: "favoriteIds array is required and must not be empty" },
        { status: 400 }
      );
    }

    // Update the orderIndex for each favorite
    const updates = favoriteIds.map((favoriteId, index) =>
      prisma.favoriteInCollection.updateMany({
        where: {
          collectionId: params.id,
          favoriteId,
        },
        data: {
          orderIndex: index,
        },
      })
    );

    await Promise.all(updates);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Reorder favorites error:", error);
    return NextResponse.json(
      { error: "Failed to reorder favorites" },
      { status: 500 }
    );
  }
}
