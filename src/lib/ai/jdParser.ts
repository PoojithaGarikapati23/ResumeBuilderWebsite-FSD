import { openai } from "./config";

export type JobDescriptionData = {
  title: string;
  company?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceLevel: string;
  educationLevel: string;
  keyResponsibilities: string[];
};

const JD_JSON_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    company: { type: "string" },
    requiredSkills: { type: "array", items: { type: "string" } },
    preferredSkills: { type: "array", items: { type: "string" } },
    experienceLevel: { type: "string" },
    educationLevel: { type: "string" },
    keyResponsibilities: { type: "array", items: { type: "string" } },
  },
  required: ["title", "requiredSkills", "preferredSkills", "experienceLevel", "educationLevel", "keyResponsibilities"]
};

export async function parseJobDescription(rawText: string): Promise<JobDescriptionData> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert HR analyst. Extract the structured requirements from the provided job description. Be precise and exhaustive with the skills."
        },
        {
          role: "user",
          content: `Job Description:\n\n${rawText}`
        }
      ],
      functions: [{ name: "extract_jd", parameters: JD_JSON_SCHEMA }],
      function_call: { name: "extract_jd" },
      temperature: 0,
    });

    const functionArgs = response.choices[0].message.function_call?.arguments;
    if (!functionArgs) {
      throw new Error("Failed to extract JSON from JD");
    }

    return JSON.parse(functionArgs);
  } catch (error) {
    console.error("JD parsing error:", error);
    throw error;
  }
}
