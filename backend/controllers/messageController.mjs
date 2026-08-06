import { conversation } from "../model/conversationSchema.mjs";
import { gig } from "../model/gigSchema.mjs";
import mongoose from "mongoose";
import sendNotification from "./notificationController.mjs"
import { message } from "../model/messageSchema.mjs";

export const startConversation = async (req, res) => {
  try {
    const { recipientId, gigId } = req.body;

    if (!recipientId)
      return res.status(400).json({ message: "No recipient indicated" });
    if (req.user === recipientId)
      return res.status(400).json({ message: "Cannot message yourself" });

    const existing = await conversation.findOne({
      participants: { $all: [req.user, recipientId] },
    });

    if (existing) {
      return res.status(200).json({ conversation: existing });
    }

    let foundGig = null;
    if (gigId) {
      foundGig = await gig.findById(gigId);
      if (!foundGig) return res.status(404).json({ message: "Gig not found" });
    }

    const newConversation = await conversation.create({
      participants: [req.user, recipientId],
      gig: foundGig ? foundGig._id : undefined,
    });

    res.status(201).json({ conversation: newConversation });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

export const getMyConversation = async (req, res) => {
  try {
    const myConversation = await conversation
      .find({
        participants: req.user,
      })
      .sort({ updatedAt: -1 });
    if (myConversation.length === 0)
      return res.status(200).json({ message: "No conversations yet" });

    res.status(200).json({ myConversation });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

export const sendMessage = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { conversationId } = req.params;
    const { content } = req.body;

    const existingConversation = await conversation
      .findById(conversationId)
      .session(session);
    if (!existingConversation) {
      await session.abortTransaction();
      return res.status(404).json({ message: "No conversation found" });
    }

    const isParticipant = existingConversation.participants.some(
      (p) => p.toString() === req.user,
    );
    if (!isParticipant) {
      await session.abortTransaction();
      return res.status(403).json({ message: "Not part of this conversation" });
    }

    const newMessageArr = await message.create(
      [
        {
          conversation: existingConversation._id,
          sender: req.user,
          content,
        },
      ],
      { session },
    );

    const newMessage = newMessageArr[0];

    existingConversation.lastMessage = {
      text: content,
      sender: req.user,
      sentAt: new Date(),
    };
    await existingConversation.save({ session });

    await session.commitTransaction();

    // 🔴 new — emit to the room after commit succeeds
    const io = req.app.get("io");
    io.to(conversationId).emit("newMessage", newMessage);

    const recipientId = existingConversation.participants.find(
      (p) => p.toString() !== req.user,
    );

    await sendNotification(io,{
        userId: recipientId,
        type: "new_message",
        message: content,
        link: `/conversations/${conversationId}`
    })

    res
      .status(201)
      .json({ message: newMessage, conversation: existingConversation });
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    res.sendStatus(500);
  } finally {
    session.endSession();
  }
};

export const getMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const existingCoversation = await conversation.findById(conversationId);
    if (!existingCoversation)
      return res.status(400).json({ message: "No conversation yet" });
    const existingParticpants = existingCoversation.participants.some(
      (p) => p.toString() === req.user,
    );
    if (!existingParticpants)
      return res.status(401).json({ message: "Not allowed" });

    const messages = await message
      .find({ conversation: conversationId })
      .sort({ createdAt: 1 });
    if (messages.length === 0)
      return res.status(200).json({ message: "No messages yet" });
    res.status(200).json({ messages });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
