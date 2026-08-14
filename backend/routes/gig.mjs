import express from "express"
import { cancelGig, createGig, getAllGigs, getGig, updateGig, completeGig, acceptBid, getMyGigs } from "../controllers/gigController.mjs"
import verifyJwt from "../middleware/verifyJwt.mjs"
const gigRouter= express.Router()


gigRouter.route("/gigs")
        .post(verifyJwt,createGig)
        .get(verifyJwt, getAllGigs)


gigRouter.route("/gigs/:id")
        .get(getGig)
        .patch(verifyJwt,updateGig)

gigRouter.patch("/gigs/:id/cancel",verifyJwt, cancelGig)
gigRouter.patch("/gigs/:id/complete",verifyJwt, completeGig)
gigRouter.patch("/gigs/:id/accept-bid",verifyJwt, acceptBid)    
gigRouter.get("/mygigs", verifyJwt, getMyGigs);   

export default gigRouter;


        