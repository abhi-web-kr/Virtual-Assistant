import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({ message: "user already exist !" });
        }
        if (password.length < 6) {
            return res
                .status(407)
                .json({ message: "password must be atlest 6 characters !" });
        }

        const hassedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            password: hassedPassword,
            email,
        });

        const token = await genToken(newUser._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: false,
            sameSite: "strict",
        });

        return res.status(200).json({
            user: newUser,
            message: "user created successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: `sing Up error ${error}`,
        });
    }
};

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if(!email || !password) {
            return res.status(400).json({message: "All fields are required !"});
        }
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "user does not exists !" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "password doesn't match" });
        }

        const token = await genToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: false,
            sameSite: "strict",
        });

        return res.status(200).json({
            user: user,
            message: "Login successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: `login error ${error}`,
        });
    }
};

export const logOut = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({
            message: "logout successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: `logout error ${error}`,
        });
    }
};
