import mongoose from "mongoose";

const gigSchema = new mongoose.Schema({
    client:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    title:{
        type:String
    },
    description:{
        type:String
    },
    budget:{
        min:Number,
        max:Number
    },
    status:{
        type:String,
        enum:["open","in progress","completed","cancelled"],
        default:"open"
    },
    acceptedBid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Bid"
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

export const gig = mongoose.model("Gig",gigSchema)