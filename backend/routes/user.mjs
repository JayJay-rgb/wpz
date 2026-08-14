import express from "express";
import { getUserProfile, updateProfile,searchUsers } from "../controllers/userController.mjs";
import verifyJwt from "../middleware/verifyJwt.mjs";

const userRouter = express.Router();

userRouter.get("/users/:userId", getUserProfile);
userRouter.get("/search", verifyJwt, searchUsers);
userRouter.patch("/profile", verifyJwt, updateProfile);

export default userRouter;