import express from "express"
const router = express.Router()

import { SignUp, Login } from "../controllers/auth.controller"

router.post('/signup', SignUp)
router.get('/login', Login)

export default router