import express from "express"
import { askToAssistant, getCurrentUser, updateAssistant } from "../controllers/user.controllers.js"
import isAuth from "../middlewares/isAuth.js"
import upload from "../middlewares/multer.js"

const userRouter=express.Router()

userRouter.get("/current",isAuth,getCurrentUser)
userRouter.post("/update",isAuth,upload.single("assistantImage"),updateAssistant)
userRouter.post("/asktoassistant",isAuth,askToAssistant)

export default userRouter



// Q1. What does userRouter handle?
// Routes for getting user info, updating assistant, and asking the AI.
// All routes require authentication.

// Q2. What is the role of isAuth in these routes?
// It protects routes by verifying the user’s JWT token.
// Ensures only logged-in users can access them.

// Q3. How is image upload handled in /update route?
// Uses upload.single("assistantImage") with Multer middleware.
// Uploads and processes the assistant image.

// Q4. What does /asktoassistant route do?
// Sends a user’s command to Gemini AI and returns the response.
// Also logs the command to user history.

// Q5. Why use express.Router() here?
// It modularizes user-specific routes for clarity.
// Improves scalability and code organization.