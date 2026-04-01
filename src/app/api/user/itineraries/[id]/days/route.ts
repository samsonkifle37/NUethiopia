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

// GET /api/user/itineraries/[id]/days - List all days in itinerary
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

    const days = await prisma.itineraryDay.findMany({
      where: {
        itineraryId,
      },
      include: {
        activities: {
          orderBy: {
            timeSlot: "asc",
          },
        },
      },
      orderBy: {
        dayNumber: "asc",
      },
    });

    return NextResponse.json({ days }, { status: 200 });
  } catch (error) {
    console.error("Get days error:", error);
    return NextResponse.json(
      { error: "Failed to fetch days" },
      { status: 500 }
    );
  }
}

// POST /api/user/itineraries/[id]/days - Create new day
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
    const { dayNumber, title, description } = body;

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

    if (dayNumber === undefined || dayNumber < 1) {
      return NextResponse.json(
        { error: "Day number must be at least 1" },
        { status: 400 }
      );
    }

    if (dayNumber > itinerary.durationDays) {
      return NextResponse.json(
        { error: `Day number cannot exceed itinerary duration (${itinerary.durationDays})` },
        { status: 400 }
      );
    }

    // Check if day already exists
    const existingDay = await prisma.itineraryDay.findFirst({
      where: {
        itineraryId,
        dayNumber,
      },
    });

    if (existingDay) {
      return NextResponse.json(
        { error: "Day already exists for this itinerary" },
        { status: 409 }
      );
    }

    const day = await prisma.itineraryDay.create({
      data: {
        itineraryId,
        dayNumber,
        title: title || `Day ${dayNumber}`,
        description: description || null,
      },
      include: {
        activities: true,
      },
    });

    return NextResponse.json({ day }, { status: 201 });
  } catch (error) {
    console.error("Create day error:", error);
    return NextResponse.json(
      { error: "Failed to create day" },
      { status: 500 }
    );
  }
}
