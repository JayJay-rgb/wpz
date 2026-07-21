import express from "express"
import mongoose from "monggose"
import "dotenv/config"


const app= express();
const port = Process.env.PORT


mongoose.connection.once("open",()=>{
    console.log("MongoDB connected")
    app.listen(port,()=>console.log(`Server running on http://localhost:${port}`))
})