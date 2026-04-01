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

// GET /api/user/itineraries/[id]/days/[dayId] - Get single day with activities
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; dayId: string } }
) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const itineraryId = params.id;
    const dayId = params.dayId;

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

    const day = await prisma.itineraryDay.findFirst({
      where: {
        id: dayId,
        itineraryId,
      },
      include: {
        activities: {
          orderBy: {
            timeSlot: "asc",
          },
        },
      },
    });

    if (!day) {
      return NextResponse.json({ error: "Day not found" }, { status: 404 });
    }

    return NextResponse.json({ day }, { status: 200 });
  } catch (error) {
    console.error("Get day error:", error);
    return NextResponse.json(
      { error: "Failed to fetch day" },
      { status: 500 }
    );
  }
}

// PATCH /api/user/itineraries/[id]/days/[dayId] - Update day
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; dayId: string } }
) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const itineraryId = params.id;
    const dayId = params.dayId;
    const body = await request.json();
    const { title, description, dayNumber } = body;

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

    // Verify day exists in this itinerary
    const existingDay = await prisma.itineraryDay.findFirst({
      where: {
        id: dayId,
        itineraryId,
      },
    });

    if (!existingDay) {
      return NextResponse.json({ error: "Day not found" }, { status: 404 });
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
      updateData.title = title || `Day ${existingDay.dayNumber}`;
    }

    if (description !== undefined) {
      updateData.description = description || null;
    }

    if (dayNumber !== undefined) {
      if (dayNumber < 1 || dayNumber > itinerary.durationDays) {
        return NextResponse.json(
          { error: `Day number must be between 1 and ${itinerary.durationDays}` },
          { status: 400 }
        );
      }

      // Check if another day with this number exists
      const conflictingDay = await prisma.itineraryDay.findFirst({
        where: {
          itineraryId,
          dayNumber,
          NOT: { id: dayId },
        },
      });

      if (conflictingDay) {
        return NextResponse.json(
          { error: "Another day with this number already exists" },
          { status: 409 }
        );
      }

      updateData.dayNumber = dayNumber;
    }

    const updatedDay = await prisma.itineraryDay.update({
      where: { id: dayId },
      data: updateData,
      include: {
        activities: {
          orderBy: {
            timeSlot: "asc",
          },
        },
      },
    });

    return NextResponse.json({ day: updatedDay }, { status: 200 });
  } catch (error) {
    console.error("Update day error:", error);
    return NextResponse.json(
      { error: "Failed to update day" },
      { status: 500 }
    );
  }
}

// DELETE /api/user/itineraries/[id]/days/[dayId] - Delete day with cascade
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; dayId: string } }
) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const itineraryId = params.id;
    const dayId = params.dayId;

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

    // Verify day exists in this itinerary
    const existingDay = await prisma.itineraryDay.findFirst({
      where: {
        id: dayId,
        itineraryId,
      },
    });

    if (!existingDay) {
      return NextResponse.json({ error: "Day not found" }, { status: 404 });
    }

    // Delete day (cascade will delete activities)
    await prisma.itineraryDay.delete({
      where: { id: dayId },
    });

    return NextResponse.json(
      { message: "Day deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete day error:", error);
    return NextResponse.json(
      { error: "Failed to delete day" },
      { status: 500 }
    );
  }
}
