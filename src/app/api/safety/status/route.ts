import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const statuses = await prisma.travelStatus.findMany({
      orderBy: { region: "asc" },
    });
    return NextResponse.json({ statuses });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch safety status" }, { status: 500 });
  }
}
