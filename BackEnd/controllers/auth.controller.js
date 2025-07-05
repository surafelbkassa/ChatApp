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
export const login = (req,res) => {
    res.send('login route');
}
export const logout = (req,res) => {
    res.send('logout route');
}