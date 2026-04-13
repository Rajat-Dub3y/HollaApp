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
      model: "llama-3.1-8b-instant",
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
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 60
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
      model: "llama-3.1-8b-instant",
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
    const systemPrompt = `You are a dating reply generator. 
The user will give you a message they RECEIVED from their match.
Your job is to write 3 different replies they can SEND BACK to that match.
Write in tone: ${tone}.
${language === "hi" ? "Write replies in Hindi (Hinglish is fine)." : "Write replies in English."}

Rules:
- Each reply should sound natural, like a real person texting
- Do NOT explain anything. Do NOT add commentary. Just write the replies.
- Replies should be short (1-3 sentences max)
- Each reply must be meaningfully different from the others

Return ONLY this JSON, no extra text:
{
  "replies": [
    {"reply": "...", "confidence": 90},
    {"reply": "...", "confidence": 85},
    {"reply": "...", "confidence": 88}
  ],
  "tone": "${tone}"
}`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: `My match sent me this message: "${message}"\n\nGive me 3 replies I can send back.` 
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 400
    });

    const parsed = JSON.parse(response.choices[0].message.content || "{}");

    // Safety check — ensure shape is correct
    if (!parsed.replies || !Array.isArray(parsed.replies)) {
      throw new Error("Invalid response shape from Groq");
    }

    return parsed as GenerateRepliesResponse;

  } catch (error) {
    console.error("Groq reply generation error:", error);
    throw new Error("Failed to generate replies");
  }
}