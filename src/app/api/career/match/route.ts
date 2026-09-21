import { NextRequest, NextResponse } from "next/server";
import { matchCareers } from "@/lib/ai/careerMatcher";
import { ResumeData } from "@/types/resume";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeData }: { resumeData: ResumeData } = body;

    if (!resumeData) {
      return NextResponse.json({ error: "Missing Resume data" }, { status: 400 });
    }

    const roles = await matchCareers(resumeData);

    return NextResponse.json({ success: true, roles });
  } catch (error: any) {
    console.error("Career Match API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to find career matches" }, { status: 500 });
  }
}
