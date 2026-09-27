import { NextRequest, NextResponse } from "next/server";
import { parseResumeText } from "@/lib/ai/resumeParser";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      // For now, we strictly support PDF. DOCX extraction can be added later.
      return NextResponse.json(
        { error: "Only PDF files are supported currently" },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse text from PDF using pdf-parse
    const pdfParse = require("pdf-parse");
    const pdfData = await pdfParse(buffer);
    const rawText = pdfData.text;

    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json(
        { error: "Could not extract text from the PDF" },
        { status: 400 },
      );
    }

    // Pass to AI for structured extraction
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "dummy-key-for-build") {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is missing or invalid. Please configure it in your .env file." },
        { status: 500 },
      );
    }
    const structuredResume = await parseResumeText(rawText);

    return NextResponse.json({ success: true, data: structuredResume });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 },
    );
  }
}
