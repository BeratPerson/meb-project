import { NextRequest, NextResponse } from "next/server";
import { universityService } from "@/lib/api/university-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const field = searchParams.get("field") || "Computer Science";
    
    console.log("Testing APIs for field:", field);
    
    // Test 1: Search universities
    console.log("1. Testing university search...");
    const universities = await universityService.searchUniversitiesByField(field, undefined, 5);
    console.log("Found universities:", universities.length);
    
    // Test 2: Search research fields
    console.log("2. Testing research fields search...");
    const fields = await universityService.searchResearchFields(field, 5);
    console.log("Found fields:", fields.length);
    
    // Test 3: Search PhD programs
    console.log("3. Testing PhD programs search...");
    const programs = await universityService.searchPhDPrograms(field, undefined, 5);
    console.log("Found programs:", programs.length);
    
    return NextResponse.json({
      success: true,
      field,
      results: {
        universities: universities.length,
        fields: fields.length,
        programs: programs.length
      },
      sampleData: {
        universities: universities.slice(0, 2),
        fields: fields.slice(0, 2),
        programs: programs.slice(0, 2)
      }
    });
  } catch (error) {
    console.error("API Test Error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 