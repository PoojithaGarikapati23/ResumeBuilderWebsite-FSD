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
      return NextResponse.json({ error: "Only PDF files are supported currently" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse text from PDF using pdf2json
    const PDFParser = (await import("pdf2json")).default;
    const pdfParser = new PDFParser(null, true); // true = raw text content

    const rawText = await new Promise<string>((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
      pdfParser.on("pdfParser_dataReady", () => {
        resolve(pdfParser.getRawTextContent());
      });
      pdfParser.parseBuffer(buffer);
    });

    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json({ error: "Could not extract text from the PDF" }, { status: 400 });
    }

    // Pass to AI for structured extraction
    const structuredResume = await parseResumeText(rawText);

    return NextResponse.json({ success: true, data: structuredResume });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}
