import { Request, Response } from "express";


export const addContact = async (req: Request, res: Response) => {
    try {
        //user id not available right now
        const { userId, member } = req.body
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Internal server Error'})
    }
}