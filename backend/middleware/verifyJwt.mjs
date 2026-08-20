import jwt from "jsonwebtoken"
import "dotenv/config"

const verifyJwt= async(req,res,next)=>{
    console.log("verifyJwt hit for:", req.method, req.originalUrl);

    try{
        const authorizedHeader =
          req.headers.authorization || req.headers.Authorization;

        if (!authorizedHeader?.startsWith("Bearer ")) {
          return res.sendStatus(401);
        }

        const token = authorizedHeader.split(" ")[1];

        if (!token) {
          return res.sendStatus(401);
        }

        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (err,decoded)=>{
                if(err){
                    console.log(err)
                    return res.sendStatus(401)
                }
                req.user=decoded.id
                next()
            }
        )
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
}
export default verifyJwt
