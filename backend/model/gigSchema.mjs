import mongoose from "mongoose";

const gigSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  category: {
    type: String
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true
  },
  status: {
    type: String,
    enum: ["open", "in_progress", "closed"],
    default: "open"
  },
  acceptedBid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bid",
    default: null
  }
}, { timestamps: true });

const Gig = mongoose.model("Gig", gigSchema);
export default Gig;