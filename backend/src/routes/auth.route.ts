import express from "express";
const router = express.Router();

import { SignUp, Login } from "../controllers/auth.controller";
import { userExist } from "../middlewares/auth.middleware";
import upload from "../libs/multer";

router.post("/signup", userExist, upload.single('profile'), SignUp);
router.get("/login", Login);

export default router;
