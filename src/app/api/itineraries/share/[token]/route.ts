import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/itineraries/share/[token] - Get shared itinerary (public endpoint)
export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;

    if (!token) {
      return NextResponse.json(
        { error: "Share token is required" },
        { status: 400 }
      );
    }

    // Find share link by token
    const shareLink = await prisma.itineraryShare.findFirst({
      where: {
        shareToken: token,
      },
      include: {
        itinerary: {
          include: {
            days: {
              include: {
                activities: {
                  include: {
                    place: true,
                  },
                  orderBy: {
                    timeSlot: "asc",
                  },
                },
              },
              orderBy: {
                dayNumber: "asc",
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!shareLink) {
      return NextResponse.json(
        { error: "Share link not found" },
        { status: 404 }
      );
    }

    // Check if share link has expired
    if (shareLink.expiresAt && new Date() > shareLink.expiresAt) {
      return NextResponse.json(
        { error: "Share link has expired" },
        { status: 410 }
      );
    }

    // Check if itinerary is public
    if (!shareLink.isPublic) {
      return NextResponse.json(
        { error: "This itinerary is not public" },
        { status: 403 }
      );
    }

    // Increment view count
    await prisma.itineraryShare.update({
      where: { id: shareLink.id },
      data: {
        viewCount: shareLink.viewCount + 1,
      },
    });

    // Return itinerary details
    const response = {
      itinerary: shareLink.itinerary,
      shareInfo: {
        sharedBy: shareLink.itinerary.user,
        sharedAt: shareLink.createdAt,
        viewCount: shareLink.viewCount,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Get shared itinerary error:", error);
    return NextResponse.json(
      { error: "Failed to fetch shared itinerary" },
      { status: 500 }
    );
  }
}
