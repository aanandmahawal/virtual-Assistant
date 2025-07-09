import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Customize from './pages/Customize'
import { userDataContext } from './context/UserContext'
import Home from './pages/Home'
import Customize2 from './pages/Customize2'

function App() {
  const {userData,setUserData}=useContext(userDataContext)
  return (
   <Routes>
     <Route path='/' element={(userData?.assistantImage && userData?.assistantName)? <Home/> :<Navigate to={"/customize"}/>}/>
    <Route path='/signup' element={!userData?<SignUp/>:<Navigate to={"/"}/>}/>
     <Route path='/signin' element={!userData?<SignIn/>:<Navigate to={"/"}/>}/>
      <Route path='/customize' element={userData?<Customize/>:<Navigate to={"/signup"}/>}/>
       <Route path='/customize2' element={userData?<Customize2/>:<Navigate to={"/signup"}/>}/>
   </Routes>
  )
}

export default App


// Q1. What is the role of the App component?
// It handles route rendering using react-router-dom.
// Access is restricted based on userData from global context.

// Q2. How is user authentication status used in routing?
// Routes are conditionally rendered using Navigate.
// If userData is missing or incomplete, users are redirected accordingly.

// Q3. How is protected routing handled for the home page (/)?
// If the user has both assistantImage and assistantName, they access <Home/>.
// Otherwise, they're redirected to the assistant customization flow.

// Q4. What happens if a logged-in user tries to access /signup or /signin?
// They're redirected to / (home) to prevent redundant access.
// This avoids login/register pages being shown to authenticated users.

// Q5. What is the fallback behavior for unauthorized access to /customize or /customize2?
// Unauthenticated users are redirected to /signup.
// This ensures only registered users can customize the assistant.

// Q6. How does the app differentiate between full and partial authentication?
// userData must exist for customization, and have both assistantName & assistantImage to access Home.
// This enforces a step-by-step onboarding flow.

// Q7. Why is userDataContext used here?
// It provides centralized access to authentication and assistant state.
// Ensures routing decisions are consistent across the app.

// Q8. Why is Routes used instead of Switch?
// React Router v6+ uses Routes for route definitions.
// element replaces the older component prop, and it supports JSX directly.

