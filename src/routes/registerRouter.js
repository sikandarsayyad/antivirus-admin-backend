import express from "express";
import { registerUser} from "../controllers/registerUserController.js";

const router = express.Router();


router.get("/users", registerUser);

export {router as registerRouter};