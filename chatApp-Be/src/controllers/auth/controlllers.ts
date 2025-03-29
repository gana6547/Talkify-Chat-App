import { Request,Response } from "express";
import bcrypt from "bcrypt";
import User from "../../models/user";
import jwt from "jsonwebtoken";
import cloudinary from "../../lib/cloudinary";



// Explicitly load the .env file from the root folder
// const test=dotenv.config({ path: path.resolve(__dirname, '../../.env') });
// console.log(test);

export const signup=async(req:Request,res:Response)=>{
    console.log(req.body);
   const{fullName,email,password}=req.body;
   
   try {
    if(password.length<6) res.status(400).json("password must be grster than 6 letters")

    const hashedPassword=await bcrypt.hash(password,5);

    const newUser=await User.create({
        fullName,
        email,
        password:hashedPassword
    })

    if(newUser){
       const token=jwt.sign({userId:newUser._id.toString()},process.env.JWT_SECRET!,{expiresIn:"7d"});
       res.cookie("jwt",token,{
        httpOnly:true,
        maxAge:7 * 24 * 60 * 60 * 1000,
        sameSite:"strict"
    })
    res.json(newUser)
    }
    else{
        res.status(404).json("Invalid User Data")
    }

   } catch (error) {
    console.log("Error While Creating User",error);
    res.status(500).json("Internal Server Errror")
   }
}

export const login=async (req:Request,res:Response)=>{
    const {email,password}=req.body;
    try {
        const user=await User.findOne({email});
        if(!user){
            res.status(400).json("User Not Found")
        }
    //@ts-ignore
    const isPasswordCorrect=await bcrypt.compare(password,user?.password)
    if(isPasswordCorrect){
        const token=jwt.sign({userId:user?._id.toString()},process.env.JWT_SECRET!,{expiresIn:"7d"});
       res.cookie("jwt",token,{
        httpOnly:true,
        maxAge:7 * 24 * 60 * 60 * 1000,
        sameSite:"strict"
        })
        res.json(token)
    }
    } catch (error) {
        res.status(400).json("error in login")
    }
}

export const logout=(req:Request,res:Response)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json("Logout Successfully")
    } catch (error) {
        res.status(400).json("Error While Logout")
    }
}

export const updateProfile=async (req:Request,res:Response)=>{
   try {
    const{profilePic}=req.body;
    const userId= req.user._id;
 
    if(!profilePic){
     res.status(400).json("Profile pic is required")
    }
 
    const uploadRespoance=await cloudinary.uploader.upload(profilePic);
    const updatedUser=await User.findByIdAndUpdate(userId,{profilePic:uploadRespoance.secure_url},{new:true})
    
    res.status(200).json(updatedUser)

   } catch (error) {
    console.log("error while updating the profile"),error;
    res.status(400).json("Internaml server Error"+error)
   }
}

export const checkAuth=(req:Request,res:Response)=>{
    try {
        res.status(200).json(req.user)
    } catch (error) {
        res.status(400).json("Internam Server Error");
    }
}