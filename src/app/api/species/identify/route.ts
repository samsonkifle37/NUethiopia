import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json(); // base64 or URL

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    // SIMULATED AI LOGIC:
    // In production, this would call a Vision API or a local model.
    // We'll simulate a 2-second processing time and return a random endemic species.
    await new Promise(resolve => setTimeout(resolve, 2000));

    // For demo, we'll pick a species from the db
    const speciesList = await prisma.species.findMany();
    
    if (speciesList.length === 0) {
      return NextResponse.json({ 
        match: null, 
        confidence: 0,
        message: "No species found in database." 
      });
    }

    const randomMatch = speciesList[Math.floor(Math.random() * speciesList.length)];
    const confidence = 0.85 + Math.random() * 0.12; // 85% - 97% confidence

    return NextResponse.json({
      match: randomMatch,
      confidence,
      alternatives: speciesList.filter((s: any) => s.id !== randomMatch.id).slice(0, 2),
      category: randomMatch.type.toLowerCase()
    });
  } catch (error) {
    return NextResponse.json({ error: "Identification pipeline failed" }, { status: 500 });
  }
}
