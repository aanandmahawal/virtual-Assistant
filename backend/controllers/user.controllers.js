import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import User from "../models/user.model.js";
import moment from "moment";

//  Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Server error while fetching user" });
  }
};

//  Update assistant name + image
export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;

    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage },
      { new: true }
    ).select("-password");

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: "Error updating assistant" });
  }
};

//  Ask Gemini assistant
export const askToAssistant = async (req, res) => {
  try {
    const { command, assistantName, userName } = req.body;

    // Validation
    if (!command || !assistantName || !userName) {
      return res.status(400).json({ response: "Missing required fields" });
    }

    // User check
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ response: "User not found" });
    }

    // Save history
    user.history.push(command);
    await user.save();

    // Call Gemini
    const result = await geminiResponse(command, assistantName, userName);
    const jsonMatch = result?.match(/{[\s\S]*}/);

    if (!jsonMatch) {
      return res.status(400).json({ response: "Sorry, I can't understand." });
    }

    let gemResult;
    try {
      gemResult = JSON.parse(jsonMatch[0]);
    } catch (err) {
      return res.status(400).json({ response: "Gemini returned malformed JSON." });
    }

    const { type, userInput, response } = gemResult;

    // Handle basic commands
    switch (type) {
      case "get-date":
        return res.json({ type, userInput, response: ` Current date is ${moment().format("YYYY-MM-DD")}` });
      case "get-time":
        return res.json({ type, userInput, response: ` Current time is ${moment().format("hh:mm A")}` });
      case "get-day":
        return res.json({ type, userInput, response: ` Today is ${moment().format("dddd")}` });
      case "get-month":
        return res.json({ type, userInput, response: ` Current month is ${moment().format("MMMM")}` });

      // Handle external or generic commands
      case "google-search":
      case "youtube-search":
      case "youtube-play":
      case "general":
      case "calculator-open":
      case "instagram-open":
      case "facebook-open":
      case "weather-show":
        return res.json({ type, userInput, response });

      default:
        return res.status(400).json({ response: "I didn't understand that command." });
    }
  } catch (error) {
    console.error("Gemini Assistant Error:", error.message);
    return res.status(500).json({ response: "Internal server error while processing your question." });
  }
};




// Q1. What does getCurrentUser do?
// Fetches the logged-in user by ID and excludes the password.
// Returns user info if found, else sends 400 error.

// Q2. Why is .select("-password") used in user queries?
// It hides the password field from being returned.
// This improves security in API responses.

// Q3. What does updateAssistant handle?
// Updates the assistant’s name and image for a user.
// It accepts a file upload or image URL.

// Q4. How is the image uploaded in updateAssistant?
// If a file exists, it's uploaded to Cloudinary.
// Else, the image URL from the frontend is used directly.

// Q5. What does {new:true} do in findByIdAndUpdate?
// It returns the updated document after the update.
// Without it, Mongoose returns the old version.

// Q6. What is the use of askToAssistant?
// It sends the user's command to Gemini and handles the response.
// The command is also stored in the user's history.

// Q7. How is the assistant personalized?
// Gemini gets both assistantName and userName from DB.
// Responses feel more personal and user-specific.

// Q8. How are Gemini results parsed?
// Regex extracts the JSON part from the Gemini reply.
// Then it’s parsed using JSON.parse().

// Q9. What if Gemini's response is invalid or not JSON?
// It returns a 400 error with "sorry, I can't understand".
// This prevents breaking the frontend on malformed replies.

// Q10. How are different commands handled?
// Using a switch-case on gemResult.type.
// Each case returns a structured response for voice output.

// Q11. Why is moment used in some responses?
// To format date, time, day, and month dynamically.
// Provides real-time accurate info to the assistant.

// Q12. What happens for unknown commands?
// Default case returns a 400 with a fallback message.
// Ensures the assistant never crashes or returns blank.
