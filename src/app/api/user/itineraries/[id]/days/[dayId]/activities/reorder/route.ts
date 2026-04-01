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

// PATCH /api/user/itineraries/[id]/days/[dayId]/activities/reorder - Reorder activities
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
    const { activityIds } = body;

    if (!Array.isArray(activityIds) || activityIds.length === 0) {
      return NextResponse.json(
        { error: "Activity IDs array is required" },
        { status: 400 }
      );
    }

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

    // Verify all activities exist and belong to this day
    const activities = await prisma.itineraryActivity.findMany({
      where: {
        itineraryDayId: dayId,
      },
    });

    const activityMap = new Map(activities.map((a) => [a.id, a]));

    for (const activityId of activityIds) {
      if (!activityMap.has(activityId)) {
        return NextResponse.json(
          { error: `Activity ${activityId} not found in this day` },
          { status: 404 }
        );
      }
    }

    // Update orderIndex for each activity
    const updates = activityIds.map((activityId, index) =>
      prisma.itineraryActivity.update({
        where: { id: activityId },
        data: { orderIndex: index + 1 },
        include: {
          place: true,
        },
      })
    );

    const reorderedActivities = await Promise.all(updates);

    return NextResponse.json({ activities: reorderedActivities }, { status: 200 });
  } catch (error) {
    console.error("Reorder activities error:", error);
    return NextResponse.json(
      { error: "Failed to reorder activities" },
      { status: 500 }
    );
  }
}
