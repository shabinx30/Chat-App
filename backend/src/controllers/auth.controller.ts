import { Request, Response } from "express";
import userModel from "../models/user.model";
import bcrypt from "bcryptjs";

interface userDetails {
    name: string;
    profile: string;
    email: string;
}

const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

export const SignUp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email }: userDetails = req.body;

        //validating the user
        const exist = await userModel.findOne({ email: email });
        if (exist) {
            res.status(409).json({ message: "User is already is existing." });
            return;
        }

        const profile = req.file?.path;
        const password = await hashPassword(req.body.password);

        const result = new userModel({
            name,
            profile,
            email,
            password,
        });
        await result.save();
        res.status(201).json({
            message: "success",
            user: { userId: result._id, name, profile, email },
        });
    } catch (error) {
        console.log("while Login", error);
        res.status(500).json({ message: "Error while creating an user." });
    }
};

export const Login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User is not existing!!!" });
            return;
        }

        //validating the password
        if (!(await bcrypt.compare(password, user.password))) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        res.status(201).json({
            message: "success",
            user: { userId: user._id, email },
        });
    } catch (error) {
        console.log("while Login", error);
        res.status(500).json({ message: "Error while login." });
    }
};
