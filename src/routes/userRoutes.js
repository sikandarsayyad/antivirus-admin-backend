import express from "express";
import { 
  getUsers, 
  createUser, 
  updateUser, 
  deleteUser, 
  getUserById 
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export { router as userRouter };