import { Request, Response } from "express";
import messageModel from "../models/message.model";
import chatModel from "../models/chat.model";
import { DefaultEventsMap, Server } from "socket.io";
import { send } from "./notify.controller";
import userModel from "../models/user.model";
import cloudinary from "../utils/cloudinary";

interface msgData {
    msg?: string;
    chatId: string;
    from?: string;
    to: string;
    typing?: boolean;
    hasMedia?: boolean;
    media?: string;
    mediaType?: string;
}

interface sndMsgType {
    data: msgData;
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
    map: Map<string, any>;
}

export const getMessages = async (req: Request, res: Response) => {
    try {
        const { chatId } = req.body;
        const chat = await chatModel
            .findOne({ _id: chatId })
            .populate("members.userId");
        const messages = await messageModel.find({ chatId });

        // console.log(chat)
        res.status(200).json({ messages, chat });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server Error" });
    }
};

export const sendMessage = async ({ data, io, map }: sndMsgType) => {
    try {
        const { chatId, msg, to, from, hasMedia, media, mediaType } = data;

        console.log(data);
        //uloading the media into cloudinary
        let url;

        if (hasMedia && media) {
            const base64 = media.split(",")[1];
            const mimeType = media.split(",")[0].split(":")[1].split(";")[0];

            const uploadResult = await cloudinary.uploader
                .upload(`data:${mimeType};base64,${base64}`, {
                    public_id: `media_${Date.now()}`,
                })
                .catch((error) => {
                    console.log("Cloudinary error:", error);
                });

            url = uploadResult?.url;
        }

        let result = new messageModel({
            chatId,
            body: msg || '',
            to,
            from,
            hasMedia,
            media: url,
            mediaType,
        });
        await result.save();

        await chatModel.updateOne(
            { _id: chatId },
            { $set: { lastMessageAt: Date.now() } }
        );

        let message = { ...result.toObject(), tosChat: chatId };

        io.to(map.get(to)).emit("chat message", message);

        //not optimized for group
        const users = await userModel.find({ _id: to });
        const user = await userModel.findOne({ _id: from });

        await send({ users, body: msg, chatId, user });
    } catch (error) {
        console.log("Error while sending message", error);
    }
};

export const sendTypingStatus = async ({ data, io, map }: sndMsgType) => {
    try {
        const { to, chatId, typing } = data;
        io.to(map.get(to)).emit("typing", { chatId, typing });
    } catch (error) {
        console.log("Error while sending typing indecator", error);
    }
};
