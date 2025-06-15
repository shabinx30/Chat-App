import { Router } from "express"
const router = Router()

import { addContact, getContacts, searchContacts } from "../controllers/chat.controller"

router.post('/addContact', addContact)
router.get('/getcontacts', getContacts)
router.post('/searchcontacts', searchContacts)


export default router