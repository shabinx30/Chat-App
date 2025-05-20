import { Router } from "express"
const router = Router()

import { addContact } from "../controllers/chat.controller"

router.post('/addContact', addContact)


export default router