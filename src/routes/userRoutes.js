import express from "express";
import {
  createUser,
  updateUser,
  deleteUser,
  getUsers,
  getUserById,
} from "../controllers/userController.js";

const router = express.Router();

// CRUD Endpoints
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/", getUsers);
router.get("/:id", getUserById);

export {router as userRouter};
