import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    blogImage: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    category: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true,
        minlength:[200,"Should contain atleast 200 character"]
    },
    adminName: {
        type: String,
        // required: true   
    },
    adminImage: {
        type: String,
        // required: true
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref:"User"
    }
})

export const Blog = mongoose.model("Blog", blogSchema)
