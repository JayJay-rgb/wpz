import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Worker",
    required: true
  },
  originGig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gig",
    default: null
  },
  lastMessage: {
    type: String
  }
}, { timestamps: true });

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;