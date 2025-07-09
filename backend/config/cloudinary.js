import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
const uploadOnCloudinary =async (filePath)=>{
     cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });

    try {
        const uploadResult = await cloudinary.uploader
       .upload(filePath)
       fs.unlinkSync(filePath)
       return uploadResult.secure_url
    } catch (error) {
    fs.unlinkSync(filePath)
    return res.status(500).json({message:"cloudinary error"})
    }
}


export default uploadOnCloudinary


// Q1. What does uploadOnCloudinary do?
// It uploads a given file to Cloudinary using the Cloudinary SDK.
// After uploading, it returns the secure image URL.

// Q2. Why use fs.unlinkSync(filePath)?
// It deletes the local temporary file after upload.
// This helps free up server storage and maintain cleanliness.

// Q3. How is Cloudinary configured?
// It’s configured using credentials from environment variables.
// These include cloud_name, api_key, and api_secret.

// Q4. What happens on upload failure?
// The file is still deleted to avoid clutter.
// An error response is attempted using res.status(...).

// Q5. What’s a bug in this code?
// res is used without being defined or passed.
// This will throw an error during upload failure.

// Q6. How can it be improved?
// Use throw new Error() or return a failure object instead.
// Let the calling function handle the error response.

// Q7. Why Cloudinary over others?
// It’s beginner-friendly, with fast integration and free tier.
// Also supports real-time image optimization and CDN hosting.

// Q8. What’s the use in the project?
// Used to store uploaded assistant images on the cloud.
// Each user can personalize their assistant’s appearance.