import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import crypto from "crypto";

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

function generateShareToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// GET /api/user/itineraries/[id]/share - Get share link info
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const itineraryId = params.id;

    // Verify user owns this itinerary
    const itinerary = await prisma.itinerary.findFirst({
      where: {
        id: itineraryId,
        userId,
      },
    });

    if (!itinerary) {
      return NextResponse.json(
        { error: "Itinerary not found" },
        { status: 404 }
      );
    }

    const shareLink = await prisma.itineraryShare.findFirst({
      where: {
        itineraryId,
      },
    });

    if (!shareLink) {
      return NextResponse.json(
        { shareLink: null },
        { status: 200 }
      );
    }

    return NextResponse.json({ shareLink }, { status: 200 });
  } catch (error) {
    console.error("Get share link error:", error);
    return NextResponse.json(
      { error: "Failed to fetch share link" },
      { status: 500 }
    );
  }
}

// POST /api/user/itineraries/[id]/share - Create share link
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const itineraryId = params.id;
    const body = await request.json();
    const { isPublic, expiresAt } = body;

    // Verify user owns this itinerary
    const itinerary = await prisma.itinerary.findFirst({
      where: {
        id: itineraryId,
        userId,
      },
    });

    if (!itinerary) {
      return NextResponse.json(
        { error: "Itinerary not found" },
        { status: 404 }
      );
    }

    // Check if share link already exists
    const existingShare = await prisma.itineraryShare.findFirst({
      where: {
        itineraryId,
      },
    });

    if (existingShare) {
      return NextResponse.json(
        { error: "Share link already exists for this itinerary" },
        { status: 409 }
      );
    }

    const shareLink = await prisma.itineraryShare.create({
      data: {
        itineraryId,
        shareToken: generateShareToken(),
        isPublic: isPublic ?? true,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        viewCount: 0,
      },
    });

    return NextResponse.json({ shareLink }, { status: 201 });
  } catch (error) {
    console.error("Create share link error:", error);
    return NextResponse.json(
      { error: "Failed to create share link" },
      { status: 500 }
    );
  }
}

// DELETE /api/user/itineraries/[id]/share - Delete/revoke share link
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const itineraryId = params.id;

    // Verify user owns this itinerary
    const itinerary = await prisma.itinerary.findFirst({
      where: {
        id: itineraryId,
        userId,
      },
    });

    if (!itinerary) {
      return NextResponse.json(
        { error: "Itinerary not found" },
        { status: 404 }
      );
    }

    const shareLink = await prisma.itineraryShare.findFirst({
      where: {
        itineraryId,
      },
    });

    if (!shareLink) {
      return NextResponse.json(
        { error: "Share link not found" },
        { status: 404 }
      );
    }

    // Delete share link
    await prisma.itineraryShare.delete({
      where: { id: shareLink.id },
    });

    return NextResponse.json(
      { message: "Share link deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete share link error:", error);
    return NextResponse.json(
      { error: "Failed to delete share link" },
      { status: 500 }
    );
  }
}
