import OpenAI from 'openai';

// Ensure you have OPENAI_API_KEY in your .env file
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-build",
});
