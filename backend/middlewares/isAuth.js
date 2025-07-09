import jwt from "jsonwebtoken"
const isAuth=async (req,res,next)=>{
    try {
        const token=req.cookies.token
        if(!token){
            return res.status(400).json({message:"token not found"})
        }
        const verifyToken=await jwt.verify(token,process.env.JWT_SECRET)
        req.userId=verifyToken.userId

        next()

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"is Auth error"})
    }
}

export default isAuth



// Q1. What is the purpose of isAuth middleware?
// To verify if the user has a valid JWT token in cookies.
// If valid, it attaches the user ID to the request.

// Q2. How is the token extracted?
// From req.cookies.token, which is set during login/signup.
// This enables persistent session-based authentication.

// Q3. What does jwt.verify do?
// It decodes and validates the JWT using the secret key.
// Returns the payload if the token is valid.

// Q4. What happens if the token is missing?
// A 400 response is sent with "token not found".
// This stops unauthorized access early.

// Q5. What is req.userId used for?
// Stores the verified user’s ID for downstream access.
// Controllers use it to fetch or update user data.

// Q6. How does isAuth protect routes?
// It runs before protected routes as middleware.
// Only verified users proceed to the route logic.