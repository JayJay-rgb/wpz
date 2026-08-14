import express from "express";
import { createBid,getMyBids } from "../controllers/bidController.mjs";
import verifyJwt from "../middleware/verifyJwt.mjs";

const bidRouter = express.Router();

bidRouter.route("/gig/:gigId/bid").post(verifyJwt,createBid)
bidRouter.route("/bids/mine").get(verifyJwt,getMyBids)

export default bidRouter;

