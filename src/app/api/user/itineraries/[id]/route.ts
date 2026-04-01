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

// GET /api/user/itineraries/[id] - Get single itinerary with all days and activities
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

    const itinerary = await prisma.itinerary.findFirst({
      where: {
        id: itineraryId,
        userId, // Ensure user owns this itinerary
      },
      include: {
        days: {
          include: {
            activities: true,
          },
          orderBy: {
            dayNumber: "asc",
          },
        },
        shareLink: true,
      },
    });

    if (!itinerary) {
      return NextResponse.json(
        { error: "Itinerary not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ itinerary }, { status: 200 });
  } catch (error) {
    console.error("Get itinerary error:", error);
    return NextResponse.json(
      { error: "Failed to fetch itinerary" },
      { status: 500 }
    );
  }
}

// PATCH /api/user/itineraries/[id] - Update itinerary metadata
export async function PATCH(
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
    const {
      title,
      description,
      city,
      durationDays,
      startDate,
      endDate,
      isPublished,
    } = body;

    // Verify user owns this itinerary
    const existingItinerary = await prisma.itinerary.findFirst({
      where: {
        id: itineraryId,
        userId,
      },
    });

    if (!existingItinerary) {
      return NextResponse.json(
        { error: "Itinerary not found" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};

    if (title !== undefined) {
      if (title && title.trim().length === 0) {
        return NextResponse.json(
          { error: "Title cannot be empty" },
          { status: 400 }
        );
      }
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      updateData.description = description || null;
    }

    if (city !== undefined) {
      if (city && city.trim().length === 0) {
        return NextResponse.json(
          { error: "City cannot be empty" },
          { status: 400 }
        );
      }
      updateData.city = city.trim();
    }

    if (durationDays !== undefined) {
      updateData.durationDays = Math.max(1, Math.min(durationDays, 14));
    }

    if (startDate !== undefined) {
      updateData.startDate = startDate ? new Date(startDate) : null;
    }

    if (endDate !== undefined) {
      updateData.endDate = endDate ? new Date(endDate) : null;
    }

    if (isPublished !== undefined) {
      updateData.isPublished = Boolean(isPublished);
    }

    const updatedItinerary = await prisma.itinerary.update({
      where: { id: itineraryId },
      data: updateData,
      include: {
        days: {
          include: {
            activities: true,
          },
          orderBy: {
            dayNumber: "asc",
          },
        },
        shareLink: true,
      },
    });

    return NextResponse.json({ itinerary: updatedItinerary }, { status: 200 });
  } catch (error) {
    console.error("Update itinerary error:", error);
    return NextResponse.json(
      { error: "Failed to update itinerary" },
      { status: 500 }
    );
  }
}

// DELETE /api/user/itineraries/[id] - Delete itinerary with cascade
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
    const existingItinerary = await prisma.itinerary.findFirst({
      where: {
        id: itineraryId,
        userId,
      },
    });

    if (!existingItinerary) {
      return NextResponse.json(
        { error: "Itinerary not found" },
        { status: 404 }
      );
    }

    // Delete itinerary (cascade will delete days and activities)
    const deletedItinerary = await prisma.itinerary.delete({
      where: { id: itineraryId },
    });

    return NextResponse.json(
      { message: "Itinerary deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete itinerary error:", error);
    return NextResponse.json(
      { error: "Failed to delete itinerary" },
      { status: 500 }
    );
  }
}
