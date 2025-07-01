import { Request, Response } from "express";
import messageModel from "../models/message.model";
import chatModel from "../models/chat.model";
import { DefaultEventsMap, Server } from "socket.io";
import { send } from "./notify.controller";
import userModel from "../models/user.model";
import cloudinary from "../utils/cloudinary";

interface msgData {
    body?: string;
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
        const { chatId, userId } = req.query;

        // Basic validation
        if (!chatId || !userId) {
            res.status(400).json({
                message: "chatId and userId are required.",
            });
            return;
        }

        // Check if the user is part of the chat
        const chatExists = await chatModel.findOne({
            _id: chatId,
            "members.userId": userId,
        });

        if (!chatExists) {
            res.status(401).json({
                message: "Unauthorized: You are not a member of this chat.",
            });
            return;
        }

        // Fetch chat with populated members and messages in parallel
        const [chat, messages] = await Promise.all([
            chatModel.findById(chatId).populate("members.userId"),
            messageModel.find({ chatId }),
        ]);

        if (!chat) {
            res.status(404).json({ message: "Chat not found." });
            return;
        }

        res.status(200).json({ chat, messages });
    } catch (error) {
        console.error("Error in getMessages:", error);
        res.status(500).json({ message: "Internal Server Error" });
        return 
    }
};

export const sendMessage = async ({ data, io, map }: sndMsgType) => {
    try {
        const { chatId, body, to, from, hasMedia, media, mediaType } = data;

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
            body,
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

        await send({ users, body, chatId, user });
    } catch (error) {
        console.error("Error while sending message", error);
    }
};

export const sendTypingStatus = async ({ data, io, map }: sndMsgType) => {
    try {
        const { to, chatId, typing } = data;
        io.to(map.get(to)).emit("typing", { chatId, typing });
    } catch (error) {
        console.error("Error while sending typing indecator", error);
    }
};
