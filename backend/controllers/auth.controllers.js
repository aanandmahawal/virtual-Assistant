import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
export const signUp=async (req,res)=>{
try {
    const {name,email,password}=req.body

    const existEmail=await User.findOne({email})
    if(existEmail){
        return res.status(400).json({message:"email already exists !"})
    }
    if(password.length<6){
        return res.status(400).json({message:"password must be at least 6 characters !"})
    }

    const hashedPassword=await bcrypt.hash(password,10)

    const user=await User.create({
        name,password:hashedPassword,email
    })

    const token=await genToken(user._id)

    res.cookie("token",token,{
        httpOnly:true,
       maxAge:7*24*60*60*1000,
       sameSite:"None",
       secure:true
    })

    return res.status(201).json(user)

} catch (error) {
       return res.status(500).json({message:`sign up error ${error}`})
}
}

export const Login=async (req,res)=>{
try {
    const {email,password}=req.body

    const user=await User.findOne({email})
    if(!user){
        return res.status(400).json({message:"email does not exists !"})
    }
   const isMatch=await bcrypt.compare(password,user.password)

   if(!isMatch){
   return res.status(400).json({message:"incorrect password"})
   }

    const token=await genToken(user._id)

    res.cookie("token",token,{
        httpOnly:true,
       maxAge:7*24*60*60*1000,
       sameSite:"None",
       secure:true
    })

    return res.status(200).json(user)

} catch (error) {
       return res.status(500).json({message:`login error ${error}`})
}
}

export const logOut=async (req,res)=>{
    try {
        res.clearCookie("token")
         return res.status(200).json({message:"log out successfully"})
    } catch (error) {
         return res.status(500).json({message:`logout error ${error}`})
    }
}
        


// Q1. What does the signUp function handle?
// Registers a new user after email and password checks.
// Hashes the password and sets a secure cookie with a JWT.

// Q2. How is duplicate email handled during signup?
// Checks with User.findOne({email}).
// Returns 400 if email already exists.

// Q3. Why is password length validated?
// To ensure basic security, it must be at least 6 characters.
// If not, a 400 response is returned.

// Q4. Why use bcrypt.hash during signup?
// To store passwords in hashed form for security.
// Prevents leaking plain text credentials if DB is compromised.

// Q5. What’s stored in the JWT token?
// Only the user’s _id is signed into the token.
// This keeps the payload minimal and secure.

// Q6. How is the token sent to the frontend?
// Using res.cookie("token", token, { ... }).
// Stored as an HTTP-only cookie to prevent XSS attacks.

// Q7. What does sameSite: "strict" do in cookies?
// Prevents the browser from sending the cookie cross-site.
// Helps in protecting against CSRF attacks.

// Q8. What does the Login function validate?
// Checks if the email exists and password matches.
// If valid, it returns the user and a new token.

// Q9. How does bcrypt.compare work in login?
// It compares raw and hashed passwords.
// Returns true only if both match.

// Q10. What happens if login credentials are invalid?
// Returns a 400 with either "email does not exist" or "incorrect password".
// Prevents unauthorized access.

// Q11. What does logOut do?
// It clears the "token" cookie from the browser.
// Logs the user out securely by invalidating the session.

// Q12. How is error handling managed across all three?
// Using try-catch with consistent 500 error responses.
// Each function catches and reports backend issues cleanly.

