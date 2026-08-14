import express from "express";
import { getMe } from "../controllers/meController.mjs";
import verifyJwt from "../middleware/verifyJwt.mjs";

const meRouter = express.Router();
meRouter.get("/me", verifyJwt, getMe);

export default meRouter;