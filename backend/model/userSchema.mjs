import mongoose from "mongoose";

const portfolioItemSchema = new mongoose.Schema({
  title: String,
  url: String,
  description: String,
  projectImage:String,
  projectId:String
});
const userSchema= new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    googleId:{
        type:String
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    currentRefreshToken:{
        type:String,
        default:null
    },
    emailVerificationExpires:{
    type: Date,
    default: null
},
    profilePic:{
        type:String
    },
    profileId:{
        type:String
    },
    bio:{
        type:String
    },
    portfolio:[portfolioItemSchema],
    createdAt:{
        type:Date,
        default:Date.now
    }
})

export const user = mongoose.model("User",userSchema)