import mongoose from "mongoose";

interface MesgI{
    senderId:String;
    reciverId:String;
    image:String;
    text:String
}

const messageSchema=new mongoose.Schema<MesgI>({
    senderId:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    reciverId:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String,
    },
    image:{
        type:String
    } 
},
    {timestamps:true}
)

const Message=mongoose.model("Message",messageSchema);

export default Message