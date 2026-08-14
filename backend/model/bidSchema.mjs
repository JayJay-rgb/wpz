import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
    gig: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gig"
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    price: {
        type: Number
    },
    proposal: {
        type: String
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    }
}, { timestamps: true })

bidSchema.index({ gig: 1, freelancer: 1 }, { unique: true })

export const bid = mongoose.model("Bid", bidSchema)