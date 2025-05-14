import { Request, Response } from "express"

const Login = async (req: Request, res: Response) => {
    try {
        const { fullName, profile, email, password } = req.body

    } catch (error) {
        console.log('while Login', error)
    }
}

const SignUp = async (req: Request, res: Response) => {
    try {
        const { fullName, profile, email, password } = req.body
        
    } catch (error) {
        console.log('while Login', error)
    }
}

const Logout = async (req: Request, res: Response) => {
    try {
        const { fullName, profile, email, password } = req.body
        
    } catch (error) {
        console.log('while Login', error)
    }
}

export default {
    Login,
    SignUp,
    Logout
}