import React, { useContext, useState } from 'react'
import bg from "../assets/authBg.png"
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext';
import axios from "axios"
function SignUp() {
  const [showPassword,setShowPassword]=useState(false)
  const {serverUrl,userData,setUserData}=useContext(userDataContext)
  const navigate=useNavigate()
  const [name,setName]=useState("")
  const [email,setEmail]=useState("")
    const [loading,setLoading]=useState(false)
    const [password,setPassword]=useState("")
const [err,setErr]=useState("")
  const handleSignUp=async (e)=>{
    e.preventDefault()
    setErr("")
    setLoading(true)
try {
  let result=await axios.post(`${serverUrl}/api/auth/signup`,{
    name,email,password
  },{withCredentials:true} )
 setUserData(result.data)
  setLoading(false)
  navigate("/customize")
} catch (error) {
  console.log(error)
  setUserData(null)
  setLoading(false)
  setErr(error.response.data.message)
}
    }
  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{backgroundImage:`url(${bg})`}} >
 <form className='w-[90%] h-[600px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px]' onSubmit={handleSignUp}>
<h1 className='text-white text-[30px] font-semibold mb-[30px]'>Register to <span className='text-blue-400'>Virtual Assistant</span></h1>
<input type="text" placeholder='Enter your Name' className='w-full h-[60px] outline-none border-2 border-white bg-transparent  text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]' required onChange={(e)=>setName(e.target.value)} value={name}/>
<input type="email" placeholder='Email' className='w-full h-[60px] outline-none border-2 border-white bg-transparent  text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]' required onChange={(e)=>setEmail(e.target.value)} value={email}/>
<div className='w-full h-[60px] border-2 border-white bg-transparent  text-white rounded-full text-[18px] relative'>
<input type={showPassword?"text":"password"} placeholder='password' className='w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px]' required onChange={(e)=>setPassword(e.target.value)} value={password}/>
{!showPassword && <IoEye className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-[white] cursor-pointer' onClick={()=>setShowPassword(true)}/>}
  {showPassword && <IoEyeOff className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-[white] cursor-pointer' onClick={()=>setShowPassword(false)}/>}
</div>
{err.length>0 && <p className='text-red-500 text-[17px]'>
  *{err}
  </p>}
<button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold  bg-white rounded-full text-[19px] ' disabled={loading}>{loading?"Loading...":"Sign Up"}</button>

<p className='text-[white] text-[18px] cursor-pointer' onClick={()=>navigate("/signin")}>Already have an account ? <span className='text-blue-400'>Sign In</span></p>
 </form>
    </div>
  )
}

export default SignUp




// Q1. What is the main functionality of the SignUp component?
// Handles user registration by collecting name, email, and password.
// Sends data to backend and navigates to the customization screen.

// Q2. How is password visibility managed here?
// State showPassword toggles the input type between "password" and "text".
// Icons <IoEye/> and <IoEyeOff/> are used to toggle visibility.

// Q3. How is form submission handled?
// handleSignUp() is triggered on form submit and sends data using Axios.
// If successful, it stores user data in context and redirects to /customize.

// Q4. What happens after successful signup?
// Backend returns the user and sets a cookie (via withCredentials:true).
// Frontend updates context and navigates to assistant image selection.

// Q5. What validation or error handling exists?
// Backend error messages are caught and displayed using setErr().
// Form inputs are also marked required to prevent empty submissions.

// Q6. What does withCredentials: true do in this Axios call?
// It allows cross-origin cookies (e.g., JWT) to be sent and received securely.
// Required for authentication using HTTP-only cookies.

// Q7. How is UI styling done for the form?
// Uses Tailwind CSS with backdrop blur, rounded inputs, and gradient background.
// Clean and responsive design improves UX.

// Q8. How is navigation handled between SignUp and SignIn?
// useNavigate() from react-router-dom redirects users based on intent.
// Clicking the prompt moves to /signin for existing users.