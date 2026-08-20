const allowedOrigins = [
    process.env.CLIENT_URL,
    "https://wpz.onrender.com",
    "http://localhost:3000",
    "http://localhost:5173",
    "https://wpz-mocha.vercel.app",
    "https://wpz.vercel.app",
    "https://wpz.netlify.app",
    "https://wpz.fly.dev"
].filter(Boolean)

const corsOption = {
    origin:(origin,callback)=>{
        if(allowedOrigins.includes(origin) || !origin){
            callback(null,true)
        }
        else{
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
    optionsSuccessStatus:200
}

export default corsOption;