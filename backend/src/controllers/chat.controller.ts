import { Request, Response } from "express";
import userModel from "../models/user.model";
import chatModel from "../models/chat.model";
import mongoose from "mongoose";

export const addContact = async (req: Request, res: Response) => {
    try {
        const { userId, member, isGroup } = req.body;

        //checking the user is existing or not
        const user = await userModel.findOne({ email: member });
        if (!user) {
            res.status(401).json({ message: "User is not existing!!!" });
            return;
        }

        //checking the chat is already existing or not
        const chat = await chatModel.findOne({
            isGroup: false,
            members: {
                $all: [
                    { $elemMatch: { userId: userId } },
                    { $elemMatch: { userId: user._id } },
                ],
            },
        });

        if (chat) {
            res.status(401).json({ message: "Contact is already existing" });
            return;
        }

        if (!isGroup) {
            const result = new chatModel({
                members: [
                    {
                        userId: userId,
                    },
                    {
                        userId: user._id,
                    },
                ],
                isGroup,
                lastMessageAt: Date.now(),
            });
            await result.save();
            res.status(201).json({ message: "success" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server Error" });
    }
};

export const getContacts = async (req: Request, res: Response) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.body.userId); // ensure it's ObjectId

        let chat = await chatModel
            .find({ "members.userId": userId })
            .populate("members.userId");

        // console.log(result)
        res.status(200).json({ chat });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server Error" });
    }
};

export const searchContacts = async (req: Request, res: Response) => {
    try {
        const { userId, value } = req.body;
        console.log(userId, value)
        const chats = await chatModel
            .find({ "members.userId": userId })
            .populate("members.userId", "name email profile"); 

        
        const chat = chats.filter((chat: any) =>
            chat.members.some((member: any) => {
                const user = member.userId;
                if (user._id.toString() === userId) return false;
                const regex = new RegExp(value, "i");
                return regex.test(user.name) || regex.test(user.email);
            })
        );
        console.log(chat[0].members)
        res.status(201).json({chat})
    } catch (error) {
        console.log('Internal server error', error)
    }
};
