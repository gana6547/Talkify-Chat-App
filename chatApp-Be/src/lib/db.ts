
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL!)//error while importing from .env
    } catch (error) {
        console.log("MONGODB connection Error",error)
    }
}

