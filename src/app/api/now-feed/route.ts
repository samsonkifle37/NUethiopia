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
            
            // 3. Distance Score (*20)
            let distanceScore = 0;
            if (place.latitude && place.longitude) {
                const dist = calculateDistance(lat, lng, place.latitude, place.longitude);
                // 1km or less = full 20 points, drops off linearly or exponentially
                distanceScore = Math.max(0, 20 * (1 / (1 + dist))); 
            }
            score += distanceScore;
            
            // 4. Verification Score (*10)
            score += (place.verificationScore / 100) * 10;
            
            // 5. Availability Signal (+15)
            const hasUrgency = place.availabilityStatus === "last_seats" || 
                              place.availabilityStatus === "filling_up";
            if (hasUrgency) score += 15;

            // Micro-signals for UI
            let microSignal = "Open now";
            if (isLive) microSignal = "Live Event";
            else if (hasUrgency) {
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

        // Selection Rules
        // Featured = highest scoring place OR live event
        const featured = scoredPlaces[0];
        
        // Secondary = 2 places
        // 1. One urgent (closing soon / limited availability)
        // 2. One relaxed (coffee / chill)
        const secondary: any[] = [];
        
        // Find an urgent one
        const urgent = scoredPlaces.find(p => 
            p.id !== featured?.id && 
            (p.availabilityStatus === "last_seats" || p.availabilityStatus === "filling_up")
        );
        if (urgent) secondary.push(urgent);
        
        // Find a relaxed one
        const relaxed = scoredPlaces.find(p => 
            p.id !== featured?.id && 
            !secondary.find(s => s.id === p.id) &&
            (p.type === "coffee" || p.type === "park" || p.type === "museum" || p.type === "culture")
        );
        if (relaxed) secondary.push(relaxed);

        // Fill remaining if needed
        scoredPlaces.forEach(p => {
            if (secondary.length < 2 && p.id !== featured?.id && !secondary.find(s => s.id === p.id)) {
                secondary.push(p);
            }
        });

        return NextResponse.json({
            featured,
            secondary: secondary.slice(0, 2),
            context: {
                timeOfDay: getTimeOfDay(nowServer),
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
