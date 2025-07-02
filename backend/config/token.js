import jwt from "jsonwebtoken"
const genToken=async (userId)=>{
    try {
        const token = await jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"10d"})
        return token
    } catch (error) {
        console.log(error)
    }
}

export default genToken

// Q1. What does genToken do?
// Generates a JWT for a given user ID with a 10-day expiry.

// Q2. How is the token secured?
// It uses a secret key from .env (JWT_SECRET) for signing.

// Q3. What library is used for token creation?
// jsonwebtoken is used to create and manage the JWT.