import { bid } from "../model/bidSchema.mjs";
import { gig } from "../model/gigSchema.mjs";
import { sendNotification } from "./notificationController.mjs";

export const createBid = async (req, res) => {
  try {
    const { gigId } = req.params;
    const { price, proposal } = req.body;

    if (!price || !proposal) {
      return res
        .status(400)
        .json({ message: "Enter the required information" });
    }

    const foundGig = await gig.findById(gigId);
    if (!foundGig) {
      return res.status(404).json({ message: "Gig not found" });
    }
    if (foundGig.client.toString() === req.user) {
      return res
        .status(403)
        .json({ message: "You cannot bid on your own gig" });
    }

    if (foundGig.status !== "open") {
      return res
        .status(400)
        .json({ message: "This gig is no longer accepting bids" });
    }

    const newBid = await bid.create({
      gig: foundGig._id,
      freelancer: req.user,
      price,
      proposal,
    });

    const io = req.app.get("io"); // grab the io object (remember, we attached it to app earlier)
    await sendNotification(io, {
      userId: foundGig.client,
      type: "new_bid",
      message: `You received a new bid on "${foundGig.title}"`,
      link: `/gigs/${foundGig._id}`,
    });

    res.status(201).json({ bid: newBid });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

export const getMyBids = async (req, res) => {
  try {
    const myBids = await bid.find({ freelancer: req.user }).populate("gig");

    res.status(200).json({ bids: myBids });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
