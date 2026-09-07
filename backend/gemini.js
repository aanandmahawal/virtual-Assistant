import axios from "axios";

// ── Provider strategy ───────────────────────────────────────────────
// If GROQ_API_KEY is set, use Groq (fastest — typically well under a
// second for this small JSON-intent task). Otherwise fall back to
// Gemini, tuned for lowest latency (lite model first, thinking off).

const GROQ_MODELS = ["llama-3.1-8b-instant", "llama-3.3-70b-versatile"];
const GEMINI_MODELS = [
  "gemini-3.1-flash-lite",   // lite = lowest latency
  "gemini-3.7-flash",
  "gemini-3.5-flash",
  "gemini-2.5-flash",
];
let workingGroq = null;
let workingGemini = null;

const geminiKey = () => {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  const m = (process.env.GEMINI_API_URL || "").match(/[?&]key=([^&]+)/);
  return m ? m[1] : null;
};

const buildPrompt = (command, assistantName, userName) => `You are a virtual assistant named ${assistantName} created by ${userName}.
You are not Google. You will now behave like a voice-enabled assistant.

Your task is to understand the user's natural language input and respond with a JSON object like this:

{
  "type": "general" | "google-search" | "youtube-search" | "youtube-play" | "get-time" | "get-date" | "get-day" | "get-month"|"calculator-open" | "instagram-open" |"facebook-open" |"weather-show",
  "userInput": "<original user input>" {only remove your name from userinput if exists} and agar kisi ne google ya youtube pe kuch search karne ko bola hai to userInput me only bo search baala text jaye,
  "response": "<a short spoken response to read out loud to the user>"
}

Instructions:
- "type": determine the intent of the user.
- "userinput": original sentence the user spoke.
- "response": A short voice-friendly reply, e.g., "Sure, playing it now", "Here's what I found", "Today is Tuesday", etc.

Type meanings:
- "general": if it's a factual or informational question. aur agar koi aisa question puchta hai jiska answer tume pata hai usko bhi general ki category me rakho bas short answer dena
- "google-search": if user wants to search something on Google.
- "youtube-search": if user wants to search something on YouTube.
- "youtube-play": if user wants to directly play a video or song.
- "calculator-open": if user wants to open a calculator.
- "instagram-open": if user wants to open Instagram.
- "facebook-open": if user wants to open Facebook.
- "weather-show": if user wants to know weather.
- "get-time": if user asks for current time.
- "get-date": if user asks for today's date.
- "get-day": if user asks what day it is.
- "get-month": if user asks for the current month.

Important:
- Use ${userName} agar koi puche tume kisne banaya
- Only respond with the JSON object, nothing else.

now your userInput- ${command}
`;

// ── Groq (OpenAI-compatible endpoint, JSON mode) ────────────────────
const askGroq = async (prompt) => {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;
  const models = workingGroq
    ? [workingGroq, ...GROQ_MODELS.filter((m) => m !== workingGroq)]
    : GROQ_MODELS;
  for (const model of models) {
    try {
      const r = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model,
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.3,
        },
        { headers: { Authorization: `Bearer ${key}` }, timeout: 20000 }
      );
      if (workingGroq !== model) {
        workingGroq = model;
        console.log(`Assistant brain: Groq ${model}`);
      }
      return r.data.choices[0].message.content;
    } catch (error) {
      const status = error.response?.status;
      const detail = error.response?.data?.error?.message || error.message;
      console.error(`Groq error (${model}): ${status ?? ""} ${detail}`);
      const retired = status === 404 || /decommission|not found/i.test(detail);
      if (!retired) return null; // key/quota problem: Gemini fallback takes over
    }
  }
  return null;
};

// ── Gemini fallback (lite-first, thinking disabled where supported) ─
const askGemini = async (prompt) => {
  const key = geminiKey();
  if (!key) return null;
  const models = workingGemini
    ? [workingGemini, ...GEMINI_MODELS.filter((m) => m !== workingGemini)]
    : GEMINI_MODELS;
  for (const model of models) {
    // First try with internal "thinking" turned off (big latency win on
    // models that accept it); if the model rejects that field, retry plain.
    for (const cfg of [
      { responseMimeType: "application/json", thinkingConfig: { thinkingBudget: 0 } },
      { responseMimeType: "application/json" },
    ]) {
      try {
        const r = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
          { contents: [{ parts: [{ text: prompt }] }], generationConfig: cfg },
          { timeout: 30000 }
        );
        if (workingGemini !== model) {
          workingGemini = model;
          console.log(`Assistant brain: Gemini ${model}`);
        }
        return r.data.candidates[0].content.parts[0].text;
      } catch (error) {
        const status = error.response?.status;
        const detail = error.response?.data?.error?.message || error.message;
        console.error(`Gemini error (${model}): ${status ?? ""} ${detail}`);
        if (status === 400 && /thinking/i.test(detail)) continue; // retry plain
        const retired = status === 404 || /not (found|available|supported)/i.test(detail);
        if (retired) break;      // next model
        return null;             // key/quota/network: stop
      }
    }
  }
  return null;
};

const geminiResponse = async (command, assistantName, userName) => {
  const prompt = buildPrompt(command, assistantName, userName);
  return (await askGroq(prompt)) ?? (await askGemini(prompt));
};

export default geminiResponse;
