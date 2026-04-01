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

// GET /api/user/itineraries/[id]/days/[dayId]/activities/[activityId] - Get single activity
export async function GET(
  request: NextRequest,
  {
    params,
  }: { params: { id: string; dayId: string; activityId: string } }
) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const itineraryId = params.id;
    const dayId = params.dayId;
    const activityId = params.activityId;

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
    const day = await prisma.itineraryDay.findFirst({
      where: {
        id: dayId,
        itineraryId,
      },
    });

    if (!day) {
      return NextResponse.json({ error: "Day not found" }, { status: 404 });
    }

    const activity = await prisma.itineraryActivity.findFirst({
      where: {
        id: activityId,
        itineraryDayId: dayId,
      },
      include: {
        place: true,
      },
    });

    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ activity }, { status: 200 });
  } catch (error) {
    console.error("Get activity error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}

// PATCH /api/user/itineraries/[id]/days/[dayId]/activities/[activityId] - Update activity
export async function PATCH(
  request: NextRequest,
  {
    params,
  }: { params: { id: string; dayId: string; activityId: string } }
) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const itineraryId = params.id;
    const dayId = params.dayId;
    const activityId = params.activityId;
    const body = await request.json();
    const { timeSlot, notes } = body;

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
    const day = await prisma.itineraryDay.findFirst({
      where: {
        id: dayId,
        itineraryId,
      },
    });

    if (!day) {
      return NextResponse.json({ error: "Day not found" }, { status: 404 });
    }

    // Verify activity exists in this day
    const existingActivity = await prisma.itineraryActivity.findFirst({
      where: {
        id: activityId,
        itineraryDayId: dayId,
      },
    });

    if (!existingActivity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};

    if (timeSlot !== undefined) {
      updateData.timeSlot = timeSlot || null;
    }

    if (notes !== undefined) {
      updateData.notes = notes || null;
    }

    const updatedActivity = await prisma.itineraryActivity.update({
      where: { id: activityId },
      data: updateData,
      include: {
        place: true,
      },
    });

    return NextResponse.json({ activity: updatedActivity }, { status: 200 });
  } catch (error) {
    console.error("Update activity error:", error);
    return NextResponse.json(
      { error: "Failed to update activity" },
      { status: 500 }
    );
  }
}

// DELETE /api/user/itineraries/[id]/days/[dayId]/activities/[activityId] - Delete activity
export async function DELETE(
  request: NextRequest,
  {
    params,
  }: { params: { id: string; dayId: string; activityId: string } }
) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const itineraryId = params.id;
    const dayId = params.dayId;
    const activityId = params.activityId;

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
    const day = await prisma.itineraryDay.findFirst({
      where: {
        id: dayId,
        itineraryId,
      },
    });

    if (!day) {
      return NextResponse.json({ error: "Day not found" }, { status: 404 });
    }

    // Verify activity exists in this day
    const existingActivity = await prisma.itineraryActivity.findFirst({
      where: {
        id: activityId,
        itineraryDayId: dayId,
      },
    });

    if (!existingActivity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    // Delete activity
    await prisma.itineraryActivity.delete({
      where: { id: activityId },
    });

    return NextResponse.json(
      { message: "Activity deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete activity error:", error);
    return NextResponse.json(
      { error: "Failed to delete activity" },
      { status: 500 }
    );
  }
}
