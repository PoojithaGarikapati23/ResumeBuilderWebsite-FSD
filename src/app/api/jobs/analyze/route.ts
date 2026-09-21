import { NextRequest, NextResponse } from "next/server";
import { parseJobDescription } from "@/lib/ai/jdParser";
import { analyzeATSCompatibility } from "@/lib/ai/atsAnalyzer";
import { ResumeData } from "@/types/resume";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rawJdText, resumeData }: { rawJdText: string; resumeData: ResumeData } = body;

    if (!rawJdText || !resumeData) {
      return NextResponse.json({ error: "Missing JD text or Resume data" }, { status: 400 });
    }

    // 1. Parse JD
    const jd = await parseJobDescription(rawJdText);

    // 2. Analyze Resume vs JD
    const analysis = await analyzeATSCompatibility(resumeData, jd);

    return NextResponse.json({ success: true, jd, analysis });
  } catch (error: any) {
    console.error("ATS API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to analyze job" }, { status: 500 });
  }
}
