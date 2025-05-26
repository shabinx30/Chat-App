import { Request, Response } from "express";
import messageModel from "../models/message.model";
import chatModel from "../models/chat.model";
import { DefaultEventsMap, Server } from "socket.io";

interface sndMsgType {
    data: {
        msg: string;
        chatId: string;
        from: string;
        to: string;
    };
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
            { $set: { lastMessageAt: new Date() } }
        );

        let message = { ...result.toObject(), tosChat: chatId };

        io.to(map.get(to)).emit("chat message", message);
    } catch (error) {
        console.log("Error while sending message", error);
    }
};
