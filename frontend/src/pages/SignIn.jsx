import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import bg from "../assets/authBg.png";
import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext.jsx";
import axios from "axios";

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { serverUrl, setUserData } = useContext(userDataContext);
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);


    const handleSignIn = async (e) => {
        e.preventDefault();
        setErr("");
        setLoading(true);
        try {
            let result = await axios.post(
                `${serverUrl}/api/auth/signin`,
                {
                    email,
                    password,
                },
                {
                    withCredentials: true,
                },
            );
            setUserData(result.data);
            setLoading(false);
            navigate("/");
        } catch (error) {
            // console.log(error);
            const errorMessage = error.response?.data?.message || "An error occurred during signin";
            setUserData(null);
            setErr(errorMessage);
            setLoading(false);
        }
    };

    return (
        <div
            className="w-full h-screen bg-cover flex justify-center items-center"
            style={{ backgroundImage: `url(${bg})` }}
        >
            <form
                className="w-[90%] h-160 max-w-125 bg-[#00000028] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px]"
                onSubmit={handleSignIn}
                action="/submit"
            >
                <h1 className="text-white text-[30px] font-semibold mb-[30px]">
                    Register to{" "}
                    <span className="text-sky-400">Virtul Assistant</span>
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full rounded-2xl h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] text-[18px]"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div className="w-full h-[60px] rounded-2xl border-2 border-white bg-transparent text-white text-[18px] relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="password"
                        className="w-full h-[60px] rounded-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px]"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {!showPassword && (
                        <IoEye
                            className="absolute h-[25px] w-[25px] top-[18px] right-[20px] text-white cursor-pointer"
                            onClick={() => setShowPassword(true)}
                        />
                    )}
                    {showPassword && (
                        <IoEyeOff
                            className="absolute h-[25px] w-[25px] top-[18px] right-[20px] text-white cursor-pointer"
                            onClick={() => setShowPassword(false)}
                        />
                    )}
                </div>

                {err.length > 0 && (
                    <p className="text-red-500 text-[17px]">*{err}</p>
                )}
                <button className="min-w-[150px] h-[60px] mt-[30px] text-black text-[19px] font-semibold bg-white rounded-full" disabled={loading}>
                    {loading ? "Loading..." : "Sign In"}
                </button>
                <p
                    className="text-white text-[18px] cursor-pointer"
                    onClick={() => navigate("/signup")}
                >
                    Want to create new account ?{" "}
                    <span className="text-blue-400">Sign Up</span>
                </p>
            </form>
        </div>
    );
};

export default SignIn;
