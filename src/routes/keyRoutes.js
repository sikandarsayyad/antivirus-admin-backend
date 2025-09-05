import express from "express";
import { 
  getSoldKeys, 
  createSoldKey, 
  updateSoldKey, 
  deleteSoldKey, 
  createKeys, 
  getAllKeys,
  updateKey,      // ✅ newly added
  deleteKey       // ✅ newly added
} from "../controllers/keyController.js";

const router = express.Router();

/**
 * ============================
 * SOLD KEYS ROUTES
 * ============================
 */

/**
 * @route   GET /api/keys/soldkeys
 * @desc    Get all sold keys
 */
router.get("/soldkeys", getSoldKeys);

/**
 * @route   POST /api/keys/soldkeys
 * @desc    Add a new sold key
 */
router.post("/soldkeys", createSoldKey);

/**
 * @route   PUT /api/keys/soldkeys/:id
 * @desc    Update a sold key by SQID
 */
router.put("/soldkeys/:id", updateSoldKey);

/**
 * @route   DELETE /api/keys/soldkeys/:id
 * @desc    Delete a sold key by SQID
 */
router.delete("/soldkeys/:id", deleteSoldKey);

/**
 * ============================
 * KEYS (qeys table) ROUTES
 * ============================
 */

/**
 * @route   POST /api/keys/add
 * @desc    Insert multiple product keys into keys table
 */
router.post("/add", createKeys);

/**
 * @route   POST /api/keys
 * @desc    Insert multiple product keys into keys table (shortcut for frontend)
 */
router.post("/", createKeys);

/**
 * @route   GET /api/keys
 * @desc    Get all product keys from keys table
 */
router.get("/", getAllKeys);

/**
 * @route   PUT /api/keys/:id
 * @desc    Update a product key by QID
 */
router.put("/:id", updateKey);

/**
 * @route   DELETE /api/keys/:id
 * @desc    Delete a product key by QID
 */
router.delete("/:id", deleteKey);

export {router as keyRouter};