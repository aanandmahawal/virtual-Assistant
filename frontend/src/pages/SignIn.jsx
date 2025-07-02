import React, { useContext, useState } from 'react'
import bg from "../assets/authBg.png"
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext';
import axios from "axios"
function SignIn() {
  const [showPassword,setShowPassword]=useState(false)
  const {serverUrl,userData,setUserData}=useContext(userDataContext)
  const navigate=useNavigate()
  const [email,setEmail]=useState("")
  const [loading,setLoading]=useState(false)
    const [password,setPassword]=useState("")
const [err,setErr]=useState("")
  const handleSignIn=async (e)=>{
    e.preventDefault()
    setErr("")
    setLoading(true)
try {
  let result=await axios.post(`${serverUrl}/api/auth/signin`,{
   email,password
  },{withCredentials:true} )
 setUserData(result.data)
  setLoading(false)
   navigate("/")
} catch (error) {
  console.log(error)
  setUserData(null)
  setLoading(false)
  setErr(error.response.data.message)
}
    }
  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{backgroundImage:`url(${bg})`}} >
 <form className='w-[90%] h-[600px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px]' onSubmit={handleSignIn}>
<h1 className='text-white text-[30px] font-semibold mb-[30px]'>Sign In to <span className='text-blue-400'>Virtual Assistant</span></h1>

<input type="email" placeholder='Email' className='w-full h-[60px] outline-none border-2 border-white bg-transparent  text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]' required onChange={(e)=>setEmail(e.target.value)} value={email}/>
<div className='w-full h-[60px] border-2 border-white bg-transparent  text-white rounded-full text-[18px] relative'>
<input type={showPassword?"text":"password"} placeholder='password' className='w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px]' required onChange={(e)=>setPassword(e.target.value)} value={password}/>
{!showPassword && <IoEye className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-[white] cursor-pointer' onClick={()=>setShowPassword(true)}/>}
  {showPassword && <IoEyeOff className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-[white] cursor-pointer' onClick={()=>setShowPassword(false)}/>}
</div>
{err.length>0 && <p className='text-red-500 text-[17px]'>
  *{err}
  </p>}
<button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold  bg-white rounded-full text-[19px] ' disabled={loading}>{loading?"Loading...":"Sign In"}</button>

<p className='text-[white] text-[18px] cursor-pointer' onClick={()=>navigate("/signup")}>Want to create a new account ? <span className='text-blue-400'>Sign Up</span></p>
 </form>
    </div>
  )
}

export default SignIn





// Q1. What is the role of the SignIn component?
// Handles user login functionality using email and password.
// It authenticates via backend API and updates user context.

// Q2. How does the password visibility toggle work?
// It uses useState(showPassword) and conditionally renders <IoEye/> or <IoEyeOff/>.
// The type of input switches between password and text.

// Q3. How is form submission handled?
// The handleSignIn function is triggered on form submit.
// It sends login data to the backend using Axios and handles loading/error states.

// Q4. What happens after a successful login?
// User data is stored in context, and the user is redirected to the homepage.
// Also, JWT cookie is set via backend response (handled with withCredentials: true).

// Q5. What if login fails?
// Error message is extracted from backend and shown using setErr().
// User data is reset and loading is stopped.

// Q6. What does withCredentials: true do in Axios?
// It ensures cookies (like JWT) are included in requests.
// This allows backend session validation.

// Q7. How is UI designed for the form?
// Styled using Tailwind CSS with a blurred background image and rounded input fields.
// Responsively centers the login form and adapts on mobile.

// Q8. How is navigation handled?
// useNavigate from react-router-dom redirects to /signup or / (home).
// Ensures smooth transitions between routes on user actions.

