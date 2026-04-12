"use server";

import { prisma } from "@/lib/prisma";

export async function getEventsForMonth(month: number, year: number) {
    // month is 0-indexed (0 = Jan)
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59);

    const events = await prisma.event.findMany({
        where: {
            startTime: {
                gte: startDate,
                lte: endDate
            }
        },
        include: {
            place: {
                select: {
                    name: true,
                    area: true
                }
            }
        },
        orderBy: {
            startTime: 'asc'
        }
    });

    return JSON.parse(JSON.stringify(events));
}
