import express from "express";
import { config } from "dotenv";
config();

//config
import { connectDB } from "./libs/db.config";
import { server, app } from "./libs/socket";
import cors from "cors";

app.use(
    cors({
        origin: "http://localhost:3003",
        methods: ["GET", "POST"],
    })
);

app.use(express.json());

//route
import userRouter from "./routes/auth.route";
import chatRouter from "./routes/chat.route";
import messageRouter from "./routes/message.route";
app.use("/src/uploads", express.static("uploads"));
app.use("/api/auth", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/chat", messageRouter);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
    connectDB();
});
