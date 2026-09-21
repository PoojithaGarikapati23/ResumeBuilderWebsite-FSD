import { openai } from "./config";
import { ResumeData, defaultResumeData } from "@/types/resume";

const RESUME_JSON_SCHEMA = {
  type: "object",
  properties: {
    personalInfo: {
      type: "object",
      properties: {
        firstName: { type: "string" },
        lastName: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        location: { type: "string" },
        website: { type: "string" },
        linkedin: { type: "string" },
        github: { type: "string" },
        jobTitle: { type: "string" },
      }
    },
    summary: { type: "string" },
    experience: {
      type: "array",
      items: {
        type: "object",
        properties: {
          company: { type: "string" },
          position: { type: "string" },
          location: { type: "string" },
          startDate: { type: "string" },
          endDate: { type: "string" },
          current: { type: "boolean" },
          description: { type: "array", items: { type: "string" } },
        }
      }
    },
    education: {
      type: "array",
      items: {
        type: "object",
        properties: {
          institution: { type: "string" },
          degree: { type: "string" },
          fieldOfStudy: { type: "string" },
          startDate: { type: "string" },
          endDate: { type: "string" },
          current: { type: "boolean" },
          gpa: { type: "string" },
        }
      }
    },
    skills: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          skills: { type: "array", items: { type: "string" } },
        }
      }
    }
  },
  required: ["personalInfo", "summary", "experience", "education", "skills"]
};

export async function parseResumeText(rawText: string): Promise<Partial<ResumeData>> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cost-effective model for extraction
      messages: [
        {
          role: "system",
          content: "You are an expert ATS resume parser. Your job is to extract the text from a resume and convert it perfectly into the provided JSON schema. Ensure no details are hallucinated. Group skills logically into categories (e.g. 'Languages', 'Frameworks', 'Soft Skills'). If a field is not found, leave it blank."
        },
        {
          role: "user",
          content: `Extract the following resume text:\n\n${rawText}`
        }
      ],
      functions: [{ name: "extract_resume", parameters: RESUME_JSON_SCHEMA }],
      function_call: { name: "extract_resume" },
      temperature: 0,
    });

    const functionArgs = response.choices[0].message.function_call?.arguments;
    if (!functionArgs) {
      throw new Error("Failed to extract JSON from resume");
    }

    const parsed = JSON.parse(functionArgs);
    
    // Inject UUIDs for arrays so the UI state works properly
    const { v4: uuidv4 } = require("uuid");
    
    return {
      ...defaultResumeData,
      ...parsed,
      experience: parsed.experience?.map((e: any) => ({ ...e, id: uuidv4() })) || [],
      education: parsed.education?.map((e: any) => ({ ...e, id: uuidv4() })) || [],
      skills: parsed.skills?.map((s: any) => ({ ...s, id: uuidv4() })) || [],
    };
  } catch (error) {
    console.error("Resume parsing error:", error);
    throw error;
  }
}
