import mongoose from "mongoose";
import { Blog } from "../models/blog.model.js";
import { v2 as cloudinary } from 'cloudinary';

export const createBlog = async (req, res) => {
    try {
        if (!req.files || !req.files.blogImage) {
            return res.status(400).json({ message: "Blog image is required" });
        }

        const { blogImage } = req.files;
        const allowedFormats = ["image/jpeg", "image/png", "image/webp"];

        if (!allowedFormats.includes(blogImage.mimetype)) {
            return res.status(400).json({ message: "Invalid blog image format. Only JPG, PNG, and WEBP allowed." });
        }

        const { title, category, about } = req.body;

        if (!title || !category || !about) {
            return res.status(400).json({ message: "category,title and about are required fields." });
        }

        const adminName = req?.user?.name;
        const adminImage = req?.user?.photo.url;
        const createdBy = req?.user?._id;

        const cloudinaryResponse = await cloudinary.uploader.upload(blogImage.tempFilePath, {
            folder: 'blog_photos'
        });

        if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
            return res.status(500).json({ message: "Photo upload failed", error: cloudinaryResponse });
        }

        const blogData = {
            title,
            about,
            category,
            adminName,
            adminImage,
            createdBy,
            blogImage: {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url
            }
        };

        const blog = Blog.create(blogData);
        res.status(201).json({ message: "Blog created successfully", blog });


    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            stack: error.stack
        });

    }
};

export const deleteBlog = async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
        return res.status(404).json({ message: "Blog not found" })
    }
    await blog.deleteOne();
    res.status(200).json({ message: "Blog deleted successfully" })
}

export const getAllBlogs = async (req, res) => {
    const allBlogs = await Blog.find();
    res.status(200).json(allBlogs)
}

export const getSingleBlogs = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid blog id" })
    }
    const blog = await Blog.findById(id);
    if (!blog) {
        return res.status(404).json({ message: "Blog not found" })
    }
    res.status(200).json(blog);
}

export const getMyBlogs = async (req, res) => {
    const createdBy = req.user._id;
    const myBlogs = await Blog.find({ createdBy });
    res.status(200).json(myBlogs)
}

export const updateBlog = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid blog id" })
    }
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    if (!updateBlog) {
        return res.status(400).json({ message: "Blog not found" })
    }
    res.status(201).json("Blog updated successfully!", updateBlog);
}