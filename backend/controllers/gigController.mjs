import { gig } from "../model/gigSchema.mjs";
import { bid as Bid } from "../model/bidSchema.mjs";
import { sendNotification } from "./notificationController.mjs";
import mongoose from "mongoose";

export const createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Please write up a title and description" });
    }

    const newGig = await gig.create({
      client: req.user,
      title,
      description,
      budget,
    });

    res.status(201).json({ gig: newGig });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

export const getAllGigs = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const filter = { status: "open" };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    const getGigs = await gig
      .find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    if (getGigs.length == 0) {
      return res.status(200).json({ message: "No gigs out yet" });
    }

    const totalGigs = await gig.countDocuments(filter);
    res.status(200).json({
      gigs: getGigs,
      totalGigs,
      totalPages: Math.ceil(totalGigs / limit),
      currentPage: Number(page),
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

export const getGig = async (req, res) => {
    try {
        const { id } = req.params;

        const foundGig = await gig.findById(id).populate("client");
        if (!foundGig) {
            return res.status(404).json({ message: "Gig not found" });
        }

        const bids = await Bid.find({ gig: id });

        res.status(200).json({ gig: foundGig, bids });

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

export const updateGig= async (req,res)=>{
  try{
    const {id} = req.params
    const foundGig =await gig.findById(id);

    if(!foundGig) return res.status(400).json({"message":"Gig not found"})
    
    if (foundGig.client.toString() !== req.user){
      return res.status(403).json({"message":"Not authorized to edit the gig"})
    }

    if (foundGig.status !== "open"){
      return res.status(400).json({"message":"Cannot edit gig that is no longer opened"})
    }

    const {title,description,budget}= req.body
    if (title){
      foundGig.title = title;
    }
    if (description){
      foundGig.description=description;
    }
    if (budget){
      foundGig.budget=budget
    }

    await foundGig.save()
    res.status(200).json({gig:foundGig})

  }catch(err){
    console.log(err)
    res.sendStatus(500)
  }
}

export const cancelGig = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const { id } = req.params;
        const foundGig = await gig.findById(id).session(session);

        if (!foundGig) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Gig not found" });
        }

        if (foundGig.client.toString() !== req.user) {
            await session.abortTransaction();
            return res.status(403).json({ message: "Not authorized to edit this gig" });
        }

        if (foundGig.status !== "open") {
            await session.abortTransaction();
            return res.status(400).json({ message: "Can't cancel this" });
        }

        const pendingBids = await Bid.find({ gig: id, status: "pending" }).session(session);

        await Bid.updateMany(
            { gig: id, status: "pending" },
            { status: "rejected" },
            { session }
        );

        foundGig.status = "cancelled";
        await foundGig.save({ session });

        await session.commitTransaction();

        const io = req.app.get("io");
        for (const bid of pendingBids) {
            await sendNotification(io, {
                userId: bid.freelancer,
                type: "bid_rejected",
                message: `Your bid on "${foundGig.title}" has been rejected because the gig was cancelled`,
                link: `/gigs/${foundGig._id}`,
            });
        }

        res.status(200).json({ message: "Gig cancelled", gig: foundGig });

    } catch (err) {
        await session.abortTransaction();
        console.log(err);
        res.sendStatus(500);
    } finally {
        session.endSession();
    }
}

export const completeGig = async (req, res) => {
    try {
        const { id } = req.params;
        const foundGig = await gig.findById(id);

        if (!foundGig) return res.status(404).json({ message: "Gig not found" });

        if (foundGig.client.toString() !== req.user) {
            return res.status(403).json({ message: "Not authorized to edit this gig" });
        }

        if (foundGig.status !== "in progress") {
            return res.status(400).json({ message: "Only gigs in progress can be marked complete" });
        }

        foundGig.status = "completed";
        await foundGig.save();

        const winningBid = await Bid.findById(foundGig.acceptedBid);

        const io= req.app.get("io");
        await sendNotification(io,{
            userId: winningBid.freelancer,
            type:"gig_status_changed",
            message:`The gig "${foundGig.title}" has been marked as completed`,
            link:`/gigs/${foundGig._id}`
        })

        res.status(200).json({ message: "Gig marked as completed", gig: foundGig });

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

export const acceptBid = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const { id: gigId } = req.params;
        const { bidId } = req.body;

        const foundGig = await gig.findById(gigId).session(session);
        if (!foundGig) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Gig not found" });
        }

        if (foundGig.client.toString() !== req.user) {
            await session.abortTransaction();
            return res.status(403).json({ message: "Not authorized to edit this gig" });
        }

        if (foundGig.status !== "open") {
            await session.abortTransaction();
            return res.status(400).json({ message: "This gig is no longer accepting bids" });
        }

        const winningBid = await Bid.findById(bidId).session(session);
        if (!winningBid) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Bid not found" });
        }

        if (winningBid.gig.toString() !== gigId) {
            await session.abortTransaction();
            return res.status(400).json({ message: "This bid does not belong to this gig" });
        }

        winningBid.status = "accepted";
        await winningBid.save({ session });

        const otherBids = await Bid.find({ gig: gigId, _id: { $ne: bidId } }).session(session);

        await Bid.updateMany(
            { gig: gigId, _id: { $ne: bidId } },
            { status: "rejected" },
            { session }
        );

        foundGig.status = "in progress";
        foundGig.acceptedBid = winningBid._id;
        await foundGig.save({ session });

        await session.commitTransaction();

        // 🔴 notifications only fire once we're SURE everything saved
        const io = req.app.get("io");

        await sendNotification(io, {
            userId: winningBid.freelancer,
            type: "bid_accepted",
            message: `Your bid on "${foundGig.title}" was accepted!`,
            link: `/gigs/${foundGig._id}`,
        });

        for (const bid of otherBids) {
            await sendNotification(io, {
                userId: bid.freelancer,
                type: "bid_rejected",
                message: `Your bid on "${foundGig.title}" has been rejected`,
                link: `/gigs/${foundGig._id}`,
            });
        }

        res.status(200).json({ message: "Bid accepted", gig: foundGig, acceptedBid: winningBid });

    } catch (err) {
        await session.abortTransaction();
        console.log(err);
        res.sendStatus(500);
    } finally {
        session.endSession();
    }
}