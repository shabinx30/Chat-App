import { Router } from "express";
const router = Router();

import { SignUp, Login, Start } from "../controllers/auth.controller";
import upload from "../middlewares/multer";

router.post("/signup", upload.single("profile"), SignUp);
router.post("/login", Login);

// temperorly for avoiding cold start from render
router.get('/start', Start)

export default router;
