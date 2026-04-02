import { NextResponse } from "next/server";
import OpenAI from "openai";

// Open-Meteo WMO weather code mapping
const getWeatherIcon = (code: number) => {
  if (code <= 1) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 48) return "☁️";
  if (code <= 57) return "🌧️";
  if (code <= 67) return "🌧️"; 
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌦️";
  if (code <= 99) return "⛈️";
  return "⛅";
};

export async function GET() {
  try {
    // 1. Fetch 3-day weather for Addis Ababa
    const weatherRes = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=9.02497&longitude=38.74689&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Africa%2FAddis_Ababa&forecast_days=3",
      { next: { revalidate: 3600 * 6 } } // Cache weather for 6 hours
    );
    const weatherData = await weatherRes.json();
    
    const weather = weatherData.daily.time.map((date: string, i: number) => ({
      date,
      max: Math.round(weatherData.daily.temperature_2m_max[i]),
      min: Math.round(weatherData.daily.temperature_2m_min[i]),
      icon: getWeatherIcon(weatherData.daily.weathercode[i])
    }));

    let events = [
      { title: "Ethio-Jazz Night", desc: "Live music at Fendika Cultural Center.", icon: "🎷" },
      { title: "Coffee Markets", desc: "Fresh seasonal beans arriving at Shola.", icon: "☕" },
      { title: "Weekend Hikes", desc: "Entoto Mountain trails are clear.", icon: "🥾" }
    ];

    if (process.env.OPENAI_API_KEY) {
      try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const prompt = `You are a local Addis Ababa guide. Today is ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. 
What is the vibe in Addis Ababa right now according to the Ethiopian calendar and season? 
Provide exactly 3 realistic, culturally accurate recurring events or seasonal highlights happening right now (e.g., live jazz at specific known venues, seasonal markets, specific holidays falling exactly this week). 
Do NOT invent one-off concerts. Focus on established weekly events (like Ethio-Jazz Thursdays at Fendika) or actual seasonal/religious festivals happening this week.

Return a JSON object with a single key "events" containing an array of 3 objects with "title", "desc", and "icon" (a single emoji).

[SCHEMA EXPECTATION]
{
  "events": [
    { "title": "...", "desc": "...", "icon": "🎭" }
  ]
}
`;

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.5,
          response_format: { type: "json_object" }
        });

        const output = completion.choices[0]?.message?.content;
        if (output) {
           const parsed = JSON.parse(output);
           if (parsed.events && Array.isArray(parsed.events)) {
             events = parsed.events;
           }
        }
      } catch (aiError) {
        console.error("OpenAI events fetch failed, using fallback:", aiError);
      }
    }

    return NextResponse.json(
      { weather, events }, 
      { headers: { "Cache-Control": "public, s-maxage=43200, stale-while-revalidate=86400" } }
    );
  } catch (error) {
    console.error("This week endpoint error:", error);
    return NextResponse.json({ error: "Failed to fetch", details: String(error) }, { status: 500 });
  }
}
