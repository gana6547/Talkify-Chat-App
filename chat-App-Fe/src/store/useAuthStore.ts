import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {io, Socket} from "socket.io-client";

const BASE_URL=import.meta.env.MODE === "development"?"http://localhost:3000":"/";

//zustand is library woking like useState IN react


interface IauthUser{
    _id:string,
    fullName:string,
    email:string,
    password:string,
    profilePic:string,
    createdAt:string
}

interface IuseAuth{
    authUser:IauthUser | null,
    isCheckingAuth:boolean,
    onlineUsers:string[],
    isSignedUp:boolean,
    isLoginIn:boolean,
    isUpdateProfile:boolean,
    signUp:(data:any)=>Promise<void>,
    logout:()=>void
    logIn:(data:any)=>Promise<void>,
    updateProfile:(data:any)=>Promise<void>
    checkAuth:VoidFunction,
    connectSocket:()=>void,
    disconnectSocket:()=>void,
    socket:Socket | null

}

export const useAuthStore=create<IuseAuth>((set,get)=>({
    authUser:null,
    isCheckingAuth:true, ///means on refresh it checks user is authenticated or not!!! 
    isSignedUp:false,
    isLoginIn:false,
    isUpdateProfile:false,
    socket:null,

    onlineUsers:[],

    checkAuth:async ()=>{
        try {
            const res=await axiosInstance.get("/auth/check")
            set({authUser:res.data})
            get().connectSocket();
        } catch (error) {
            set({authUser:null})
            console.log("error while checkAuth",error);
        }finally{
            set({isCheckingAuth:false})
        }
    },

   signUp:async(data)=>{
        try {
            set({isSignedUp:true})
            const res=await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data})
            get().connectSocket(); //make connection to the socket
            toast.success("Account created successfully")
        } catch (error) {
            toast.error("Something went wrong"+error)
        }finally{
            set({isSignedUp:false})
        }
    },

    logout:async()=>{
        try {
            await axiosInstance.post("/auth/logout");
            toast.success("Logout Successfully")
            get().disconnectSocket();///disconnect the socket
            window.location.href="/login" //redirect to login pahe
        } catch (error) {
            toast.error("Something Went Wrong");
            console.log(error);
        }
    },

    logIn:async(data)=>{
        try {
            set({isLoginIn:true})
            const res=await axiosInstance.post("/auth/login",data);
            set({authUser:res.data})
            get().connectSocket();
            toast.success("Login Successfully")
        } catch (error) {
            toast.error("Invalid Credentials");
            console.log(error);
        }finally{
            set({isLoginIn:false})
        }
    },

    updateProfile:async(data)=>{
        set({isUpdateProfile:true})
        try {
            const res=await axiosInstance.put("/auth/update-profile",data);
            set({authUser:res.data})
            toast.success("Profile Pic Updated")
        } catch (error) {
            toast.error("something Went Wrong")
            console.log(error)
        }finally{
            set({isUpdateProfile:false})
        }
    },

    connectSocket:()=>{
        const {authUser}=get();
        if(!authUser || get().socket?.connected) return;

        const socket:Socket=io(BASE_URL,{
            query:{userId:authUser._id} ,
        });
        socket.connect()

        set({socket:socket})

        socket.on("getonlineusers",(userIds)=>{                         
            set({onlineUsers:userIds})
        })
    },

    disconnectSocket:()=>{
        if(get().socket?.connected) get().socket?.disconnect()
    }
}))