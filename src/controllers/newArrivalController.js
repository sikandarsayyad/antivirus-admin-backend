// import path from "path";
import multer from "multer";
import db from "../config/db.js";

/**
 * 🔹 GET all Arrival products
 */
export const getArrivalProducts = async (req, res) => {
  try {
    const sql = `
      SELECT 
        dd_id AS id,
        PID AS product,
        dd_img AS image,
        mrp,
        oprice AS offerPrice,
        status
      FROM dealpro_main 
      ORDER BY dd_id DESC
    `;

    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error("DB Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

/**
 * 🔹 POST new arrival product
 */
export const addArrivalProduct = async (req, res) => {
  try {
    const { product, mrp, offerPrice, status } = req.body;
    const image = req.file ? `model/pics/${req.file.filename}` : null;

    const sql = `
      INSERT INTO dealpro_main (PID, dd_img, mrp, oprice, status, dt1)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;

    const [result] = await db.query(sql, [
      product,
      image,
      mrp,
      offerPrice,
      status,
    ]);

    // return updated list instead of only new record
    const [updatedList] = await db.query(
      `SELECT dd_id AS id, PID AS product, dd_img AS image, mrp, oprice AS offerPrice, status 
       FROM dealpro_main ORDER BY dd_id DESC`
    );

    res.json(updatedList);
  } catch (err) {
    console.error("Insert Error:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
};

/**
 * 🔹 DELETE Arrival product
 */
export const deleteArrivalProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM dealpro_main WHERE dd_id = ?", [id]);

    // return updated list
    const [updatedList] = await db.query(
      `SELECT dd_id AS id, PID AS product, dd_img AS image, mrp, oprice AS offerPrice, status 
       FROM dealpro_main ORDER BY dd_id DESC`
    );

    res.json(updatedList);
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

/**
 * 🔹 UPDATE Arrival product
 */
export const updateArrivalProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { product, mrp, offerPrice, status } = req.body;
    const image = req.file ? `model/pics/${req.file.filename}` : null;

    let sql, values;
    if (image) {
      sql = `
        UPDATE dealpro_main 
        SET PID=?, dd_img=?, mrp=?, oprice=?, status=? 
        WHERE dd_id=?
      `;
      values = [product, image, mrp, offerPrice, status, id];
    } else {
      sql = `
        UPDATE dealpro_main 
        SET PID=?, mrp=?, oprice=?, status=? 
        WHERE dd_id=?
      `;
      values = [product, mrp, offerPrice, status, id];
    }

    await db.query(sql, values);

    // return updated list
    const [updatedList] = await db.query(
      `SELECT dd_id AS id, PID AS product, dd_img AS image, mrp, oprice AS offerPrice, status 
       FROM dealpro_main ORDER BY dd_id DESC`
    );

    res.json(updatedList);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
};

/**
 * 🔹 GET Arrival product by ID
 */
export const getArrivalProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT 
        dd_id AS id,
        PID AS product,
        dd_img AS image,
        mrp,
        oprice AS offerPrice,
        status
      FROM dealpro_main
      WHERE dd_id = ?
    `;

    const [results] = await db.query(sql, [id]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(results[0]);
  } catch (err) {
    console.error("DB Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};
