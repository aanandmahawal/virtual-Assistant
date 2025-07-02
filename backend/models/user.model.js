import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    assistantName:{
        type:String
    },
     assistantImage:{
        type:String
    },
    history:[
        {type:String}
    ]

},{timestamps:true})

const User=mongoose.model("User",userSchema)
export default User




// Q1. What does this schema represent?
// It defines the structure of a user document in MongoDB.
// Includes name, email, password, assistant info, and history.

// Q2. Why is email marked as unique?
// To prevent duplicate registrations with the same email.
// MongoDB ensures email uniqueness with this constraint.

// Q3. What is the purpose of assistantName and assistantImage?
// They allow users to personalize their AI assistant.
// Stored as strings (text and image URL).

// Q4. How is chat history stored?
// As an array of strings under the history field.
// Each user command is saved for reference.

// Q5. What does {timestamps: true} do?
// Automatically adds createdAt and updatedAt fields.
// Useful for tracking user registration and updates.

// Q6. What does mongoose.model() do here?
// It creates a User model from the defined schema.
// This model is used for database operations.