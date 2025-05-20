import { Router } from "express";
const router = Router();

import { SignUp, Login } from "../controllers/auth.controller";
import upload from "../libs/multer";

router.post("/signup", upload.single("profile"), SignUp);
router.post("/login", Login);

export default router;
