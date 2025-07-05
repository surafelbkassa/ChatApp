import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import prisma from '../lib/prisma.js';
export const signup = async (req,res) => {
    const {fullName, email, password} = req.body;
    try {
        if(!fullName || !email || !password){
            return res.status(400).json({message: "Please fill all the fields"});
        }
        if (password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters long"});
        }
        const user = await prisma.users.findUnique(
            {where : {email}});
        if(user){
            return res.status(404).json({message :"User already exists"})
        }
        const salt =  await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser =await prisma.users.create({
            data:{
                fullName:fullName,
            email :email, 
            password : hashedPassword
            }
        })
        if (newUser){
            generateToken(newUser.id,res)
            return res.status(201).json({
                id: newUser.id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        }else{
            return res.status(400).json({message : "invalid user data"})
        }

    } catch (error) {
        console.log("Error in signup controller:"+ error.message);
        return res.status(500).json({message: "Internal server error"});
        
    }}
export const login = async (req,res) => {
    const {email, password} = req.body;
    try {
        const user = await prisma.users.findUnique({
            where :{email}
        })
        if(!user){
            return res.status(400).json({message: "Invalid email or password"});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({message: "Invalid email or password"});
        }
        generateToken(user.id, res);
        return res.status(200).json({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        
    }
}
export const logout = (req,res) => {
    try {
        res.cookie('jwt','',{maxAge: 0});
        res.status(200).json({"message":"Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller: " + error.message);
        res.status(500).json({"message": "Internal server error"})
    }
}