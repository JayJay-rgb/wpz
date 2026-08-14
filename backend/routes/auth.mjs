import express from "express"
import { verifyEmail,resendVerificationPin } from "../controllers/registerController.mjs"
import authController from "../controllers/authController.mjs"

const authRouter = express.Router();

authRouter.post("/auth", authController);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/resend-verification", resendVerificationPin);

export default authRouter