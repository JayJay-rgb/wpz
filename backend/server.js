import express from "express"
import mongoose from "mongoose"
import "dotenv/config"
import connectDB from "./config/db.mjs";



const app= express();
const port = process.env.PORT


connectDB();


mongoose.connection.once("open",()=>{
    console.log("MongoDB connected")
    app.listen(port,()=>console.log(`Server running on http://localhost:${port}`))
})