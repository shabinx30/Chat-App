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
        const tosChat = await chatModel.findOne({
            $and: [{ userId: to }, { "members.userId": from }],
        });

        if (!tosChat) {
            const result = new chatModel({
                userId: to,
                members: [
                    {
                        userId: from,
                    },
                ],
                isGroup: false,
                lastMessageAt: Date.now(),
            });
            await result.save();

            new messageModel({
                chatId: result._id,
                body: msg,
                from,
                to,
            }).save();
        }

        if (tosChat) {
            new messageModel({
                chatId: tosChat._id,
                body: msg,
                from,
                to,
            }).save();
        }

        let result = new messageModel({
            chatId,
            body: msg,
            from,
            to,
        });
        // console.log(message)
        await result.save();

        let message = { ...result.toObject(), tosChat: tosChat?._id };

        io.to(map.get(to)).emit("chat message", message);
    } catch (error) {
        console.log("Error while sending message", error);
    }
};
