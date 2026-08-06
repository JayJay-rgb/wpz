import express from "express"
import authController from "../controllers/authController.mjs"

const authRouter = express.Router();

authRouter.post("/auth", authController);

export default authRouter