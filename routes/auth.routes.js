import { Router } from "express";
import multer from "multer";
import path from "path";
import * as authControllers from "../controller/auth.controllers.js";
import upload from "../middleware/upload.js";


const router = Router();


router.route("/register").post(upload.single("userImage"),authControllers.registerUser);

router.route("/login").post(authControllers.loginUser);

export const authRoutes = router;