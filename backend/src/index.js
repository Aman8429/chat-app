import express from 'express'
import authRoutes from './routes/auth.route.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db.js';
import messageRoutes from './routes/message.route.js'
import cors from 'cors'
import bodyParser from 'body-parser'
import { app,server } from './lib/socket.js';
import path from 'path';

dotenv.config();

connectDB();

const port = process.env.PORT || 5001
const __dirname = path.resolve();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json());  //allow use to parse incoming requests:req.body
app.use(cookieParser()); //allow us to parse incoming cookies   
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
    })
}

server.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})