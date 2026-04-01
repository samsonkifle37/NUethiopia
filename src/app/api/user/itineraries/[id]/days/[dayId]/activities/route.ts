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

// GET /api/user/itineraries/[id]/days/[dayId]/activities - List activities in day
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

    const activities = await prisma.itineraryActivity.findMany({
      where: {
        itineraryDayId: dayId,
      },
      include: {
        place: true,
      },
      orderBy: {
        timeSlot: "asc",
      },
    });

    return NextResponse.json({ activities }, { status: 200 });
  } catch (error) {
    console.error("Get activities error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}

// POST /api/user/itineraries/[id]/days/[dayId]/activities - Add activity to day
export async function POST(
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
    const { placeId, timeSlot, notes, orderIndex } = body;

    if (!placeId) {
      return NextResponse.json(
        { error: "Place ID is required" },
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

    // Verify place exists
    const place = await prisma.place.findUnique({
      where: { id: placeId },
    });

    if (!place) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    // Check if activity already exists for this place on this day
    const existingActivity = await prisma.itineraryActivity.findFirst({
      where: {
        itineraryDayId: dayId,
        placeId,
      },
    });

    if (existingActivity) {
      return NextResponse.json(
        { error: "This place is already added to this day" },
        { status: 409 }
      );
    }

    // Get highest orderIndex for this day
    const lastActivity = await prisma.itineraryActivity.findFirst({
      where: { itineraryDayId: dayId },
      orderBy: { orderIndex: "desc" },
    });

    const newOrderIndex = orderIndex ?? (lastActivity?.orderIndex ?? 0) + 1;

    const activity = await prisma.itineraryActivity.create({
      data: {
        itineraryDayId: dayId,
        placeId,
        timeSlot: timeSlot || null,
        notes: notes || null,
        orderIndex: newOrderIndex,
      },
      include: {
        place: true,
      },
    });

    return NextResponse.json({ activity }, { status: 201 });
  } catch (error) {
    console.error("Create activity error:", error);
    return NextResponse.json(
      { error: "Failed to add activity" },
      { status: 500 }
    );
  }
}
