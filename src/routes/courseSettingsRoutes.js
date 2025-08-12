//courseSettingsRoutes.j

import express from "express";
import { addCourseSetting, fetchCourseSettings } from "../controllers/courseSettingsController.js";

const router = express.Router();

 // Add data
router.get("/:type", fetchCourseSettings); // Fetch data by type

export default router;