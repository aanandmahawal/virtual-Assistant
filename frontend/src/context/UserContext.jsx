import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'
export const userDataContext=createContext()
function UserContext({children}) {
    const serverUrl="http://localhost:8000"
    const [userData,setUserData]=useState(null)
    const [frontendImage,setFrontendImage]=useState(null)
     const [backendImage,setBackendImage]=useState(null)
     const [selectedImage,setSelectedImage]=useState(null)
    const handleCurrentUser=async ()=>{
        try {
            const result=await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
            setUserData(result.data)
            console.log(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getGeminiResponse=async (command)=>{
try {
  const result=await axios.post(`${serverUrl}/api/user/asktoassistant`,{command},{withCredentials:true})
  return result.data
} catch (error) {
  console.log(error)
}
    }

    useEffect(()=>{
handleCurrentUser()
    },[])
    const value={
serverUrl,userData,setUserData,backendImage,setBackendImage,frontendImage,setFrontendImage,selectedImage,setSelectedImage,getGeminiResponse
    }
  return (
    <div>
    <userDataContext.Provider value={value}>
      {children}
      </userDataContext.Provider>
    </div>
  )
}

export default UserContext



// Q1. What is the purpose of UserContext?
// It manages user data, image selections, and assistant requests globally.
// Uses React Context to avoid prop drilling.

// Q2. What does handleCurrentUser do?
// Fetches the current user from the backend using JWT from cookies.
// Stores the result in userData state.

// Q3. Why is withCredentials: true used in Axios?
// To send cookies (including JWT) along with the request.
// Required for secure session-based auth.

// Q4. What does getGeminiResponse do?
// Sends a command to the assistant backend and returns the AI response.
// Used for dynamic conversation handling.

// Q5. What image-related states are managed?
// frontendImage, backendImage, and selectedImage.
// They help control how assistant images are uploaded or chosen.

// Q6. Why is useEffect used here?
// To fetch user data on the first render automatically.
// Ensures the app knows who is logged in.

// Q7. What is the role of userDataContext.Provider?
// Wraps children and provides shared state and functions.
// Enables any component to access assistant-related data.

// Q8. Why is createContext() used?
// To define a shared context for user and assistant data.
// It acts as a global store for React components.

// Q9. What is stored in the value object?
// All states and functions used across the app: user, images, responses.
// Passed to the context provider.

// Q10. Where is UserContext typically used?
// Wrapped around the entire app (usually in App.jsx).
// Gives all components access to the same assistant logic.
