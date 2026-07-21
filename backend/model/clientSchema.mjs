import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String
    },
    profileImage:{
        type:String
    }
},{
    timestamps:true
})
const client = mongoose.model("Client",clientSchema);
export default client;