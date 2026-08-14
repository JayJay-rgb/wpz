import express from "express";
import { getMyNotifications, markNotificationRead } from "../controllers/notificationController.mjs";
import verifyJwt from "../middleware/verifyJwt.mjs";

const notificationRouter = express.Router();

notificationRouter.use(verifyJwt);

notificationRouter.get("/notifications", getMyNotifications);
notificationRouter.patch("/notifications/:notificationId/read", markNotificationRead);

export default notificationRouter;