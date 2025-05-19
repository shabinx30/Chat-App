import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model";

export const userExist = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const exist = await userModel.find({ email: req.body.email });
        if (exist) {
            return;
        }
        next();
    } catch (error) {
        console.log(
            "Error while checking whethere the user is existing or not"
        );
    }
};
