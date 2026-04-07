import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "10");
  const category = searchParams.get("category");

  try {
    const posts = await (prisma as any).discoveryPost.findMany({
      where: {
        status: "APPROVED",
        ...(category ? { category } : {}),
      },
      include: {
        user: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
