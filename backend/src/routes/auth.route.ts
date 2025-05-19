import express from "express";
const router = express.Router();

import { SignUp, Login } from "../controllers/auth.controller";
import upload from "../libs/multer";

router.post("/signup", upload.single('profile'), SignUp);
router.get("/login", Login);

export default router;
