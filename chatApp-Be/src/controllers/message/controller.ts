import cloudinary from "../../lib/cloudinary";
import { getRecevireSocketId, io } from "../../lib/socket";
import Message from "../../models/messages";
import User from "../../models/user"
import { Request,Response } from "express"

export const getUsersForSidebar= async(req:Request,res:Response)=>{
    try {
        const loggedUserId=req.user._id;
        const filterdUser=await User.find({_id:{$ne:loggedUserId}}).select("-password")
        res.status(200).json(filterdUser)
        
    } catch (error) {
        res.status(400).json("error while loading SideBar"+error)
    }
}

export const getMessages=async (req:Request,res:Response)=>{
   try {
    const {id:userToChatId}=req.params;
    const myId=req.user._id

    const messages=await Message.find({
        $or:[{senderId:myId,reciverId:userToChatId},
            {senderId:userToChatId,reciverId:myId}
        ]
    })
    res.status(200).json(messages)
   } catch (error) {
    res.status(400).json("error while loafding Messages"+error)
   }
}

export const sendMessages=async (req:Request,res:Response)=>{
    try {
        const {text,image}=req.body
        const senderId=req.user._id;
        const {id:reciverId}=req.params;

        let imageUrl;
        if(image){
            const respoance=await cloudinary.uploader.upload(image);
            imageUrl=respoance.secure_url
        }

      const newMessage=await Message.create({
            senderId,
            reciverId,
            text,
            image:imageUrl || null
        })

        ///socket-id message to the online User
        const receverId=getRecevireSocketId(reciverId);
        if(receverId){
            io.to(receverId).emit("newMessage",newMessage)
        }

        res.status(200).json(newMessage);

    } catch (error) {
        res.status(400).json("error While Sending Message"+error)
    }
}