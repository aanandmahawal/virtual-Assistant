import React, { useContext, useEffect, useRef, useState } from 'react';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import aiImg from "../assets/ai.gif";
import userImg from "../assets/user.gif";
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);
  const navigate = useNavigate();

  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [ham, setHam] = useState(false);
  const [mode, setMode] = useState(null);
  const isSpeakingRef = useRef(false);
  const isRecognizingRef = useRef(false);
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if (hindiVoice) utterance.voice = hindiVoice;

    isSpeakingRef.current = true;
    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      if (mode === 'mic') {
        setTimeout(() => startRecognition(), 800);
      }
    };

    synth.cancel();
    synth.speak(utterance);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    const openUrl = (url) => window.open(url, '_blank');

    switch (type) {
      case 'google-search':
        openUrl(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`);
        break;
      case 'calculator-open':
        openUrl(`https://www.google.com/search?q=calculator`);
        break;
      case 'instagram-open':
        openUrl(`https://www.instagram.com/`);
        break;
      case 'facebook-open':
        openUrl(`https://www.facebook.com/`);
        break;
      case 'weather-show':
        openUrl(`https://www.google.com/search?q=weather`);
        break;
      case 'youtube-search':
      case 'youtube-play':
        openUrl(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`);
        break;
      default:
        break;
    }
  };

  const startRecognition = () => {
    if (mode !== 'mic') return;
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
      } catch (error) {
        if (error.name !== "InvalidStateError") console.error("Start error:", error);
      }
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (!isSpeakingRef.current && mode === 'mic') {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (e) {
            if (e.name !== "InvalidStateError") console.error(e);
          }
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && !isSpeakingRef.current && mode === 'mic') {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (e) {
            if (e.name !== "InvalidStateError") console.error(e);
          }
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setAiText("");
        setUserText(transcript);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);
        const data = await getGeminiResponse(transcript);
        handleCommand(data);
        setAiText(data.response);
        setUserText("");
      }
    };

    return () => {
      recognition.stop();
    };
  }, [mode]);

  const handleTextAsk = async () => {
    if (!userText.trim()) return;
    const data = await getGeminiResponse(userText);
    handleCommand(data);
    setAiText(data.response);
    setUserText('');
  };

  const startMicMode = () => {
    setMode('mic');
    setUserText('');
    setAiText('');
    startRecognition();
    speak(`Hello ${userData.name}, I'm listening.`);
  };

  const startTypingMode = () => {
    setMode('typing');
    recognitionRef.current?.stop();
    setListening(false);
    setUserText('');
    setAiText('');
  };

  return (
    <div className='min-h-[100vh] w-full bg-gradient-to-t from-black to-[#02023d] flex flex-col justify-between items-center pt-8 pb-24 relative overflow-hidden'>

      {/* Sidebar */}
      <CgMenuRight className='lg:hidden text-white absolute top-5 right-5 w-6 h-6' onClick={() => setHam(true)} />
      <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-5 flex flex-col gap-4 items-start ${ham ? "translate-x-0" : "translate-x-full"} transition-transform`}>
        <RxCross1 className='text-white absolute top-5 right-5 w-6 h-6' onClick={() => setHam(false)} />
        <button className='bg-white text-black rounded-full px-6 py-3 font-semibold' onClick={handleLogOut}>Log Out</button>
        <button className='bg-white text-black rounded-full px-6 py-3 font-semibold' onClick={() => navigate("/customize")}>Customize your Assistant</button>
        <div className='w-full h-[2px] bg-gray-400'></div>
        <h1 className='text-white font-semibold text-lg'>History</h1>
        <div className='w-full h-[400px] overflow-y-auto flex flex-col gap-2'>
          {userData.history?.map((his, i) => (
            <div key={i} className='text-gray-200 text-[18px]'>{his}</div>
          ))}
        </div>
      </div>

      {/* Top Controls */}
      <button className='hidden lg:block absolute top-5 right-5 bg-white text-black font-semibold px-6 py-3 rounded-full' onClick={handleLogOut}>Log Out</button>
      <button className='hidden lg:block absolute top-[100px] right-5 bg-white text-black font-semibold px-6 py-3 rounded-full' onClick={() => navigate("/customize")}>Customize Assistant</button>

      {/* Assistant Section */}
      <div className='flex flex-col items-center gap-3'>
        <div className='w-[180px] h-[240px] flex justify-center items-center overflow-hidden rounded-3xl shadow-lg'>
          <img src={userData?.assistantImage} alt="Assistant" className='h-full w-full object-cover' />
        </div>
        <h1 className='text-white text-[16px] font-semibold'>I'm {userData?.assistantName}</h1>

        {!aiText && <img src={userImg} alt="User" className='w-[120px]' />}
        {aiText && <img src={aiImg} alt="AI" className='w-[120px]' />}
        <h1 className='text-white text-[16px] font-medium text-center max-w-[90%]'>{userText || aiText || null}</h1>
      </div>

      {/* Mode Buttons */}
      {mode !== 'typing' && (
        <div className='flex gap-4 mt-4 mb-10'>
          <button className='bg-white text-black px-6 py-2 rounded-full font-semibold' onClick={startMicMode}>
            🎙️ Use Mic to Ask
          </button>
          <button className='bg-white text-black px-6 py-2 rounded-full font-semibold' onClick={startTypingMode}>
            ⌨️ Type Your Question
          </button>
        </div>
      )}

      {/* Typing Input Bar */}
      {mode === 'typing' && (
        <div className='fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[600px] bg-white rounded-full px-4 py-2 shadow-lg flex items-center z-50'>
          <input
            type="text"
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTextAsk()}
            placeholder="Type your question..."
            className='flex-1 text-black text-[16px] px-4 py-2 rounded-full outline-none'
            autoFocus
          />
          <button
            onClick={handleTextAsk}
            className='ml-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full font-semibold hover:scale-105 transition-all duration-200'
          >
            Submit
          </button>
          <RxCross1
            className='ml-2 w-6 h-6 text-black cursor-pointer hover:text-red-600'
            onClick={() => {
              setMode(null);
              setUserText('');
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Home;







// Q1. What is the role of the Home component?
// It serves as the main interface where the assistant listens, responds, and performs tasks via voice.
// It integrates Web Speech API, Gemini AI, and custom commands.

// Q2. How is voice input handled?
// Using SpeechRecognition API, which listens to the user's speech.
// It triggers logic only if the assistant's name is mentioned.

// Q3. How does the assistant speak responses?
// Through SpeechSynthesisUtterance in Hindi (hi-IN) language.
// It reads out Gemini's response with a selected voice.

// Q4. What is isSpeakingRef and isRecognizingRef used for?
// To avoid overlap between speaking and listening phases.
// They prevent race conditions in async voice processes.

// Q5. What happens when the assistant detects a command?
// It stops recognition, sends the command to Gemini API,
// Processes the result, and speaks the response.

// Q6. How are external actions like Google search triggered?
// Based on Gemini's type value like google-search or youtube-play,
// A new browser tab is opened using window.open().

// Q7. Why is synth.cancel() used before speak()?
// To stop any ongoing speech before starting a new one.
// Prevents speech overlapping or cutting.

// Q8. How is aiText and userText used?
// userText stores the spoken input; aiText stores assistant reply.
// Displayed with corresponding GIFs on the UI.

// Q9. What happens on logout?
// JWT cookie is cleared via /logout API,
// User context is reset and navigates to Sign In.

// Q10. How is assistant greeting done on load?
// A greeting message is spoken when the component mounts.
// Uses SpeechSynthesis to say “Hello [User]”.

// Q11. How does Gemini know the assistant name and user name?
// They are sent in the API call from context (userData).
// Gemini uses these for personalized responses.

// Q12. What is the purpose of the mobile hamburger menu?
// It provides access to “Customize” and “Logout” options in mobile view.
// Also displays assistant interaction history in scrollable view.
