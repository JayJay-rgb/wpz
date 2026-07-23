import user from "../models/userModel.mjs";


const registerController = async (req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"Email and password are required"});
        }
        const existingUser = await user.findOne({email});
        if(existingUser){
            return res.status(409).json({message:"Email already exists"});
        }
        const hashedPassword = await hashPassword(password);
        const newUser = await user.create({email,password:hashedPassword});
        res.status(201).json({message:"User registered successfully"});

    }
    catch(err){
        res.status(500).json({message:"Internal server error"});
    }
}

export default registerController;