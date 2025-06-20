import { User } from '../models/user.model.js'
import jwt from 'jsonwebtoken'

// authatication
export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies?.jwt;

        if (!token) {
            return res.status(401).json({ error: "User not authentication" })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("Error occuring in Authentication: " + error);
        res.status(401).json({ error: "User not authenticated", blog });
    }
}


//authirizationn 

export const isAdmin =(...roles)=>{
    return (req,res,next)=>{
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({error:`User with give role ${req.user.role} not allowed`})
        }
        next()
    }
}