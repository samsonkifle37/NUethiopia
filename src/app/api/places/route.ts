import { NextRequest, NextResponse } from "next/server";
import { getPlacesServer } from "@/lib/data/places";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type"); 
        const city = searchParams.get("city");
        const search = searchParams.get("search");
        const neighborhood = searchParams.get("neighborhood");
        const limit = parseInt(searchParams.get("limit") || "18");
        const offset = parseInt(searchParams.get("offset") || "0");

        const result = await getPlacesServer({
            types: type || undefined,
            city: city || undefined,
            search: search || undefined,
            neighborhood: neighborhood || undefined,
            limit,
            offset
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching places:", error);
        return NextResponse.json(
            { error: "Failed to fetch places" },
            { status: 500 }
        );
    }
}
