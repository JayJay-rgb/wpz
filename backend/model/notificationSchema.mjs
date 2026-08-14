import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    type:{
        type:String,
        enum:["new_bid","bid_accepted","bid_rejected","new_message","gig_status_changed"],
    },
    message:{
        type:String
    },
    link:{
        type:String
    },
    read:{
        type:Boolean,
        default:false
    },
    createdAt:{
    type: Date,
    default: Date.now
}

})

export const notification=mongoose.model("Notification",notificationSchema)