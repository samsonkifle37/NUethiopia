import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendSafetyNotification } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  try {
    const { region, status, summary, details } = await request.json();

    if (!region || !status) {
      return NextResponse.json({ error: "Region and Status are mandatory" }, { status: 400 });
    }

    const updated = await prisma.travelStatus.upsert({
      where: { region },
      update: {
        status,
        summary,
        details,
        lastUpdated: new Date(),
        sourceType: "admin"
      },
      create: {
        region,
        status,
        summary,
        details,
        sourceType: "admin"
      }
    });

    // Trigger notification
    await sendSafetyNotification(region, status, summary);

    return NextResponse.json({ message: "Safety status updated successfully", updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update safety status" }, { status: 500 });
  }
}
