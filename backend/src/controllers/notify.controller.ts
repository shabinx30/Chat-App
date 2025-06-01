import { Request, Response } from "express";
import { Document } from "mongoose";
import webPush from "web-push";
import { userDetails } from "../models/user.model";

type usersData = (Document<unknown, {}, userDetails, {}> &
    userDetails &
    Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[];

let subscriptions = new Map();

export const subscribe = async (req: Request, res: Response) => {
    try {
        const { userId, subscription } = req.body;
        subscriptions.set(userId, subscription);
        // console.log("test ------------- >", subscriptions);
        res.status(201).json({ message: "Subscribed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server Error" });
    }
};

export const send = async (users: usersData, body: string | undefined) => {
    try {
        const sendPromises = users.map((user) => {
            const notificationPayload = JSON.stringify({
                title: user.name,
                body,
                icon: `${process.env.SERVER_URL}/${user.profile}`
            });
            // console.log(subscriptions.get(user._id))
            
            webPush
                .sendNotification(
                    subscriptions.get(user._id && user._id.toString()),
                    notificationPayload
                )
                .catch((err) => console.error(err));
        });

        await Promise.all(sendPromises);
        // res.status(200).json({ message: "Notifications sent" });
    } catch (error) {
        console.error(error);
        // res.status(500).json({ message: "iternal server Error" });
    }
};
