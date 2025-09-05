import express from "express";
import { LogIn} from "../controllers/authController.js";

const router = express.Router();


router.post("/login", LogIn);


export { router as authRouter };
