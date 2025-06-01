import { Router } from "express";
const router = Router();
import { subscribe } from "../controllers/notify.controller";

router.post("/subscribe", subscribe);

export default router