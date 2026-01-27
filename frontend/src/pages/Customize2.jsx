import React, { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";


function Customize2() {
    const {
        serverUrl,
        userData,
        setUserData,
        backendImage,
        selectedImage,
    } = useContext(userDataContext);
    
    const [assistantName, setAssistantName] = useState(
        userData?.AssistantName || "",
    );
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleUpdateAssistant = async () => {
        setLoading(true);
        try {
            let formData = new FormData();
            formData.append("assistantName", assistantName);

            if (backendImage) {
                formData.append("assistantImage", backendImage);
            } else {
                formData.append("imageUrl", selectedImage);
            }

            const result = await axios.post(
                `${serverUrl}/api/user/update`,
                formData,
                { withCredentials: true },
            );
            setLoading(false);
            console.log(result.data);
            setUserData(result.data);
            navigate("/")
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-[100vh] bg-gradient-to-t from-black to to-[#070794] flex justify-center items-center flex-col p-[20px] relative">
          <IoMdArrowRoundBack className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer" onClick={() => navigate("/customize")}/>
            <h1 className="text-white mb-[30px] text-[30px] text-center">
                Enter your{" "}
                <span className="text-blue-300 font-medium">
                    Assistant Name{" "}
                </span>
            </h1>
            <input
                type="text"
                placeholder="eg: jarvis"
                className="w-full max-w-[600px] rounded-2xl h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] text-[18px]"
                required
                value={assistantName}
                onChange={(e) => setAssistantName(e.target.value)}
            />
            {assistantName && (
                <button
                    className="w-full h-[60px] mt-[30px] max-w-[260px] text-black text-[19px] font-semibold bg-white rounded-full cursor-pointer text-[19px]"
                    onClick={() => {
                        handleUpdateAssistant();
                    }}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Finally create you assistant"}
                </button>
            )}
        </div>
    );
}

export default Customize2;
