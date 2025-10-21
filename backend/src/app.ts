import express from "express";
import { config } from "dotenv";
config();

//config
import { connectDB } from "./libs/db.config";
import { server, app } from "./libs/socket";
import cors, { CorsOptions } from "cors";
import webPush from "web-push";

const allowedOrigins = [
    "http://localhost:3003",
    "https://chat.tungstenz.online",
    "https://chat-app-taupe-zeta.vercel.app",
];

const corsOptions: CorsOptions = {
    origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
    ) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//route
import userRouter from "./routes/auth.route";
import chatRouter from "./routes/chat.route";
import messageRouter from "./routes/message.route";
import notifyRouter from "./routes/notify.route";
app.use("/api/auth", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/notify", notifyRouter);

const { PUBLIC_KEY, PRIVATE_KEY } = process.env;

if (PUBLIC_KEY && PRIVATE_KEY) {
    webPush.setVapidDetails(
        "mailto:shabeensharih@gmail.com",
        PUBLIC_KEY,
        PRIVATE_KEY
    );
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
    connectDB();
});
