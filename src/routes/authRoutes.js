import express from "express";
import { signIn,forgotPassword, getUserFromToken, register, resetPassword, updateEmailSetting,sendTestLink } from "../controllers/authController.js";

const router = express.Router();

router.post("/register-user", register);
router.post("/signin", signIn);
router.post("/get-user-data", getUserFromToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/updateEmailSetting", updateEmailSetting);
router.post("/send-test-link", sendTestLink);


export { router as authRouter };
