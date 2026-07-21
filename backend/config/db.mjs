import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
    }
    catch(err){
        console.log("Failed to connect",err.message)
        process.exit(1)
    }
}

export default connectDB;