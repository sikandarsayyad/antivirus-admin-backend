// src/controllers/registerUserController.js
import db from "../config/db.js";

export const registerUser = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT CID, name, email, mobile, state_n, cdate FROM regusers ORDER BY CID DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Database error" });
  }
};