import express from "express"
import { Login, logOut, signUp } from "../controllers/auth.controllers.js"

const authRouter=express.Router()

authRouter.post("/signup",signUp)
authRouter.post("/signin",Login)
authRouter.get("/logout",logOut)
export default authRouter


// Q1. What does this router handle?
// Handles /signup, /signin, and /logout routes.
// Each maps to its respective controller function.

// Q2. Why is express.Router() used?
// To modularize route definitions for better structure.
// Keeps auth-related endpoints separate and organized.

// Q3. What HTTP methods are used and why?
// POST for signup/signin (sending data), GET for logout.
// Aligns with REST API conventions.