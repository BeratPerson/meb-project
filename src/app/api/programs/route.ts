import { NextRequest, NextResponse } from "next/server";
import { universityService } from "@/lib/api/university-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const field = searchParams.get("field");
    const country = searchParams.get("country");
    const limit = parseInt(searchParams.get("limit") || "500"); // Default to 500

    console.log("🚀 /api/programs called with:", { field, country, limit });

    if (!field) {
      return NextResponse.json(
        { error: "Araştırma alanı belirtilmelidir" },
        { status: 400 }
      );
    }

    // Get universities from external APIs with higher limit
    console.log("🔍 Fetching universities from external APIs...");
    const universities = await universityService.searchUniversitiesByField(field, country || undefined, Math.max(limit, 500));
    console.log("📊 Found universities:", universities.length);

    // Create program data from universities (simplified approach)
    const programs = universities.map(uni => ({
      id: `program_${uni.id}`,
      name: `PhD in ${field}`, // Use original field for display
      department: uni.name, // Use university name as department for simplicity
      field: field,
      website: uni.website,
      university: {
        id: uni.id,
        name: uni.name,
        country: uni.country,
        city: uni.city,
        website: uni.website,
        logo: uni.logo,
        qsRanking: uni.qsRanking,
        timesRanking: uni.timesRanking
      },
      apiSource: 'OpenAlex', // Main source for university data
      publicationCount: uni.stats.worksCount,
      facultyCount: Math.floor(uni.stats.worksCount / 10), // Estimate
      description: uni.description
    }));

    console.log("📚 Total programs created:", programs.length);

    return NextResponse.json({ 
      programs: programs.slice(0, limit),
      total: programs.length,
      field,
      country: country || null
    });
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      { error: "Programlar alınırken hata oluştu" },
      { status: 500 }
    );
  }
} 