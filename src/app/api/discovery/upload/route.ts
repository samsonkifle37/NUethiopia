import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Create client lazily to avoid build-time errors if env vars are missing
function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase environment variables are missing");
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const location = formData.get("location") as string;

    if (!image || !title || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = getSupabase();

    // 1. Upload to Supabase Storage
    const buffer = Buffer.from(await image.arrayBuffer());
    const fileName = `${Date.now()}-${image.name.replace(/\s+/g, '-')}`;
    const path = `discovery/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('place-images')
      .upload(path, buffer, {
        contentType: image.type,
        upsert: true
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('place-images')
      .getPublicUrl(path);

    // 2. Save to Prisma
    const session = await getSession();
    const userId = session?.user?.id || "guest-user";

    const post = await (prisma as any).discoveryPost.create({
      data: {
        userId,
        title,
        description,
        imageUrl: publicUrl,
        locationName: location,
        category,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload gem" }, { status: 500 });
  }
}
