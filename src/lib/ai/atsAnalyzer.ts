import { openai } from "./config";
import { ResumeData } from "@/types/resume";
import { JobDescriptionData } from "./jdParser";

export type ATSAnalysisResult = {
  overallScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  keywordMatchPercentage: number;
  experienceMatch: string;
  educationMatch: string;
  recommendations: string[];
};

const ATS_SCHEMA = {
  type: "object",
  properties: {
    overallScore: { type: "number", description: "Score out of 100" },
    matchedSkills: { type: "array", items: { type: "string" } },
    missingSkills: { type: "array", items: { type: "string" } },
    keywordMatchPercentage: { type: "number" },
    experienceMatch: { type: "string", description: "Analysis of experience alignment" },
    educationMatch: { type: "string", description: "Analysis of education alignment" },
    recommendations: { type: "array", items: { type: "string" }, description: "Actionable steps to improve the resume for this JD" },
  },
  required: ["overallScore", "matchedSkills", "missingSkills", "keywordMatchPercentage", "experienceMatch", "educationMatch", "recommendations"]
};

export async function analyzeATSCompatibility(resume: ResumeData, jd: JobDescriptionData): Promise<ATSAnalysisResult> {
  try {
    const resumeString = JSON.stringify({
      summary: resume.summary,
      experience: resume.experience.map(e => ({ pos: e.position, desc: e.description })),
      education: resume.education.map(e => ({ deg: e.degree, field: e.fieldOfStudy })),
      skills: resume.skills.map(s => s.skills).flat(),
    });
    const jdString = JSON.stringify(jd);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert ATS (Applicant Tracking System) simulator and career coach. Compare the Resume against the Job Description. Be highly critical. Look for semantically related keywords (e.g. AWS and Amazon Web Services match). Provide actionable, factual recommendations. Do NOT invent information."
        },
        {
          role: "user",
          content: `RESUME:\n${resumeString}\n\nJOB DESCRIPTION:\n${jdString}`
        }
      ],
      functions: [{ name: "analyze_ats", parameters: ATS_SCHEMA }],
      function_call: { name: "analyze_ats" },
      temperature: 0,
    });

    const functionArgs = response.choices[0].message.function_call?.arguments;
    if (!functionArgs) {
      throw new Error("Failed to generate ATS analysis");
    }

    return JSON.parse(functionArgs);
  } catch (error) {
    console.error("ATS analysis error:", error);
    throw error;
  }
}
