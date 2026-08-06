import express from "express"
import mongoose from "mongoose"
import "dotenv/config"
import connectDB from "./config/db.mjs";
import authRouter from "./routes/auth.mjs";
import registerRouter from "./routes/register.mjs";
import refreshRouter from "./routes/refresh.mjs"
import logoutRouter from "./routes/logout.mjs";
import http from "http";
import { Server } from "socket.io";
import { setupSocket } from "./sockets/socketHandler.mjs";
import cookieParser from "cookie-parser";




const app= express();
const port = process.env.PORT

app.use(express.json())
app.use(cookieParser())

const server = http.createServer(app)
const io= new Server(server)
app.set("io", io);

setupSocket(io)


connectDB();

app.use(registerRouter);
app.use(authRouter);
app.use(refreshRouter);
app.use(logoutRouter);



mongoose.connection.once("open",()=>{
    console.log("MongoDB connected")
    server.listen(port,()=>console.log(`Server running on http://localhost:${port}`))
})