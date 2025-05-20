import { Router } from "express"
const router = Router()

import { addContact, getContacts } from "../controllers/chat.controller"

router.post('/addContact', addContact)
router.post('/getcontacts', getContacts)


export default router