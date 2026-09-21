import { openai } from "./config";
import { ResumeData } from "@/types/resume";

export type CareerRole = {
  role: string;
  matchLevel: "Strong" | "Partial" | "Low";
  matchingSkills: string[];
  missingSkills: string[];
  suggestedLearningPath: string;
  resumeImprovements: string;
};

const CAREER_MATCH_SCHEMA = {
  type: "object",
  properties: {
    roles: {
      type: "array",
      items: {
        type: "object",
        properties: {
          role: { type: "string" },
          matchLevel: { type: "string", enum: ["Strong", "Partial", "Low"] },
          matchingSkills: { type: "array", items: { type: "string" } },
          missingSkills: { type: "array", items: { type: "string" } },
          suggestedLearningPath: { type: "string" },
          resumeImprovements: { type: "string" },
        }
      }
    }
  },
  required: ["roles"]
};

export async function matchCareers(resume: ResumeData): Promise<CareerRole[]> {
  try {
    const resumeString = JSON.stringify({
      title: resume.personalInfo.jobTitle,
      summary: resume.summary,
      skills: resume.skills.map(s => s.skills).flat(),
      experience: resume.experience.map(e => ({ pos: e.position, desc: e.description })),
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert career counselor. Analyze the provided resume data and suggest 3-5 job roles the candidate is suitable for. Categorize match level as Strong, Partial, or Low. Be realistic and constructive."
        },
        {
          role: "user",
          content: `RESUME:\n${resumeString}`
        }
      ],
      functions: [{ name: "match_careers", parameters: CAREER_MATCH_SCHEMA }],
      function_call: { name: "match_careers" },
      temperature: 0.3,
    });

    const functionArgs = response.choices[0].message.function_call?.arguments;
    if (!functionArgs) {
      throw new Error("Failed to generate career matches");
    }

    const parsed = JSON.parse(functionArgs);
    return parsed.roles;
  } catch (error) {
    console.error("Career matching error:", error);
    throw error;
  }
}
