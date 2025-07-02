import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
function Customize2() {
    const {userData,backendImage,selectedImage,serverUrl,setUserData}=useContext(userDataContext)
    const [assistantName,setAssistantName]=useState(userData?.AssistantName || "")
    const [loading,setLoading]=useState(false)
    const navigate=useNavigate()

    const handleUpdateAssistant=async ()=>{
        setLoading(true)
        try {
            let formData=new FormData()
            formData.append("assistantName",assistantName)
            if(backendImage){
                 formData.append("assistantImage",backendImage)
            }else{
                formData.append("imageUrl",selectedImage)
            }
            const result=await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true})
setLoading(false)
            console.log(result.data)
            setUserData(result.data)
            navigate("/")
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] relative '>
        <MdKeyboardBackspace className='absolute top-[30px] left-[30px] text-white cursor-pointer w-[25px] h-[25px]' onClick={()=>navigate("/customize")}/>
      <h1 className='text-white mb-[40px] text-[30px] text-center '>Enter Your <span className='text-blue-200'>Assistant Name</span> </h1>
      <input type="text" placeholder='eg. shifra' className='w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent  text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]' required onChange={(e)=>setAssistantName(e.target.value)} value={assistantName}/>
      {assistantName &&  <button className='min-w-[300px] h-[60px] mt-[30px] text-black font-semibold cursor-pointer  bg-white rounded-full text-[19px] ' disabled={loading} onClick={()=>{
        handleUpdateAssistant()
    }
        } >{!loading?"Finally Create Your Assistant":"Loading..."}</button>}
     
    </div>
  )
}

export default Customize2




// Q1. What is the main purpose of Customize2?
// Allows the user to name their assistant and finalize setup.
// Sends the name and image to the backend.

// Q2. How is assistant data submitted?
// Using FormData, which supports file uploads.
// Sent via a POST request with axios.

// Q3. What happens when handleUpdateAssistant() runs?
// Sends selected image and name to the backend /update API.
// Updates the user context with the new data.

// Q4. Why is withCredentials: true important here?
// Ensures JWT cookie is sent for authentication.
// Required to authorize the update request.

// Q5. What is the role of backendImage and selectedImage?
// backendImage is for uploaded images, selectedImage for defaults.
// Only one of them is sent depending on the user's choice.

// Q6. How is navigation handled?
// On success, navigate("/") redirects the user to the homepage.
// Also includes a back button to /customize.

// Q7. Why use useState for assistantName and loading?
// To manage user input and button loading state.
// Improves user experience during async calls.

// Q8. What is FormData.append() used for?
// To attach text and files in the same request body.
// Ideal for multipart/form-data submissions.

// Q9. What visual feedback is shown during loading?
// The button text changes to "Loading..." when submitting.
// Also disables the button to prevent duplicate submissions.

// Q10. What happens after a successful assistant update?
// User data is updated, and the user is redirected home.
// They can now interact with their personalized assistant.