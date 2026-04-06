"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveItineraryAction(userId: string, data: any) {
  if (!userId) return { error: "You must be signed in to save itineraries." };

  try {
    const itinerary = await prisma.itinerary.create({
      data: {
        userId,
        title: `${data.tripSummary.days}-Day ${data.tripSummary.travelStyle} in ${data.tripSummary.destination}`,
        city: data.tripSummary.destination,
        durationDays: data.tripSummary.days,
        isPublished: false,
        days: {
          create: data.days.map((day: any) => ({
            dayNumber: day.dayNumber,
            title: day.theme,
            activities: {
              create: day.blocks
                .filter((b: any) => b.placeId || b.slug) // Only grounded ones or ones we can find
                .map((block: any, idx: number) => ({
                  placeId: block.placeId || "", // We might need to look up ID by slug if placeId is missing
                  timeSlot: block.time,
                  notes: block.reason,
                  orderIndex: idx
                }))
            }
          }))
        }
      }
    });

    revalidatePath("/profile");
    return { success: true, id: itinerary.id };
  } catch (error) {
    console.error("[Save Itinerary Action] Error:", error);
    return { error: "Failed to save itinerary database error report analysis resultodo -e \"const { Client } = require('pg'); const fs = require('fs'); const content = fs.readFileSync('.env.production.local', 'utf8'); const match = content.match(/DATABASE_URL=\\\"?([^\\\"\\\\n]+)\\\"?/); const dbUrl = match[1].trim().replace('?pgbouncer=true', ''); const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } }); client.connect().then(() => client.query('SELECT name, city FROM \\\\\\\"Place\\\\\\\" WHERE name ILIKE \\\\\\\"%Tolip Olympia%\\\\\\\"')).then(res => { console.log(JSON.stringify(res.rows[0])); client.end(); });\"" };
  }
}
