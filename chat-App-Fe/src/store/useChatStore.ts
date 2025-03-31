
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

interface IUser {
    _id:string;
    fullName:string;
    email:string;
    password:string;
    profilePic:string;
    createdAt:string;
}

interface IMessage {
    _id:string
    senderId:String;
    reciverId:String;
    image:String;
    text:String;
    createdAt:Date;
}

interface IMessageData{
    text:string,
    image?: string | ArrayBuffer | undefined;
}

interface IchatState{
    users:IUser[],
    messages:IMessage[],
    selectedUser:IUser | null,
    isUserLoading:boolean,
    isMessagesLoading:boolean,
    getUsers:()=>void,
    getMessages:(data:string)=>void,
    sendMessage:(data:IMessageData)=>void,
    setSelectedUser:(data:IUser|null)=>void,
    subscribeToMessage:()=>void,
    unsubscribeToMessage:()=>void
}

export const useChatStore=create<IchatState>((set,get)=>({
    users:[],
    messages:[],
    selectedUser:null,
    isUserLoading:false,
    isMessagesLoading:false,

    getUsers:async()=>{
        set({isUserLoading:true})
        try {
            const res=await axiosInstance("/messages/users");
            set({users:res.data})
        } catch (error) {
            toast.error("error in getting Messages"+error)
        }finally{
            set({isUserLoading:false})
        }
    },

    getMessages:async(userId)=>{
        set({isMessagesLoading:true})
        try {
            const res=await axiosInstance.get(`/messages/${userId}`);
            set({messages:res.data})
        } catch (error) {
            toast.error("error while getting chat")
        }finally{
            set({isMessagesLoading:false})
        }
    },

    sendMessage:async(messagesData)=>{
       const {messages,selectedUser}=get()
       try {
        const res=await axiosInstance.post(`/messages/send/${selectedUser?._id}`,messagesData);
        set({messages:[...messages,res.data]})
       } catch (error) {
        toast.error("error while getting messages"+error);
       }
    },

    subscribeToMessage:()=>{
        const {selectedUser}=get();
        if(!selectedUser) return;

        const socket=useAuthStore.getState().socket;

        socket?.on("newMessage",(newMessage)=>{
            const isMessageSentFromSelecedUser=newMessage.senderId===selectedUser._id;
            if(!isMessageSentFromSelecedUser) return; //this will prevent from sending messages to other user

            set({
                messages:[...get().messages,newMessage]
            })
        })
    },

    unsubscribeToMessage:()=>{
        const socket=useAuthStore.getState().socket;
        socket?.off("newMessage");
    },

    ///it will give some error we will see it
    setSelectedUser:(selectedUser)=>set({ selectedUser })
}))