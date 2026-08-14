import express from "express"
import mongoose from "mongoose"
import "dotenv/config"
import cors from "cors";
import connectDB from "./config/db.mjs";
import authRouter from "./routes/auth.mjs";
import registerRouter from "./routes/register.mjs";
import refreshRouter from "./routes/refresh.mjs"
import logoutRouter from "./routes/logout.mjs";
import gigRouter from "./routes/gig.mjs";
import bidRouter from "./routes/bid.mjs";
import meRouter from "./routes/me.mjs";
import userRouter from "./routes/user.mjs";
import messageRouter from "./routes/message.mjs";
import portfolioRouter from "./routes/portfolio.mjs";
import notificationRouter from "./routes/notification.mjs";
import http from "http";
import { Server } from "socket.io";
import { setupSocket } from "./sockets/socketHandler.mjs";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json())
app.use(cookieParser())

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
})
app.set("io", io);

setupSocket(io)

connectDB();
app.use((req, res, next) => {
    console.log(req.method, req.originalUrl);
    next();
});
app.use("/v1", (req, res, next) => {

    next();
});
app.use("/v1",refreshRouter);
app.use("/v1", (req, res, next) => {

    next();
});


app.use("/v1", registerRouter);
app.use("/v1", authRouter);

app.use("/v1", logoutRouter);
app.use("/v1", meRouter);
app.use("/v1", userRouter);
app.use("/v1", gigRouter);
app.use("/v1", bidRouter);
app.use("/v1", messageRouter);
app.use("/v1", portfolioRouter);
app.use("/v1", notificationRouter);


mongoose.connection.once("open", () => {
    console.log("MongoDB connected")
    server.listen(port, () => console.log(`Server running on http://localhost:${port}`))
})