import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system: "You are CareerCraft AI Assistant, an expert career counselor, resume reviewer, and technical recruiter. Your job is to help the user understand their ATS scores, suggest improvements to their resume, guide them on what jobs they are suitable for, and give career advice. Be encouraging, concise, and highly actionable. Format responses with markdown for readability.",
    messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
  });

  return result.toTextStreamResponse();
}
