import { NextRequest, NextResponse } from "next/server";
import { universityService } from "@/lib/api/university-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const field = searchParams.get("field");
    const country = searchParams.get("country");
    const limit = parseInt(searchParams.get("limit") || "20");

    console.log("🚀 /api/mentors called with:", { field, country, limit });

    if (!field) {
      return NextResponse.json(
        { error: "Araştırma alanı belirtilmelidir" },
        { status: 400 }
      );
    }

    // Get mentors from external APIs
    console.log("🔍 Fetching mentors from external APIs...");
    const mentors = await universityService.searchMentorsByField(field, country || undefined, limit);
    console.log("📊 Found mentors:", mentors.length);

    return NextResponse.json({ 
      mentors: mentors.slice(0, limit),
      total: mentors.length,
      field,
      country: country || null
    });
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      { error: "Mentorlar alınırken hata oluştu" },
      { status: 500 }
    );
  }
} 