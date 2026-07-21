import mongoose from "mongoose";

const workerSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String
    },
    profileImage: {
        type: String
    },
    bio:{
        type:String
    },
    skills:{
        type:[String]
    },
    works:{
        type:[String]
    },
    googleId: {
    type: String,
    required: true,
    unique: true
}
}, {
    timestamps: true
});

const worker = mongoose.model("Worker", workerSchema);
export default worker;