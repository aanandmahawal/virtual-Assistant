import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";

// Load environment variables from .env
dotenv.config();

// Initialize express app
const app = express();
const port = process.env.PORT || 8000;

// Middleware to allow cross-origin requests from frontend
app.use(cors({
  origin: "https://virtual-assistant-0dz3.onrender.com",
  credentials: true
}));

// JSON parser and cookie parser middleware
app.use(express.json());
app.use(cookieParser());

// Route middlewares
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Start server
app.listen(port, () => {
  connectDb(); // Connect to MongoDB
  console.log(` Server running on http://localhost:${port}`);
});




// Q1. What does this file do?
// Bootstraps the Express server, connects MongoDB, and sets up routes.
// It also configures middleware like CORS and cookie parsing.

// Q2. Why is dotenv.config() used?
// To load environment variables from the .env file.
// This keeps sensitive info like DB URLs and API keys secure.

// Q3. What is the purpose of connectDb()?
// It establishes a connection to MongoDB.
// Called once when the server starts listening.

// Q4. Why is express.json() used?
// To parse incoming JSON payloads in requests.
// Essential for handling form and API data in POST requests.

// Q5. What does cookieParser() do?
// Parses cookies from incoming HTTP requests.
// Required for reading JWTs stored in cookies.

// Q6. How is CORS configured here?
// It allows requests from http://localhost:5173 with credentials.
// This enables secure cross-origin communication between frontend and backend.

// Q7. What routes are configured?
// /api/auth handles auth-related endpoints, /api/user for user functions.
// Each is delegated to its respective router file.

// Q8. What does app.listen() do?
// Starts the server on the defined port.
// It also logs a message once the server is running.

// Q9. What happens if process.env.PORT is undefined?
// The app defaults to port 5050.
// Ensures the server still starts without a custom port.

// Q10. Why separate routers like authRouter and userRouter?
// Improves modularity and keeps route logic clean.
// Each feature area is managed in its own file.
