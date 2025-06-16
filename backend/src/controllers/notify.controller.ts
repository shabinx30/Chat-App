import { Request, Response } from "express";
import { Document } from "mongoose";
import webPush from "web-push";
import { userDetails } from "../models/user.model";

type usersData =
    | (Document<unknown, {}, userDetails, {}> &
          userDetails &
          Required<{
              _id: unknown;
          }> & {
              __v: number;
          })
    | null;


interface sendType {
    users: usersData[];
    body: string | undefined;
    chatId: string;
    user: usersData;
}

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

// export const send = async (users: usersData, body: string | undefined, chatId: string, profile: string | undefined) => {
export const send = async ({ users, body, chatId, user }: sendType) => {
    try {
        const sendPromises = users.map((to) => {
            if (subscriptions.get(to?._id && to._id.toString())) {
                const notificationPayload = JSON.stringify({
                    title: user?.name,
                    body,
                    icon: user?.profile,
                    chatId,
                });
                // console.log(subscriptions.get(user))

                webPush
                    .sendNotification(
                        subscriptions.get(to?._id && to._id.toString()),
                        notificationPayload
                    )
                    .catch((err) => console.error(err));
            }
        });

        await Promise.all(sendPromises);
        // res.status(200).json({ message: "Notifications sent" });
    } catch (error) {
        console.error(error);
        // res.status(500).json({ message: "iternal server Error" });
    }
};
