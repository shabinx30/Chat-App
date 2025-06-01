import { Request, Response } from "express";
import messageModel from "../models/message.model";
import chatModel from "../models/chat.model";
import { DefaultEventsMap, Server } from "socket.io";
import { send } from "./notify.controller";
import userModel from "../models/user.model";

interface msgData {
    msg?: string;
    chatId: string;
    from?: string;
    to: string;
    typing?: boolean;
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
        res.status(201).json({ messages, chat });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server Error" });
    }
};

export const sendMessage = async ({ data, io, map }: sndMsgType) => {
    try {
        const { chatId, msg, to, from } = data;

        let result = new messageModel({
            chatId,
            body: msg,
            to,
            from,
        });
        await result.save();

        await chatModel.updateOne(
            { chatId },
            { $set: { lastMessageAt: Date.now() } }
        );

        let message = { ...result.toObject(), tosChat: chatId };

        io.to(map.get(to)).emit("chat message", message);
 
        //not optimized for group
        const user = await userModel.find({_id: to})

        await send(user, msg)
    } catch (error) {
        console.log("Error while sending message", error);
    }
};

export const sendTypingStatus = async ({ data, io, map }: sndMsgType) => {
    try {
        const { to, chatId, typing } = data;
        io.to(map.get(to)).emit("typing", {chatId, typing})
    } catch (error) {
        console.log("Error while sending typing indecator", error);
    }
};
