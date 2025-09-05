// controllers/brandController.js
import db from "../config/db.js";

// Add Brand
export const addBrand = async (req, res) => {
  try {
    const { cname, bname, AID } = req.body;

    const sql = "INSERT INTO brand (cname, bname, AID) VALUES (?, ?, ?)";
    const [result] = await db.query(sql, [cname, bname, AID]);

    res.status(201).json({ message: "Brand added successfully", id: result.insertId });
  } catch (err) {
    console.error("Add brand error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

// List Brands
export const listBrands = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM brand ORDER BY BID DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching brands:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get Brand by ID
export const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM brand WHERE BID = ?", [id]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Brand not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error fetching brand by id:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};

// Update Brand
export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { cname, bname, AID } = req.body;

    const [result] = await db.query(
      "UPDATE brand SET cname=?, bname=?, AID=? WHERE BID=?",
      [cname, bname, AID, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: "Brand not found" });

    res.json({ message: "✏️ Brand updated successfully" });
  } catch (err) {
    console.error("❌ Error updating brand:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};

// Delete Brand
export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM brand WHERE BID = ?", [id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Brand not found" });

    res.json({ message: "🗑️ Brand deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting brand:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};
