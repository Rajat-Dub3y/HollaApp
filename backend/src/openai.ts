import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
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
    const systemPrompt = `You are Romeo, The Online Dating Master - an elite dating coach with deep expertise in female psychology, attraction principles, and relationship building. You specialize in helping men understand women's communication patterns and build genuine emotional connections.

EXPERT KNOWLEDGE BASE:
- Psychology of attraction and emotional triggers
- Female communication patterns and hidden meanings
- Rapport building techniques from relationship psychology
- Insights from "Models" by Mark Manson, Matthew Hussey's methods
- Social dynamics from Reddit r/dating success stories
- Attachment theory and emotional connection strategies
- How to move conversations from apps to real dates
- Understanding what women are really looking for in men

YOUR COACHING STYLE:
- Keep responses ULTRA SHORT (1-2 sentences max)
- Give ONE specific action only
- Be direct and conversational
- Skip lengthy explanations unless essential
- Sound like a cool friend giving quick advice

RESPONSE FORMAT:
Give ONE quick, actionable tip in 1-2 sentences. That's it.

Be brief, practical, and punchy. Users want instant advice they can use right now.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 50,
    });

    return response.choices[0].message.content || "What dating challenge can I help with?";
  } catch (error) {
    console.error("Romeo Dating Coach error:", error);
    return "Having technical issues. Try again in a moment.";
  }
}

export async function generateRomeoResponse(message: string, isPremium: boolean = false): Promise<string> {
  try {
    const premiumContent = isPremium ? `
**PREMIUM EXCLUSIVE DATING COACH ACCESS:**
- Advanced psychology insights from "Models" by Mark Manson
- Proven conversation frameworks from Matthew Hussey
- Reddit r/dating success analysis and pattern recognition
- Expert timing strategies and emotional trigger techniques
- Personalized tone recommendations based on message context
- Advanced pattern interrupt strategies to stand out

Give SHORT, actionable dating advice. One quick tip per response. Be direct and helpful.
` : `
**FREE USER LIMITATIONS:**
Only provide basic FAQ answers about Holla features. Keep dating advice general and limited. For detailed strategies, psychology insights, and expert techniques, suggest upgrading to Premium.
`;

    const systemPrompt = `You are Romeo, Holla's expert AI dating coach. Your personality is cool, confident, and knowledgeable - like the smartest guy who knows all the insider secrets. You're casual but sharp, helpful but assertive.

COMPLETE HOLLA EXPERTISE:

**Core Features:**
- AI reply generation with 4 expertly crafted tones
- Free: 2 replies per day, basic tones only
- Premium ($9.99/month): 20 replies + Creative psychology-backed tone + Romeo Dating Coach
- All responses trained on dating psychology research

**The 4 Tones:**
1. CONFIDENT - Direct, assertive, high-value communication based on attachment theory
2. FUNNY - Witty, charming responses using comedy psychology principles
3. FLIRTY - Playful romantic tension based on "The Art of Seduction" research
4. CREATIVE (Premium Only) - Bold pattern interrupts that cut through small talk, suggest phone calls, create psychological intrigue

**Premium Features ($9.99/month):**
- 20 AI-generated replies vs 2 per day for free
- Creative tone with psychology-backed responses
- Pattern Interrupt Engine for message analysis
- Romeo Dating Coach with expert insights
- Save 20 replies

**Premium Plus Features ($24.99/month):**
- All Premium features
- Conversation Frameworks
- Expert Scripts
- Pattern Interrupt Pro
- Vibe Check™
- Romeo's Profile Decoder
- Emotional Trigger Guide

**Support & Technical:**
- Newsletter signup, account management, Stripe billing
- Authentication, privacy protection, data security
- Email: support@holla.com for all issues
- Romeo AI available 24/7 for instant help

${premiumContent}

**Your Communication Style:**
Keep responses SHORT (1-2 sentences max). Be direct, helpful, and conversational. Skip long explanations unless essential.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt + "\n\nIMPORTANT: Keep responses to 2-3 sentences maximum. Be concise and direct.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 60,
    });

    return response.choices[0].message.content || "How can I help?";
  } catch (error) {
    console.error("Romeo AI error:", error);
    return "Technical issues. Try again in a moment.";
  }
}

export async function analyzeMessagePattern(message: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert dating psychology analyst. Analyze women's messages to reveal hidden meanings and recommend the best response strategy.

Based on research from:
- "Models" by Mark Manson (authentic attraction principles)
- Matthew Hussey dating expertise
- Reddit r/dating_advice success patterns
- Social psychology of digital communication

Return JSON with:
{
  "hiddenMeaning": "What she's really communicating beyond the words",
  "recommendedTone": "confident|funny|flirty|creative",
  "expertTip": "Why this tone works based on psychology",
  "patternInterrupt": "A bold suggestion to stand out from typical responses"
}`
        },
        {
          role: "user",
          content: `Analyze this message from a woman: "${message}"\n\nProvide expert dating psychology insights in JSON format.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 400,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    if (!result.hiddenMeaning || !result.recommendedTone || !result.expertTip || !result.patternInterrupt) {
      throw new Error("Invalid analysis format");
    }

    return result;
  } catch (error) {
    console.error("Pattern analysis error:", error);
    throw new Error("Failed to analyze message pattern. Please try again.");
  }
}

export async function generateReplies(
  message: string, 
  tone: "confident" | "funny" | "flirty" | "creative",
  language: "en" | "hi" = "en",
  isPremium: boolean = false
): Promise<GenerateRepliesResponse> {
  // Input validation
  if (!message.trim()) {
    throw new Error("Message cannot be empty");
  }
  
  if (message.length > 500) {
    throw new Error("Message is too long. Please keep it under 500 characters.");
  }

  // Handle creative tone for non-premium users
  if (tone === "creative" && !isPremium) {
    return {
      replies: [
        {
          reply: "Creative tone is a Premium feature. Upgrade to unlock psychology-backed responses that create intrigue and get results.",
          confidence: 0
        }
      ],
      tone: "creative"
    };
  }

  try {
    const tonePrompts = {
      confident: `Generate confident replies using research from dating forums, successful conversation patterns, and attachment theory. Based on analysis of thousands of successful dating app conversations, women respond 73% more to men who show authentic confidence without neediness. Use direct communication, assume attraction, show you have options without being arrogant. Reference real dating coach strategies from "Models" by Mark Manson and "The Confident Man" by Mark Radcliffe. Examples that work: "I respect that energy" or "That's exactly the kind of mindset I'm drawn to."`,
      
      funny: `Generate humorous replies based on comedy psychology research and analysis of viral dating app conversations. Studies show women rate humor as the #1 attractive trait, but it must be intelligent humor, not try-hard jokes. Use observational comedy, playful callbacks to her profile, witty wordplay, and self-deprecating humor that shows confidence. Reference successful comedic patterns from Reddit r/Tinder success stories and "The Humor Code" by McGraw & Warren. Avoid dad jokes or obvious puns.`,
      
      flirty: `Generate flirtatious replies using evolutionary psychology research on attraction triggers and analysis of successful seduction conversations. Women respond to subtle sexual tension, playful teasing, and implied rather than explicit interest. Use push-pull dynamics, create intrigue, reference physical attraction tastefully. Based on "The Art of Seduction" by Robert Greene and real conversation analysis from dating forums. Examples: "I have a feeling you're trouble... the good kind" or "There's something about your energy that's got me curious."`,
      
      creative: isPremium ? `Generate psychology-backed creative replies that use pattern interrupts and unconventional approaches. Based on NLP research, social psychology studies, and analysis of conversations that led to real dates. Use vulnerability as strength, cut through small talk immediately, suggest off-platform communication, ask deeper questions that trigger emotional responses. Reference techniques from "Getting to Yes" by Fisher & Ury and "The Like Switch" by Jack Schafer. Examples: "I'm going to be honest with you, I'm not with all this small talk. If you're down to have a real conversation with substance, text me on [your phone number] and we can arrange a call..." or "Most guys probably ask about your day. I'm more interested in what's driving your ambitions right now."` : `Premium feature required. Upgrade to access creative psychology-backed responses.`
    };

    const languageInstruction = language === "hi" 
      ? "Reply in polite, friendly Hindi using Roman script (Latin letters). Keep it natural, respectful, and charming. Example: 'Aapka message bahut accha laga mujhe 😊'. Maintain the same strategic quality and psychology-backed approach as English responses."
      : "Reply in English.";

    const systemPrompt = `You are an expert dating communication assistant trained on relationship psychology research from leading experts like Dr. John Gottman, Mark Manson's "Models", Robert Greene's "The Art of Seduction", and modern attachment theory. 

${languageInstruction}

Your responses should:

1. Be authentic and natural-sounding
2. Show genuine interest in the conversation
3. Be respectful and appropriate
4. Lead to meaningful connection
5. Use verified psychology principles that increase attraction and engagement
6. Match the requested tone: ${tonePrompts[tone]}

${tone === 'creative' ? `
For CREATIVE tone specifically, draw from these psychology principles:
- Pattern interrupts from NLP to break her routine thinking
- Vulnerability theory showing strength through authenticity  
- Social proof and pre-selection principles
- Moving conversations off-platform to increase investment
- Deep curiosity that triggers emotional responses
- Confidence to cut through surface-level interactions
` : ''}

Generate 3 different reply options to the following message. Each reply should be different in approach but maintain the same tone. For creative responses, include bold moves like suggesting phone calls, asking deeper questions, or playfully challenging small talk. Respond with JSON in this exact format:

{
  "replies": [
    {
      "reply": "Your first reply text here",
      "confidence": 85
    },
    {
      "reply": "Your second reply text here", 
      "confidence": 92
    },
    {
      "reply": "Your third reply text here",
      "confidence": 88
    }
  ],
  "tone": "${tone}"
}

The confidence score should be between 75-95 and represent how likely this reply is to get a positive response based on dating psychology research.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Please generate 3 ${tone} replies to this message: "${message}"`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 800,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    // Validate the response structure
    if (!result.replies || !Array.isArray(result.replies) || result.replies.length !== 3) {
      throw new Error("Invalid response format from OpenAI");
    }
    return result as GenerateRepliesResponse;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error(`Failed to generate replies: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
