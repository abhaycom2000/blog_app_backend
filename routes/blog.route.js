import express from "express";
import { createBlog, deleteBlog, getAllBlogs, getSingleBlogs, getMyBlogs, updateBlog } from "../controller/blog.controller.js";
import { isAdmin, isAuthenticated } from "../middleware/authUser.js";

const router = express.Router()

router.post("/create",isAuthenticated,isAdmin("admin"),createBlog)
router.delete("/delete/:id",isAuthenticated,isAdmin("admin"),deleteBlog)
// router.get("/all-blogs",isAuthenticated,getAllBlogs)
router.get("/all-blogs",getAllBlogs)

router.get("/single-blog/:id",isAuthenticated,getSingleBlogs)
router.get("/my-blogs",isAuthenticated,isAdmin("admin"),getMyBlogs)
router.put("/update/:id",isAuthenticated,isAdmin("admin"),updateBlog)
export default router;