import { Request, Response } from "express"
import userModel from "../models/user.model";
import bcrypt from "bcryptjs"

interface userDetails {
    name: string;
    profile: string;
    email: string;
}


const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10)
}


export const SignUp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, profile, email }: userDetails = req.body

        const password = await hashPassword(req.body.password)

        const result = new userModel({
            name,
            profile,
            email,
            password
        })
        await result.save()
        res.status(201).json({ user: { name, profile, email, password } })
    } catch (error) {
        console.log('while Login', error)
        res.status(500).json({ message: 'Error while creating an user.' })
    }
}


export const Login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body

    } catch (error) {
        console.log('while Login', error)
    }
}