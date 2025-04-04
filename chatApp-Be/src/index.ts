import express from "express";
import dotenv from 'dotenv'
import { connectDB } from "./lib/db";
import cors from "cors"
import path from "path";

import auhtRouter from "./routes/auth/route";
import messageRouter from "./routes/messageRoutes/message";


import cookieParser from "cookie-parser";
import { app,server } from "./lib/socket";

const PORT=process.env.PORT || 4000;


dotenv.config()
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth",auhtRouter)
app.use("/api/messages",messageRouter)

const __dirname1=path.resolve();

if(process.env.NODE_ENV==="production"){
   app.use(express.static(path.join(__dirname1,"../chat-App-Fe/dist")))


   app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname1,"chat-App-Fe","dist","index.html"));
   })
}else {
    app.get("/", (req, res) => {
      res.send("API is running..");
    });
  }


app.get("/",(req,res)=>{
    res.json("hiiiii")
})

server.listen(PORT,()=>{
    connectDB();
});