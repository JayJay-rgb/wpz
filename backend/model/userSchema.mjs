import mongoose from "mongoose";

const portfolioItemSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    default: null,
  },
  publicId: {
    type: String,
    default: null,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  link: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
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
    },
    emailVerificationPin: {
    type: String,
    default: null,
},
})

export const user = mongoose.model("User",userSchema)