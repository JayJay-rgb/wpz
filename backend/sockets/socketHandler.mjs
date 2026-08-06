import jwt from "jsonwebtoken";
import { conversation } from "../model/conversationSchema.mjs";

export const setupSocket = (io) => {

    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(new Error("Authentication error: no token provided"));
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return next(new Error("Authentication error: invalid token"));
            }
            socket.userId = decoded.id;
            next();
        });
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.userId);

        socket.on("joinConversation", async (conversationId) => {
            try {
                const existingConversation = await conversation.findById(conversationId);

                if (!existingConversation) {
                    return socket.emit("error", { message: "Conversation not found" });
                }

                const isParticipant = existingConversation.participants.some(
                    p => p.toString() === socket.userId
                );

                if (!isParticipant) {
                    return socket.emit("error", { message: "Not authorized to join this conversation" });
                }

                socket.join(conversationId);
                console.log(`User ${socket.userId} joined conversation ${conversationId}`);

            } catch (err) {
                console.log(err);
                socket.emit("error", { message: "Something went wrong" });
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.userId);
        });
    });
}