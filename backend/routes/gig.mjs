import express from "express"
import { updateGig } from "../controllers/gigController.mjs"

const gigRouter= express.Router()

gigRouter.route("/gig")
        