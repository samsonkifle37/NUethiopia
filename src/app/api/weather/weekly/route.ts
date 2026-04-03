import { NextResponse } from "next/server";

// Addis Ababa Coordinates
const ADDIS_LAT = 9.03;
const ADDIS_LON = 38.74;

export async function GET() {
    try {
        // Use Open-Meteo for free, live weather
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${ADDIS_LAT}&longitude=${ADDIS_LON}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=3`;
        
        const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
        if (!res.ok) throw new Error("Weather API failed");
        
        const data = await res.json();
        const daily = data.daily;
        
        const summary = daily.time.map((time: string, i: number) => ({
            date: time,
            max: Math.round(daily.temperature_2m_max[i]),
            min: Math.round(daily.temperature_2m_min[i]),
            icon: getWeatherIcon(daily.weathercode[i]),
        }));

        return NextResponse.json({ weather: summary });
    } catch (error) {
        console.error("Weather API Error:", error);
        // Graceful degradation: placeholder
        return NextResponse.json({ 
            weather: null,
            error: "Could not fetch live weather"
        });
    }
}

function getWeatherIcon(code: number) {
    if (code === 0) return "☀️";
    if (code <= 3) return "⛅";
    if (code <= 48) return "☁️";
    if (code <= 67) return "🌧️";
    if (code <= 77) return "🌨️";
    if (code <= 82) return "🌦️";
    if (code <= 99) return "⛈️";
    return "🌡️";
}
