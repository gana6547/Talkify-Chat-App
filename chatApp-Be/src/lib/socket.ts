import { Server } from "socket.io";
import http from "http";
import express from "express";

const app=express();
const server=http.createServer(app);

const io=new Server(server,{
    cors:{
    origin:["http://localhost:5173"]
    }
})

//used to store online users 
const userSocketMap: { [userId: string]: string } ={} //{userId:socketId}

export function getRecevireSocketId(userId:string){
    return userSocketMap[userId]
}

io.on("connection",(socket)=>{
    console.log("User Is connected",socket.id);
    
    const userId=socket.handshake.query.userId as string;
    if(userId) userSocketMap[userId]=socket.id;

    //io.emits use to send events to all the connected clients
    io.emit("getonlineusers",Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        console.log("User IS disconnected",socket.id);
       if(userId) delete userSocketMap[userId];
        io.emit("getonlineusers",Object.keys(userSocketMap));
    })


})

export {io,app,server}