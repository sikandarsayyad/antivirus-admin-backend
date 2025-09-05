import express from "express";
import { getSalesSummary } from "../controllers/salesController.js";

const router = express.Router();

// GET /api/sales/summary
router.get("/summary", getSalesSummary);

export { router as salesRouter };
