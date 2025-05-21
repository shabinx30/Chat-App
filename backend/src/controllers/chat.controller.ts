import { Request, Response } from "express";
import userModel from "../models/user.model";
import chatModel from "../models/chat.model";

export const addContact = async (req: Request, res: Response) => {
    try {
        //userId not available right now
        const { userId, member, isGroup } = req.body;

        const user = await userModel.findOne({ email: member });
        if (!user) {
            res.status(401).json({ message: "User is not existing!!!" });
            return;
        }

        const result = new chatModel({
            userId,
            members: [
                {
                    userId: user._id,
                },
            ],
            isGroup,
            lastMessageAt: Date.now(),
        });
        await result.save();

        res.status(201).json({ message: "success" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server Error" });
    }
};

export const getContacts = async (req: Request, res: Response) => {
    try {
        const userId = req.body.userId;

        const chat = await chatModel.find({userId}).populate("members.userId")
        // console.log(chat)
        res.status(201).json({chat})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server Error" });
    }
};
