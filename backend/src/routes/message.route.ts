import { Router } from "express";
const router = Router()
import { getMessages } from "../controllers/message.controller";

router.get('/getmessages', getMessages)

export default router