import express from "express";
import {
  startConversation,
  getMyConversation,
  sendMessage,
  getMessage,
} from "../controllers/messageController.mjs";
import verifyJwt from "../middleware/verifyJwt.mjs";

const messageRouter = express.Router();

messageRouter.use(verifyJwt);

messageRouter.post("/conversations", startConversation);
messageRouter.get("/conversations", getMyConversation);
messageRouter.get("/conversations/:conversationId/messages", getMessage);
messageRouter.post("/conversations/:conversationId/messages", sendMessage);

export default messageRouter;