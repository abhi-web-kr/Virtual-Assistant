import React, { useContext, useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { IoMdMenu } from "react-icons/io";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import aiImage from "../assets/ai.gif";
import userImage from "../assets/user.gif";

const Home = () => {
    const { userData, serverUrl, setUserData, getGeminiResponse } =
        useContext(userDataContext);
    const navigate = useNavigate();
    const [userText, setUserText] = useState("");
    const [aiText, setAiText] = useState("");
    const [ham, setHam] = useState(false);

    const [listening, setListening] = useState(false);
    const isSpeakingRef = useRef(false);
    const recognitionRef = useRef(null);
    const isRecognizingRef = useRef(false);
    const synth = window.speechSynthesis;

    const handleLogout = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/auth/logout`, {
                withCredentials: true,
            });
            setUserData(null);
            navigate("/signup");
        } catch (error) {
            setUserData(null);
            console.log(error);
        }
    };

    const startRecognition = () => {
        if (!isSpeakingRef.current && !isRecognizingRef.current) {
            try {
                recognitionRef.current?.start();
                console.log("recognition request to start");
            } catch (error) {
                if (!error.message !== "InvalidStateError") {
                    console.log("start error: ", error);
                }
            }
        }
    };

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "hi-IN";
        const voices = window.speechSynthesis.getVoices();
        const hindiVoice = voices.find((v) => v.lang === "hi-IN");
        if (hindiVoice) {
            utterance.voice = hindiVoice;
        }

        isSpeakingRef.current = true;
        utterance.onend = () => {
            setAiText("");
            isSpeakingRef.current = false;
            setTimeout(() => {
                startRecognition();
            }, 800);
        };
        synth.cancel();
        synth.speak(utterance);
    };

    const handleCommand = (data) => {
        if (!data || !data.type) {
            console.error("Invalid data received:", data);
            return;
        }

        const { type, userInput, response } = data;
        speak(response);

        console.log("Command type:", type, "User input:", userInput);

        switch (type) {
            case "facebook-open":
                window.open("https://www.facebook.com/", "_blank");
                break;

            case "weather-show":
                window.open(
                    "https://www.google.com/search?q=weather",
                    "_blank",
                );
                break;

            case "youtube-search":
            case "youtube-play": {
                const query = encodeURIComponent(userInput);
                window.open(
                    `https://www.youtube.com/results?search_query=${query}`,
                    "_blank",
                );
                break;
            }

            case "google-search": {
                const searchQuery = encodeURIComponent(userInput);
                window.open(
                    `https://www.google.com/search?q=${searchQuery}`,
                    "_blank",
                );
                break;
            }

            case "calculator-open":
                window.open(
                    "https://www.google.com/search?q=calculator",
                    "_blank",
                );
                break;

            case "instagram-open":
                window.open("https://www.instagram.com/", "_blank");
                break;

            case "general":
                // General conversation - response is already spoken above
                break;

            default:
                console.warn("Unknown command type:", type);
        }
    };

    useEffect(() => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error("Speech Recognition not supported in this browser");
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.lang = "en-US";
        recognition.interimResults = false;

        recognitionRef.current = recognition;

        let isMounted = true;

        const startTimeout = setTimeout(() => {
            if (
                isMounted &&
                !isSpeakingRef.current &&
                !isRecognizingRef.current
            ) {
                try {
                    recognition.start();
                    console.log("Recognition requested to start");
                } catch (error) {
                    if (error.name !== "InvalidStateError") {
                        console.error(error);
                    }
                }
            }
        }, 10000);

        recognition.onstart = () => {
            console.log("recogniation started");
            isRecognizingRef.current = true;
            setListening(true);
        };

        recognition.onend = () => {
            console.log("recogination ended");
            isRecognizingRef.current = false;
            setListening(false);

            if (isMounted && !isSpeakingRef.current) {
                setTimeout(() => {
                    if (isMounted) {
                        try {
                            recognition.start();
                            console.log("Recognition restarted");
                        } catch (error) {
                            if (error.name !== "InvalidStateError") {
                                console.error(error);
                            }
                        }
                    }
                }, 1000);
            }
        };

        recognition.onerror = (event) => {
            console.warn("Recognition error: ", event.error);
            isRecognizingRef.current = false;
            setListening(false);

            // Only log errors that are not expected/normal
            if (
                event.error !== "aborted" &&
                event.error !== "no-speech" &&
                isMounted &&
                !isSpeakingRef.current
            ) {
                setTimeout(() => {
                    if (isMounted) {
                        try {
                            recognition.start();
                            console.log("Recognition restarted after error");
                        } catch (error) {
                            if (error.name !== "InvalidStateError") {
                                console.error(error);
                            }
                        }
                    }
                }, 1000);
            }
        };

        recognition.onresult = async (e) => {
            const transcript =
                e.results[e.results.length - 1][0].transcript.trim();

            if (
                transcript
                    .toLowerCase()
                    .includes(userData.assistantName.toLowerCase())
            ) {
                setAiText("");
                setUserText(transcript);
                recognition.stop();
                isRecognizingRef.current = false;
                setListening(false);

                const data = await getGeminiResponse(transcript);
                console.log("Response data:", data);
                setAiText(data.response);
                setUserText("");

                if (data && data.response) {
                    handleCommand(data);
                } else if (data && data.retryAfter) {
                    speak(
                        `I'm at my usage limit. Please try again in ${data.retryAfter} seconds.`,
                    );
                } else {
                    speak("Sorry, I couldn't process your request.");
                }
            }
        };

        const greeting = new SpeechSynthesisUtterance(
            `Hello ${userData.name}, what can I help you with?`,
        );
        greeting.lang = "hi-IN";
        greeting.onend = () => {
            setTimeout(() => {
                if (!isSpeakingRef.current && !isRecognizingRef.current) {
                    try {
                        recognition.start();
                        console.log("Recognition started after greeting");
                    } catch (error) {
                        if (error.name !== "InvalidStateError") {
                            console.error(error);
                        }
                    }
                }
            }, 1000);
        };
        window.speechSynthesis.speak(greeting);

        return () => {
            isMounted = false;
            recognition.stop();
            setListening(false);
            isRecognizingRef.current = false;
            clearInterval(startTimeout);
        };
    }, []);

    return (
        <div className="w-full h-[100vh] bg-gradient-to-t from-black to to-[#070794] flex justify-center items-center flex-col gap-[15px]">
            <IoMdMenu
                className="lg:hidden text-white absolute top-[20px] right-[20px] h-[25px] w-[25px]"
                onClick={() => setHam(true)}
            />

            <div
                className={`absolute top-0 w-full pt-[20px] pl-[10px] h-full lg:hidden bg-[#00000025] backdrop-blur-lg flex flex-col gap-[20px] items-start ${ham ? "translate-x-0" : "translate-x-full"} transition-transform`}
            >
                <RxCross2
                    className="lg:hidden text-white absolute top-[20px] right-[20px] h-[25px] w-[25px]"
                    onClick={() => setHam(false)}
                />
                <button
                    className="min-w-[150px] h-[45px] text-black text-[19px] font-semibold bg-white rounded-full cursor-pointer"
                    onClick={handleLogout}
                >
                    Logout
                </button>
                <button
                    className="min-w-[150px] h-[45px] text-black text-[19px] font-semibold bg-white rounded-full  px-[20px] py-[10px] cursor-pointer"
                    onClick={() => navigate("/customize")}
                >
                    Customize your Assistant
                </button>
                <div className="bg-gray-400 mx-auto w-[95%] h-[2px]"></div>
                <h1 className="fond-semibold text-white text-[19px]">
                    History
                </h1>
                <div className="mx-auto w-[90%] h-[400px] gap-[20px] overflow-y-auto flex flex-col">
                    {userData.history?.map((his, index) => (
                        <span
                            key={index}
                            className="text-gray-200 text-[18px] truncate"
                        >
                            {his}
                        </span>
                    ))}
                </div>
            </div>

            <button
                className="min-w-[150px] h-[60px] mt-[30px] hidden lg:block text-black text-[19px] font-semibold bg-white rounded-full absolute top-[20px] right-[20px] cursor-pointer"
                onClick={handleLogout}
            >
                Logout
            </button>
            <button
                className="min-w-[150px] h-[60px] mt-[30px] hidden lg:block text-black text-[19px] font-semibold bg-white rounded-full absolute top-[100px] right-[20px] px-[20px] py-[10px] cursor-pointer"
                onClick={() => navigate("/customize")}
            >
                Customize your Assistant
            </button>
            <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden shadow-lg">
                <img
                    src={userData?.assistantImage}
                    className="h-full object-cover rounded-[8px]"
                />
            </div>
            <h1 className="text-white text-[18px] font-semibold">
                I'm {userData?.assistantName}
            </h1>
            {!aiText && <img src={userImage} className="w-[200px]" />}
            {aiText && <img src={aiImage} className="w-[200px]" />}

            <h1 className="text-white text-[18px] font-semibold text-wrap">
                {userText ? userText : aiText ? aiText : null}
            </h1>
        </div>
    );
};

export default Home;
