// routes/brandRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import {
  addBrand,
  listBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} from "../controllers/brandController.js";

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "model/pics");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${file.originalname.split(".")[0]}${new Date()
      .toISOString()
      .replace(/[-:.]/g, "_")}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Routes
router.post("/", upload.single("br_img"), addBrand);
router.get("/", listBrands);
router.get("/:id", getBrandById);           // <-- getById route added
router.put("/:id", upload.single("br_img"), updateBrand);
router.delete("/:id", deleteBrand);

export {router as brandRouter};
