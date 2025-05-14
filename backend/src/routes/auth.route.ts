import express from "express"
const router = express.Router()

import authController from "../controllers/auth.controller"

router.get('/signup', authController.SignUp)
router.get('/login', authController.Login)
router.get('/logout', authController.Logout)

export default router