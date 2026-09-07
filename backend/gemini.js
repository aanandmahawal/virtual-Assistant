import axios from "axios";

// Google retires Gemini models on a schedule (1.0/1.5 gone, 2.0 gone since
// June 2026, 2.5-flash going in Oct 2026). Instead of hardcoding one model in
// an env URL and breaking at each retirement, we try current models in order
// and remember the first one that works.
const MODELS = [
  "gemini-3.7-flash",
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash",
];
let workingModel = null;

// The API key: prefer a GEMINI_API_KEY env var; otherwise reuse the ?key=
// from the old GEMINI_API_URL so existing deployments need no env change.
const apiKey = () => {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  const m = (process.env.GEMINI_API_URL || "").match(/[?&]key=([^&]+)/);
  return m ? m[1] : null;
};

const endpoint = (model, key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

const geminiResponse = async (command, assistantName, userName) => {
  const key = apiKey();
  if (!key) {
    console.error("Gemini: no API key found (set GEMINI_API_KEY, or keep ?key= in GEMINI_API_URL)");
    return null;
  }

  const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}.
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

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    // Ask Google to return STRICT JSON — no markdown fences, no prose —
    // so the controller's JSON.parse never sees garbage.
    generationConfig: { responseMimeType: "application/json" },
  };

  const candidates = workingModel
    ? [workingModel, ...MODELS.filter((m) => m !== workingModel)]
    : MODELS;

  for (const model of candidates) {
    try {
      const result = await axios.post(endpoint(model, key), body);
      if (workingModel !== model) {
        workingModel = model;
        console.log(`Gemini model in use: ${model}`);
      }
      return result.data.candidates[0].content.parts[0].text;
    } catch (error) {
      const status = error.response?.status;
      const detail = error.response?.data?.error?.message || error.message;
      console.error(`Gemini error (${model}): ${status ?? ""} ${detail}`);
      // 404 / model-retired -> try the next model; anything else (bad key,
      // quota, network) will fail for every model, so stop and report.
      const retired = status === 404 || /not (found|available|supported)/i.test(detail);
      if (!retired) return null;
    }
  }
  console.error("Gemini: every candidate model failed — see errors above.");
  return null;
};

export default geminiResponse;
