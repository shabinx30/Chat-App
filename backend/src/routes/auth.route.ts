import express from "express"
const router = express.Router()

import authController from "../controllers/auth.controller"

router.get('/signup', authController.Login)
router.get('/login', (req, res) => {
    res.send('login anne')
})
router.get('/logout', (req, res) => {
    res.send('logout anne')
})

export default router