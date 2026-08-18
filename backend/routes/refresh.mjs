import express from "express"
import refreshController from "../controllers/refreshController.mjs"
import verifyJwt from "../middleware/verifyJwt.mjs"
const refreshRouter = express.Router();

refreshRouter.post("/refresh", refreshController)
export default refreshRouter;