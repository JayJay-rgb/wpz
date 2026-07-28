import { user } from "../model/userSchema.mjs";
import jwt from "jsonwebtoken"
import "dotenv/config"

const logoutController = async (req,res)=>{
    try{
        const refreshToken = req.cookies.refreshToken
        if(!refreshToken) return res.sendStatus(204)

        let decoded;
        try{
            decoded=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
        }catch(err){
            res.clearCookie("refreshToken")
            return res.sendStatus(204)
        }

        const foundUser = await user.findById(decoded.id);
        if(foundUser){
            foundUser.currentRefreshToken=null
            await foundUser.save()
        }

        res.clearCookie("refreshToken")
        res.sendStatus(200)
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
}

export default logoutController;