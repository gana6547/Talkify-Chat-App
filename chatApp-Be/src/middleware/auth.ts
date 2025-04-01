import jwt from "jsonwebtoken";
import User from "../models/user";
import { Request,Response,NextFunction } from "express";

interface JWTPayload extends Request{
    userId:string,
}

declare global {
    namespace Express {
      interface Request {
        user: any;  // You can define the user type more specifically based on your User model
      }
    }
  }
  
console.log("at protect route");

export const protectRoute=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try {
        const token=req.cookies.jwt;
        console.log(token);
        

        if(!token){
          res.status(400).json("Token not found");
          return
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET!)as JWTPayload///try to hide JWT_PASSWORD
        console.log("decoded jwt",decoded);
        
        
        if(!decoded){
           res.status(400).json("unauthorised Token");
           return
        }

        const user= await User.findById(decoded.userId).select("-password");
        console.log("user",user);
        
        
        if(!user){
            res.status(400).json("User Not Found");
            return
        }

        req.user=user;

        next();
    
    } catch (error) {
       res.status(500).json("error while verifying token"+error)
    }
}