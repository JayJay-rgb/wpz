import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    gig:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gig"
    },
   lastMessage: {
    text: String,
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    sentAt: Date
}
})

export const conversation = mongoose.model("Conversation", conversationSchema)