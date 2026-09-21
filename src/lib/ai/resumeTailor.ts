import { openai } from "./config";
import { ResumeData } from "@/types/resume";
import { JobDescriptionData } from "./jdParser";

export async function tailorResume(resume: ResumeData, jd: JobDescriptionData): Promise<ResumeData> {
  try {
    const resumeString = JSON.stringify(resume);
    const jdString = JSON.stringify(jd);

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Need a smarter model for complex rewriting
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer. Your task is to tailor the provided Resume to perfectly match the provided Job Description. You MUST keep the output strictly in the exact same JSON format as the original ResumeData. RULES: 1. Do NOT invent new jobs, degrees, or certifications. 2. Rewrite the professional summary to align with the JD. 3. Rewrite experience bullet points to highlight skills mentioned in the JD if applicable. 4. Reorder skills to put JD-relevant skills first. 5. Maintain factual accuracy."
        },
        {
          role: "user",
          content: `RESUME:\n${resumeString}\n\nJOB DESCRIPTION:\n${jdString}`
        }
      ],
      response_format: { type: "json_object" }, // Assuming the model outputs the exact ResumeData format
      temperature: 0.2,
    });

    const output = response.choices[0].message.content;
    if (!output) {
      throw new Error("Failed to tailor resume");
    }

    const tailoredResume = JSON.parse(output) as ResumeData;
    
    // Ensure IDs are unique for the new tailored version
    const { v4: uuidv4 } = require("uuid");
    tailoredResume.id = uuidv4();
    tailoredResume.title = `${resume.title} (Tailored for ${jd.title})`;
    
    return tailoredResume;
  } catch (error) {
    console.error("Tailoring error:", error);
    throw error;
  }
}
