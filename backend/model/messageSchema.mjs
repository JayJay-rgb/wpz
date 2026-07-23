import mongoose from "mongoose";

const messageSchema= new mongoose.Schema({
    conversation:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Conversation"
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    content:{
        type:String,
    },
    readAt:{
        type:Date,
        default:null
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

export const message=mongoose.model("Message",messageSchema)