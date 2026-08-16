import express from "express"
import refreshController from "../controllers/refreshController.mjs"
import verifyJwt from "../middleware/verifyJwt.mjs"
const refreshRouter = express.Router();

refreshRouter.post("/refresh", verifyJwt, refreshController)
export default refreshRouter;