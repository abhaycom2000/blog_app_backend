import { User } from "../models/user.model.js";
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcrypt'
import createTokenAndSaveCookies from "../jwt/AuthTockan.js"

export const register = async (req, res) => {
    try {
        if (!req.files || !req.files.photo) {
            return res.status(400).json({ message: "Photo is required" });
        }

        const { photo } = req.files;
        const allowedFormats = ["image/jpeg", "image/png", "image/webp"];

        if (!allowedFormats.includes(photo.mimetype)) {
            return res.status(400).json({ message: "Invalid photo format. Only JPG, PNG, and WEBP allowed." });
        }

        const { name, email, phone, role, password, education } = req.body;

        if (!name || !email || !phone || !role || !password || !education) {
            return res.status(400).json({ message: "Please fill all required fields." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email." });
        }

        const cloudinaryResponse = await cloudinary.uploader.upload(photo.tempFilePath, {
            folder: 'user_photos'
        });

        if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
            return res.status(500).json({ message: "Photo upload failed", error: cloudinaryResponse });
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            name,
            email,
            password: hashPassword,
            phone,
            education,
            role,
            photo: {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url
            }
        });

        await newUser.save();
        if (newUser) {
            const token = await createTokenAndSaveCookies(newUser._id, res)
            res.status(201).json({ message: "User registered successfully", newUser, token: token });
        }

    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            stack: error.stack
        });

    }
};

export const login = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        if (!email || !password || !role) {
            return res.status(400).json({ message: "Please fill required fildds." });
        }
        const user = await User.findOne({ email }).select("+password");
        console.log(user);

        if (!user.password) {
            return res.status(400).json({ message: "User password is missing" });
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!user || !isMatch) {
            return res.status(400).json({ message: "Invalid email and passwword" });
        }
        if (user.role !== role) {
            return res.status(400).json({ message: `Given role ${role} not found` });
        }
        const token = await createTokenAndSaveCookies(user._id, res);
        res.status(200).json({
            message: "User logged in successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token: token,
        })
    } catch (error) {
        console.log(error);
    }
}

export const logout = (req, res) => {
    try {
        res.clearCookie("jwt");
        res.status(200).json({ message: "User logout successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}

export const getMyProfile = async (req, res) => {
    const user = await req.user;
    res.status(200).json(user)
}

export const getAdmins = async (req,res)=>{
    const admins = await User.find({role:"admin"});
    res.status(200).json(admins)
}