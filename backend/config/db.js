import mongoose from "mongoose"

const connectDb=async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("db connected")
    } catch (error) {
        console.log(error)
    }
}

export default connectDb


// Q1. What does connectDb do?
// It connects the backend to MongoDB using Mongoose and logs success.

// Q2. How are DB credentials managed?
// They’re stored in .env and accessed via process.env.MONGODB_URL.