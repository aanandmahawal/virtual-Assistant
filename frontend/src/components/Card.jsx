import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext'

function Card({image}) {
      const {serverUrl,userData,setUserData,backendImage,setBackendImage,frontendImage,setFrontendImage,selectedImage,setSelectedImage}=useContext(userDataContext)
  return (
    <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white ${selectedImage==image?"border-4 border-white shadow-2xl shadow-blue-950 ":null}`} onClick={()=>{
        setSelectedImage(image)
        setBackendImage(null)
        setFrontendImage(null)
        }}>
      <img src={image} className='h-full object-cover'  />
    </div>
  )
}

export default Card



// Q1. What does this Card component do?
// Displays an image card that can be selected as the assistant's avatar.
// Highlights the selected image visually using conditional styling.

// Q2. What is userDataContext used for?
// Provides shared state like image selection and URLs via React Context.
// Allows state updates without prop drilling.

// Q3. What happens on clicking a card?
// It sets the clicked image as selectedImage and resets backend/frontend images.
// This helps track user image preference.

// Q4. How is dynamic styling handled?
// Uses a template string with conditional classes for active cards.
// If selected, extra borders and shadows are applied.

// Q5. Why is object-cover used on the image?
// Ensures the image covers the entire card without distortion.
// Maintains visual consistency.

// Q6. How does this component support personalization?
// Lets users visually pick their assistant image.
// Part of a customizable user experience.
