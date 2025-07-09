import multer from "multer"

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./public")
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})

const upload=multer({storage})
export default upload


// Q1. What does this Multer setup do?
// It handles file uploads and stores them in the /public folder.
// Multer processes incoming multipart/form-data.

// Q2. How are uploaded files named?
// They’re saved with their original names using file.originalname.
// This keeps the filename unchanged during upload.

// Q3. Why use multer.diskStorage?
// To control both the upload destination and filename.
// It gives flexibility over file handling on the server.

// Q4. Where is this upload used in the project?
// In routes like assistant update for uploading images.
// It works with Cloudinary for file hosting.