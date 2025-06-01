import { Request, Response } from "express";
import webPush from "web-push";

let subscriptions = new Map();

export const subscribe = async (req: Request, res: Response) => {
    try {
        const { userId, subscription } = req.body;
        subscriptions.set(userId, subscription);
        console.log("test ------------- >", subscriptions);
        res.status(201).json({ message: "Subscribed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server Error" });
    }
};

export const send = async (userIds: string[]) => {
    try {
        
        const notificationPayload = JSON.stringify({
            title: "New Notification",
            body: "You have a new message!",
        });

        
        const sendPromises = userIds.map((userId) =>
            webPush
                .sendNotification(
                    subscriptions.get(userId),
                    notificationPayload
                )
                .catch((err) => console.error(err))
        );

        await Promise.all(sendPromises);
        // res.status(200).json({ message: "Notifications sent" });
    } catch (error) {
        console.error(error);
        // res.status(500).json({ message: "iternal server Error" });
    }
};
