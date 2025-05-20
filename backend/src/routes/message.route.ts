import { Router } from "express";
const router = Router()
import { getMessages } from "../controllers/message.controller";

router.post('/getmessages', getMessages)

export default router