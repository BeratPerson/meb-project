import { NextRequest, NextResponse } from "next/server";
import { universityService } from "@/lib/api/university-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const field = searchParams.get("field");
    const country = searchParams.get("country");
    const limit = parseInt(searchParams.get("limit") || "20");
    const top = searchParams.get("top") === "true";

    if (!field) {
      return NextResponse.json(
        { error: "Araştırma alanı belirtilmelidir" },
        { status: 400 }
      );
    }

    let universities;
    
    if (top) {
      // Get top universities by field from APIs
      universities = await universityService.getTopUniversitiesByField(field, country || undefined, limit);
    } else {
      // Get universities from external APIs only
      universities = await universityService.getUniversitiesFromDatabase(field, country || undefined);
    }

    return NextResponse.json({ 
      universities: universities.slice(0, limit),
      total: universities.length,
      field,
      country: country || null
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Üniversiteler alınırken hata oluştu" },
      { status: 500 }
    );
  }
} 