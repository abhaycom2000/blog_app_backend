
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from './routes/user.route.js'
import blogRoute from './routes/blog.route.js'
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from 'cloudinary';
import cookieParser from "cookie-parser";
import cors  from 'cors'
const app = express();
dotenv.config();
// app.use(cors(
//     //     {
//     //     origin:process.env.FRONTEND_URL,
//     //     credentials:true,
//     //     methods:["GET","POST","PUT","DELETE"]
//     // }
// ));
app.use(
    cors({
        origin: 'http://localhost:3000', // Frontend URL
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,  // Allow cookies to be sent
    })
);
const port = process.env.PORT
const mongo_url = process.env.MONGO_URL;

app.use(express.json())
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:'/tmp/'
}))
app.use(cookieParser());
try {
   mongoose.connect(mongo_url) ;
    console.log("Connection to MongoDB!");
} catch (error) {
    console.log(error);
}

// defining routes
app.use("/api/users",userRoute)
app.use("/api/blogs",blogRoute)

//CLOUDINARY
 // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.CLOUD_API_KEY, 
        api_secret:process.env.CLOUD_API_SECRET
    });

app.listen(port,()=>{
    console.log(`Example app listining on port ${port}`);
})