import express from "express"
import logoutController from "../controllers/logoutController.mjs"

const logoutRouter = express.Router()

logoutRouter.post("/logout",logoutController)

export default logoutRouter;