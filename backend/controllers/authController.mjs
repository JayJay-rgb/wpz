import {user} from "../model/userSchema.mjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { comparePassword} from "../utils/hashing.mjs";
import {hashPassword} from "../utils/hashing.mjs";

const authController = async (req, res) => {
    try{
        const {email,password}=req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const foundUser = await user.findOne({ email });
        if (!foundUser) {
            return res.status(401).json({ message: "Email doesn't exist" });
        }
        const isMatched= await comparePassword(password,foundUser.password)
        if (!isMatched) return res.status(401).json({ message: "Invalid password" });


        if (!foundUser.isVerified) {
  return res.status(403).json({ message: "Please verify your email before logging in" });
}
        const accessToken= jwt.sign(
            { id: foundUser._id },
             process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: "1d" });



        const refreshToken = jwt.sign(
            { id: foundUser._id },
             process.env.REFRESH_TOKEN_SECRET,
              { expiresIn: "7d" }
        )

        const hashedRefreshToken = await hashPassword(refreshToken);
        foundUser.currentRefreshToken = hashedRefreshToken;
        await foundUser.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            // sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .json({accessToken, message: "Login successful" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export default authController;