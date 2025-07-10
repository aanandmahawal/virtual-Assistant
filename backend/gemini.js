import axios from "axios";
import User from "./models/user.model.js"; // You'll need to import this if moved logic here

const geminiResponse = async (command, assistantName, userName) => {
  try {
    const apiUrl = process.env.GEMINI_API_URL;

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

    const result = await axios.post(apiUrl, {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    });

    return result.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.log("Gemini error:", error);
    return null;
  }
};

export default geminiResponse;








// Q1. What does the geminiResponse function do?
// It sends a user command to the Gemini API using Axios.
// Returns a structured JSON response based on the prompt.

// Q2. How is the prompt customized?
// Includes the assistant’s name and the user’s name.
// Personalizes the assistant’s behavior and replies.

// Q3. What kind of response is expected from Gemini?
// A JSON with fields: type, userInput, and response.
// This structure is used to guide assistant behavior.

// Q4. What types of commands does it handle?
// Time/date/day/month, general Q&A, searches, and app openings.
// Also includes categories like YouTube, Google, and weather.

// Q5. Why is axios.post() used here?
// To send the prompt to Gemini’s API endpoint.
// It posts JSON data and waits for a structured response.

// Q6. How is the response extracted from Gemini?
// It accesses result.data.candidates[0].content.parts[0].text.
// That’s where the JSON response is stored.

// Q7. What is process.env.GEMINI_API_URL used for?
// Stores the API endpoint in a secure .env file.
// Prevents hardcoding and allows easy config changes.

// Q8. How does this function affect the assistant’s behavior?
// It defines the assistant’s logic, voice replies, and intent detection.
// Core of how the assistant “thinks” and responds.
