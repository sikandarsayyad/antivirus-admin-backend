import express from "express";
import { addReview, deleteReview, getReviews } from "../controllers/reviewController.js";

const router = express.Router();

router.get("/", getReviews);
router.post("/", addReview);
router.delete("/:id", deleteReview);

export {router as reviewRouter};
