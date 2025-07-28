import { NextRequest, NextResponse } from "next/server";
import { universityService } from "@/lib/api/university-service";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    
    if (key) {
      universityService.clearCacheFor(key);
      console.log("🧹 Cache cleared for key:", key);
    } else {
      universityService.clearCache();
      console.log("🧹 All cache cleared");
    }
    
    return NextResponse.json({ 
      success: true, 
      message: key ? `Cache cleared for ${key}` : "All cache cleared" 
    });
  } catch (error) {
    console.error("❌ Clear cache error:", error);
    return NextResponse.json(
      { error: "Cache temizlenirken hata oluştu" },
      { status: 500 }
    );
  }
} 