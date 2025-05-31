import express from "express";
import { config } from "dotenv";
config();
import path from "path";

//config
import { connectDB } from "./libs/db.config";
import { server, app } from "./libs/socket";
import cors, { CorsOptions } from "cors";
import bodyParser from "body-parser";
import webPush from "web-push";

const allowedOrigins = [
    "http://localhost:3003",
    "https://chat.tungstenz.online",
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
app.use(bodyParser.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//route
import userRouter from "./routes/auth.route";
import chatRouter from "./routes/chat.route";
import messageRouter from "./routes/message.route";
app.use("/api/auth", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

const { PUBLIC_KEY, PRIVATE_KEY } = process.env;

if (PUBLIC_KEY && PRIVATE_KEY) {
    webPush.setVapidDetails(
        "mailto:shabeensharih@gmail.com",
        PUBLIC_KEY,
        PRIVATE_KEY
    );
}

let subscriptions: webPush.PushSubscription[] = [];

app.post("/subscribe", (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({ message: "Subscribed" });
});

app.get("/send", async (req, res) => {
    const notificationPayload = JSON.stringify({
        title: "New Notification",
        body: "You have a new message!",
    });

    const sendPromises = subscriptions.map((sub) =>
        webPush
            .sendNotification(sub, notificationPayload)
            .catch((err: any) => console.error("Send error", err))
    );

    await Promise.all(sendPromises);
    res.status(200).json({ message: "Notifications sent" });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
    connectDB();
});
