import express from "express"
import refreshController from "../controllers/refreshController.mjs"

const refreshRouter = express.Router();

refreshRouter.post("/refresh",refreshController)
export default refreshRouter;