import db from "../config/db.js";

// CREATE - Add new category
export const createCategory = async (req, res) => {
  try {
    const { cname, AID } = req.body;

    const sql = "INSERT INTO category (cname, AID) VALUES (?, ?)";
    const [result] = await db.query(sql, [cname, AID]);

    res.json({ CTID: result.insertId, cname, AID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ - Get all categories
export const getCategories = async (req, res) => {
  try {
    const sql = "SELECT * FROM category";
    const [results] = await db.query(sql);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ - Get category by ID
export const getCategoryById = async (req, res) => {
  try {
    const sql = "SELECT * FROM category WHERE CTID = ?";
    const [result] = await db.query(sql, [req.params.id]);

    if (result.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE - Update category
export const updateCategory = async (req, res) => {
  try {
    const { cname, AID } = req.body;
    const sql = "UPDATE category SET cname=?, AID=? WHERE CTID=?";
    await db.query(sql, [cname, AID, req.params.id]);

    res.json({ message: "Category updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE - Delete category
export const deleteCategory = async (req, res) => {
  try {
    const sql = "DELETE FROM category WHERE CTID=?";
    await db.query(sql, [req.params.id]);

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
