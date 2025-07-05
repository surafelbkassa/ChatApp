import jwt from 'jsonwebtoken';
import user from '../models/user.model.js';

export const protectRoute = async(req,res,next) =>{
    try {
        const token = req.cookies.jwt;
        if (!token){
            return res.status(401).json({message: "Unauthorized access, please login first"});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded){
            res.status(401).json({"message" : "Unauthorized access, please login first"});
        }
        const user = await user.findById(decoded.id).select("-password");
        if(!user){
            res.status(404).json({"message" : "User not found"});
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
}