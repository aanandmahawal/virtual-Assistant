import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"
import UserContext from './context/UserContext.jsx'
createRoot(document.getElementById('root')).render(
<BrowserRouter>
<UserContext>
    <App />
  </UserContext>
  </BrowserRouter>
 
)


// Q1. What does createRoot do in this file?
// It initializes the React 18 root using the new concurrent rendering API from react-dom/client.
// Replaces ReactDOM.render() used in earlier versions.

// Q2. Why is <BrowserRouter> wrapped around the app?
// To enable client-side routing via react-router-dom.
// It tracks the URL and renders routes declared in <Routes>.

// Q3. What is the purpose of <UserContext> here?
// It provides global state (like userData, serverUrl, etc.) to the entire app using React's Context API.
// All components can access this shared state using useContext.

// Q4. Why is StrictMode not included? Should it be?
// It’s optional but recommended. It helps identify potential problems in development like side-effect misuse or deprecated APIs.
// Adding <StrictMode> would wrap the app.

// Q5. Why is the order of wrappers (BrowserRouter > UserContext > App) important?
// Because routing (useNavigate, etc.) must be accessible inside context logic (like login redirects).
// UserContext depends on router functions, so it must be inside BrowserRouter.

