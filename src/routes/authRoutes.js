import express from "express";
import { signIn,forgotPassword, getUserFromToken, register, resetPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/register-user", register);
router.get("/signin", signIn);
router.get("/getUserData", getUserFromToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


export { router as authRouter };
