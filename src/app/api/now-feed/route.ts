import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const lat = parseFloat(searchParams.get("lat") || "9.03");
        const lng = parseFloat(searchParams.get("lng") || "38.74");
        
        const nowServer = new Date();
        const currentDay = nowServer.toLocaleDateString('en-US', { weekday: 'long' });
        
        // Fetch eligible places
        const places = await prisma.place.findMany({
            where: {
                status: "APPROVED",
                isActive: true
            },
            include: {
                images: { orderBy: { priority: "asc" }, take: 1 },
                _count: { select: { reviews: true } }
            }
        });

        // Scoring & Logic
        const timeOfDay = getTimeOfDay(nowServer);
        const scoredPlaces = places.map((place: any) => {
            let score = 0;
            
            // 1. isOpenNow (+30)
            const isOpen = checkIfOpen(place.openingHours, currentDay, nowServer);
            if (isOpen) score += 30;
            
            // 2. hasLiveEvent (+40)
            const isLive = place.hasLiveEvent && 
                          (!place.eventStartTime || place.eventStartTime <= nowServer) && 
                          (!place.eventEndTime || place.eventEndTime >= nowServer);
            if (isLive) score += 40;
            
            // 3. Distance Score (*30) - Increased weight for personal feel
            let distanceScore = 0;
            if (place.latitude && place.longitude) {
                const dist = calculateDistance(lat, lng, place.latitude, place.longitude);
                // Closer is much better
                distanceScore = Math.max(0, 30 * (1 / (1 + dist))); 
            }
            score += distanceScore;
            
            // 4. Time of Day Affinity (+20) - NEW for personalization
            if (timeOfDay === "Morning" && (place.type === "coffee" || place.type === "park" || place.type === "museum")) score += 20;
            if (timeOfDay === "Afternoon" && (place.type === "restaurant" || place.type === "market" || place.type === "tour")) score += 20;
            if (timeOfDay === "Evening" && (place.type === "restaurant" || place.type === "nightlife" || place.type === "club")) score += 20;
            if (timeOfDay === "Night" && (place.type === "nightlife" || place.type === "club" || place.type === "bar")) score += 20;

            // 5. Verification & Popularity
            score += (place.verificationScore / 100) * 10;
            if (place._count?.reviews > 10) score += 5;
            
            // 6. Random Jitter (+0-15) - To make it change regularly
            score += Math.random() * 15;

            // Micro-signals for UI
            let microSignal = "Open now";
            if (isLive) microSignal = "Live Event";
            else if (place.availabilityStatus === "last_seats" || place.availabilityStatus === "filling_up") {
                microSignal = place.availabilityStatus === "last_seats" ? "Last seats" : "Filling fast";
            } else if (!isOpen) microSignal = "Opens later";

            return {
                ...place,
                score,
                microSignal,
                distance: place.latitude ? calculateDistance(lat, lng, place.latitude, place.longitude).toFixed(1) + "km away" : "Nearby"
            };
        });

        // Sorting
        scoredPlaces.sort((a, b) => b.score - a.score);

        // Selection with Randomness
        // Featured = Pick from the top 3 highest scoring places (adds variety)
        const featuredCandidates = scoredPlaces.slice(0, 3);
        const featured = featuredCandidates[Math.floor(Math.random() * featuredCandidates.length)];
        
        // Secondary = 2 places from the next top 8
        const secondaryCandidates = scoredPlaces
            .filter(p => p.id !== featured?.id)
            .slice(0, 8);
        
        // Shuffle and pick 2
        const shuffledSecondary = secondaryCandidates.sort(() => 0.5 - Math.random());
        const secondary = shuffledSecondary.slice(0, 2);

        return NextResponse.json({
            featured,
            secondary,
            context: {
                timeOfDay,
                timestamp: nowServer.toISOString(),
                location: "Addis Ababa"
            }
        });

    } catch (error) {
        console.error("Now Feed API Error:", error);
        return NextResponse.json({ error: "Failed to generate now-feed" }, { status: 500 });
    }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function checkIfOpen(openingHours: any, currentDay: string, now: Date) {
    if (!openingHours || !Array.isArray(openingHours)) return true; // Default to true if missing
    
    // Find the current day string e.g. "Monday: Open 24 hours"
    const dayHours = openingHours.find(h => h.toLowerCase().includes(currentDay.toLowerCase()));
    if (!dayHours) return true;
    
    if (dayHours.toLowerCase().includes("open 24 hours")) return true;
    if (dayHours.toLowerCase().includes("closed")) return false;
    
    // Simple parsing for 8:00 AM - 10:00 PM format
    try {
        const timePart = dayHours.split(":")[1]?.trim(); // "8:00 AM - 10:00 PM"
        if (!timePart) return true;
        
        const [start, end] = timePart.split("-").map((t: string) => t.trim());
        const startTime = parseTimeString(start);
        const endTime = parseTimeString(end);
        
        const currentMins = now.getHours() * 60 + now.getMinutes();
        return currentMins >= startTime && currentMins <= endTime;
    } catch (e) {
        return true; // Fallback
    }
}

function parseTimeString(t: string) {
    const [time, period] = t.split(" ");
    const [h, m] = time.split(":").map(Number);
    let hours = h;
    if (period === "PM" && h !== 12) hours += 12;
    if (period === "AM" && h === 12) hours = 0;
    return hours * 60 + (m || 0);
}

function getTimeOfDay(date: Date) {
    const hours = date.getHours();
    if (hours >= 5 && hours < 12) return "Morning";
    if (hours >= 12 && hours < 17) return "Afternoon";
    if (hours >= 17 && hours < 21) return "Evening";
    return "Night";
}

function getTimeDisplay(date: Date) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}
