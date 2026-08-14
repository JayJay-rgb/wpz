import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});

export const sendVerificationEmail = async (toEmail,pin)=>{
    await transporter.sendMail({
        from:process.env.EMAIL_USER,
        to:toEmail,
        subject:"Email Verification",
        text:`Your verification pin is ${pin}.it would expire in 15 minutes.`
    })

    
}