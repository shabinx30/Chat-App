import { Router } from "express"
const router = Router()

import { addContact, getContacts, searchContacts } from "../controllers/chats.controller"

router.post('/addContact', addContact)
router.get('/getcontacts', getContacts)
router.get('/searchcontacts', searchContacts)


export default router