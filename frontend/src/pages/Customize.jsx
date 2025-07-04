import React, { useContext, useRef, useState } from 'react';
import Card from '../components/Card';
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import { RiImageAddLine } from "react-icons/ri";
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { MdKeyboardBackspace } from "react-icons/md";

function Customize() {
  const {
    serverUrl,
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage
  } = useContext(userDataContext);

  const navigate = useNavigate();
  const inputImage = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  return (
    <div className='w-full min-h-screen bg-gradient-to-t from-black to-[#030353] flex flex-col items-center justify-start p-[20px] overflow-hidden relative'>

      {/* Back Button */}
      <MdKeyboardBackspace
        className='absolute top-[20px] left-[20px] text-white cursor-pointer w-[25px] h-[25px]'
        onClick={() => navigate("/")}
      />

      {/* Title */}
  <h1 className='text-white mb-[20px] text-[25px] text-center'>
  Select your <span className='text-blue-200'>Assistant Image</span>
</h1>

      {/* Image Card Container */}
      <div className='w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[10px] mt-[10px]'>
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />

        {/* Upload Image Option */}
        <div
          className={`w-[60px] h-[35px] lg:w-[120px] lg:h-[200px] bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden 
          hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white 
          flex items-center justify-center 
          ${selectedImage === "input" ? "border-4 border-white shadow-2xl shadow-blue-950" : ""}`}
          onClick={() => {
            inputImage.current.click();
            setSelectedImage("input");
          }}
        >
          {!frontendImage && <RiImageAddLine className='text-white w-[25px] h-[25px]' />}
          {frontendImage && <img src={frontendImage} className='h-full object-cover' alt="Preview" />}
        </div>
        <input
          type="file"
          accept='image/*'
          ref={inputImage}
          hidden
          onChange={handleImage}
        />
      </div>

      {/* Next Button Fixed at Bottom */}
      {selectedImage && (
        <button
          className='min-w-[120px] h-[35px] text-black font-semibold bg-white rounded-full text-[16px] fixed bottom-[20px] z-10'
          onClick={() => navigate("/customize2")}
        >
          Next
        </button>
      )}
    </div>
  );
}

export default Customize;





// 🔹 Q1. What is the purpose of the Customize component?
// Answer:
// It allows users to select or upload an image to customize their virtual assistant's appearance.
// This is the first step in personalizing the assistant experience.

// 🔹 Q2. How does image selection work in this component?
// Answer:
// Predefined images are displayed using <Card> components, and an upload box allows image input.
// The selected image is tracked using the selectedImage state.

// 🔹 Q3. How is uploaded image preview implemented?
// Answer:
// The selected image file is read with URL.createObjectURL() and stored in frontendImage.
// It’s conditionally rendered as an <img> inside the upload card.

// 🔹 Q4. What is the role of inputImage.current.click()?
// Answer:
// It programmatically triggers the hidden file input when the upload area is clicked.
// This provides a custom UI instead of the default file picker.

// 🔹 Q5. What is the use of useRef() in this component?
// Answer:
// useRef() stores the reference to the hidden file input for programmatic access.
// This enables manual triggering without relying on DOM IDs.

// 🔹 Q6. How is global image state handled?
// Answer:
// The userDataContext provides backendImage, frontendImage, and related setters.
// This ensures the selected image persists across routes.

// 🔹 Q7. When does the “Next” button appear?
// Answer:
// Only when selectedImage has a value, indicating that the user has chosen or uploaded an image.
// It conditionally renders at the bottom for clean UX.

// 🔹 Q8. How would you improve UX or accessibility of this component?
// Answer:
// Add ARIA labels, keyboard navigation for image selection, and file validation on upload.
// Also, add feedback for unsupported formats or file size limits.

// 🔹 Q9. What styling libraries or tools are used here?
// Answer:
// Tailwind CSS is used for responsive design, hover effects, and utility-based styling.
// This results in a compact yet visually appealing layout.
