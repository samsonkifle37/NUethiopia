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

// GET /api/user/itineraries - List user's itineraries
export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Query parameters
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get("sortBy") || "recent"; // recent, oldest, title
    const published = searchParams.get("published") || "all"; // all, published, draft

    let orderBy: any = { createdAt: "desc" };
    if (sortBy === "oldest") orderBy = { createdAt: "asc" };
    if (sortBy === "title") orderBy = { title: "asc" };

    let where: any = { userId };
    if (published === "published") where.isPublished = true;
    if (published === "draft") where.isPublished = false;

    const itineraries = await prisma.itinerary.findMany({
      where,
      include: {
        days: {
          include: {
            activities: true,
          },
        },
        shareLink: {
          select: {
            shareToken: true,
            isPublic: true,
          },
        },
      },
      orderBy,
    });

    const response = itineraries.map((itinerary) => {
      const totalActivities = itinerary.days.reduce(
        (sum, day) => sum + day.activities.length,
        0
      );

      return {
        id: itinerary.id,
        title: itinerary.title,
        description: itinerary.description,
        city: itinerary.city,
        durationDays: itinerary.durationDays,
        isPublished: itinerary.isPublished,
        activityCount: totalActivities,
        shareLink: itinerary.shareLink
          ? {
              token: itinerary.shareLink.shareToken,
              isPublic: itinerary.shareLink.isPublic,
            }
          : null,
        createdAt: itinerary.createdAt,
        updatedAt: itinerary.updatedAt,
      };
    });

    return NextResponse.json({ itineraries: response }, { status: 200 });
  } catch (error) {
    console.error("Get itineraries error:", error);
    return NextResponse.json(
      { error: "Failed to fetch itineraries" },
      { status: 500 }
    );
  }
}

// POST /api/user/itineraries - Create new itinerary
export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, city, durationDays, startDate, endDate } = body;

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Itinerary title is required" },
        { status: 400 }
      );
    }

    if (!city || city.trim().length === 0) {
      return NextResponse.json(
        { error: "City is required" },
        { status: 400 }
      );
    }

    const duration = Math.max(1, Math.min(durationDays || 3, 14));

    // Create itinerary
    const itinerary = await prisma.itinerary.create({
      data: {
        userId,
        title: title.trim(),
        description: description || null,
        city: city.trim(),
        durationDays: duration,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        isPublished: false,
      },
      include: {
        days: true,
        shareLink: true,
      },
    });

    return NextResponse.json(
      {
        itinerary: {
          ...itinerary,
          activityCount: 0,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create itinerary error:", error);
    return NextResponse.json(
      { error: "Failed to create itinerary" },
      { status: 500 }
    );
  }
}
