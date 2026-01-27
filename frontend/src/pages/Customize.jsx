import Card from "../components/Card.jsx";
import { BiImageAdd } from "react-icons/bi";
import { IoMdArrowRoundBack } from "react-icons/io";

import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import { useContext, useRef } from "react";
import { userDataContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";

function Customize() {
    const {
        setBackendImage,
        frontendImage,
        setFrontendImage,
        selectedImage,
        setSelectedImage,
    } = useContext(userDataContext);

    const inputImage = useRef();
    const navigate = useNavigate();

    const handleImage = (e) => {
        const file = e.target.files[0];
        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
    };

    return (
        <div className="w-full h-[100vh] bg-gradient-to-t from-black to to-[#070794] flex justify-center items-center flex-col p-[20px]">
            <IoMdArrowRoundBack className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer" onClick={() => navigate("/")}/>
            <h1 className="text-white mb-[30px] text-[30px] text-center">
                Select your{" "}
                <span className="text-blue-300 font-medium">
                    <i>assistant Image</i>
                </span>
            </h1>
            <div className="w-full max-w-[900px]  flex justify-center items-center flex-wrap gap-[15px]">
                <Card image={image1} />
                <Card image={image2} />
                <Card image={image3} />
                <Card image={image4} />
                <Card image={image5} />
                <Card image={image6} />
                <Card image={image7} />

                <div
                    className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[rgba(0,51,255,0.44)] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500 hover:border-4 hover:border-white cursor-pointer flex justify-center items-center ${selectedImage == "input" ? "border-4 border-white shadow-2xl shadow-blue-950" : null }`}
                    onClick={() => {
                        inputImage.current.click()
                        setSelectedImage("input")
                    }}
                >
                    {!frontendImage && (
                        <BiImageAdd className="text-white w-[25px] h-[25px]" />
                    )}
                    {frontendImage && (
                        <img
                            src={frontendImage}
                            className="h-full object-cover"
                        />
                    )}
                </div>
                <input
                    type="file"
                    accept="image/*"
                    ref={inputImage}
                    hidden
                    onChange={handleImage}
                />
            </div>
            {selectedImage && <button className="min-w-[150px] h-[60px] mt-[30px] text-black text-[19px] font-semibold bg-white rounded-full cursor-pointer text-center" onClick={() => navigate("/customize2")}>
                Next
            </button>}
        </div>
    );
}

export default Customize;
