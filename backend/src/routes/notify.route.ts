import { Router } from "express";
const router = Router();
import { subscribe, send } from "../controllers/notify.controller";

router.post("/subscribe", subscribe);
router.post("/send", send);

export default router