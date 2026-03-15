import OpenAI from "openai";

const groq = new OpenAI({
  apiKey: process.env.GORQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

interface GeneratedReply {
  reply: string;
  confidence: number;
}

interface GenerateRepliesResponse {
  replies: GeneratedReply[];
  tone: string;
}

export async function generateRomeoDateingCoachResponse(message: string): Promise<string> {
  try {
    const systemPrompt = `You are Romeo, an expert dating coach. Give very short practical advice (1-2 sentences).`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 60
    });

    return response.choices[0].message.content || "Ask me anything about dating.";
  } catch (error) {
    console.error("Groq Romeo error:", error);
    return "Temporary AI issue. Try again.";
  }
}

export async function generateRomeoResponse(message: string, isPremium = false): Promise<string> {
  try {
    const systemPrompt = `You are Romeo, a smart dating coach. Give short direct answers.`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 80
    });

    return response.choices[0].message.content || "How can I help?";
  } catch (error) {
    console.error("Groq Romeo chat error:", error);
    return "AI service temporarily unavailable.";
  }
}

export async function analyzeMessagePattern(message: string) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `Analyze a dating message and return JSON:
{
"hiddenMeaning":"",
"recommendedTone":"",
"expertTip":"",
"patternInterrupt":""
}`
        },
        {
          role: "user",
          content: message
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.6
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Groq pattern analysis error:", error);
    throw new Error("Pattern analysis failed");
  }
}

export async function generateReplies(
  message: string,
  tone: "confident" | "funny" | "flirty" | "creative",
  language: "en" | "hi" = "en",
  isPremium = false
): Promise<GenerateRepliesResponse> {

  if (!message.trim()) {
    throw new Error("Message cannot be empty");
  }

  try {
    const systemPrompt = `You are a dating assistant. Generate 3 replies with tone: ${tone}. Return JSON:

{
 "replies":[
   {"reply":"text","confidence":90},
   {"reply":"text","confidence":85},
   {"reply":"text","confidence":88}
 ],
 "tone":"${tone}"
}`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 400
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Groq reply generation error:", error);
    throw new Error("Failed to generate replies");
  }
}