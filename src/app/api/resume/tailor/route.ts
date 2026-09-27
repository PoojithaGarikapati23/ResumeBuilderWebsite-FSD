import { NextRequest, NextResponse } from "next/server";
import { tailorResume } from "@/lib/ai/resumeTailor";
import { ResumeData } from "@/types/resume";
import { JobDescriptionData } from "@/lib/ai/jdParser";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      resumeData,
      jdData,
    }: { resumeData: ResumeData; jdData: JobDescriptionData } = body;

    if (!resumeData || !jdData) {
      return NextResponse.json(
        { error: "Missing Resume or JD data" },
        { status: 400 },
      );
    }

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "dummy-key-for-build") {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is missing or invalid. Please configure it in your .env file." },
        { status: 500 },
      );
    }

    const tailoredResume = await tailorResume(resumeData, jdData);

    return NextResponse.json({ success: true, data: tailoredResume });
  } catch (error: any) {
    console.error("Tailor API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to tailor resume" },
      { status: 500 },
    );
  }
}
