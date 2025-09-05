import db from "../config/db.js";

/**
 * ============================
 * SOLD KEYS (soldq table)
 * ============================
 */

// Get all sold keys
export const getSoldKeys = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        SQID,
        txnid AS orderId,
        pname AS product,
        tprice AS amount,
        name AS customer,
        key1 AS licenseKey,
        invoice,
        sdate AS soldAt
      FROM soldq
      ORDER BY SQID DESC
    `);

    res.status(200).json(results);
  } catch (err) {
    console.error("❌ Error fetching sold keys:", err.message);
    res.status(500).json({
      message: "Database error while fetching sold keys",
      error: err.message,
    });
  }
};

// Add a sold key
export const createSoldKey = async (req, res) => {
  try {
    const { orderId, product, amount, customer, licenseKey, invoice, soldAt } =
      req.body;

    if (!orderId || !product || !amount || !customer || !licenseKey) {
      return res.status(400).json({
        message:
          "Missing required fields: orderId, product, amount, customer, licenseKey",
      });
    }

    const [result] = await db.query(
      `INSERT INTO soldq 
        (txnid, pname, tprice, name, key1, invoice, sdate) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        product,
        amount,
        customer,
        licenseKey,
        invoice || "",
        soldAt || new Date(),
      ]
    );

    res.status(201).json({
      message: "Sold key created successfully",
      insertedId: result.insertId,
    });
  } catch (err) {
    console.error("❌ Error creating sold key:", err.message);
    res.status(500).json({
      message: "Database error while creating sold key",
      error: err.message,
    });
  }
};

// Update sold key
export const updateSoldKey = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderId, product, amount, customer, licenseKey, invoice, soldAt } =
      req.body;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const [existing] = await db.query("SELECT * FROM soldq WHERE SQID = ?", [
      id,
    ]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    const [result] = await db.query(
      `UPDATE soldq 
       SET txnid=?, pname=?, tprice=?, name=?, key1=?, invoice=?, sdate=? 
       WHERE SQID=?`,
      [orderId, product, amount, customer, licenseKey, invoice, soldAt, id]
    );

    res.status(200).json({
      message: "Updated successfully",
      updatedId: id,
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    console.error("❌ Error updating sold key:", err.message);
    res.status(500).json({
      message: "Database error while updating sold key",
      error: err.message,
    });
  }
};

// Delete sold key
export const deleteSoldKey = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const [results] = await db.query("DELETE FROM soldq WHERE SQID = ?", [id]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json({ message: "Deleted successfully", deletedId: id });
  } catch (err) {
    console.error("❌ Error deleting sold key:", err.message);
    res.status(500).json({
      message: "Database error while deleting sold key",
      error: err.message,
    });
  }
};

/**
 * ============================
 * ADD KEYS (qeys table)
 * ============================
 */

// Add multiple keys to qeys table
export const createKeys = async (req, res) => {
  try {
    // Frontend sends { product, distributor, invoiceNo, purchasePrice, keys }
    const { product, distributor, invoiceNo, purchasePrice, keys } = req.body;

    if (!product || !distributor || !invoiceNo || !keys?.length || !purchasePrice) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Prepare multiple values
    const values = keys.map((key) => [
      product,            // PID (product id or name depending on schema)
      distributor,        // distributer
      invoiceNo,          // invoice
      null,               // validity (optional)
      key,                // qey (actual key string)
      null,               // pname (optional - could be resolved via PID later)
      0,                  // d_id default
      purchasePrice,      // p_price
      new Date(),         // cdate
    ]);

    const [result] = await db.query(
      `INSERT INTO qeys 
        (PID, distributer, invoice, validity, qey, pname, d_id, p_price, cdate) 
       VALUES ?`,
      [values]
    );

    res.status(201).json({
      message: "Keys added successfully",
      insertedCount: result.affectedRows,
    });
  } catch (err) {
    console.error("❌ Error inserting keys:", err.message);
    res.status(500).json({
      message: "Database error while inserting keys",
      error: err.message,
    });
  }
};

// Get all qeys (keys table)
export const getAllKeys = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        QID,
        PID,
        pname,
        distributer,
        invoice,
        validity,
        qey,
        d_id,
        p_price,
        cdate
      FROM qeys
      ORDER BY QID DESC
    `);

    res.status(200).json(results);
  } catch (err) {
    console.error("❌ Error fetching all keys:", err.message);
    res.status(500).json({
      message: "Database error while fetching keys",
      error: err.message,
    });
  }
};

/**
 * ============================
 * UPDATE & DELETE KEYS (qeys)
 * ============================
 */

// Update key in qeys
export const updateKey = async (req, res) => {
  try {
    const { id } = req.params;
    const { pname, distributer, invoice, validity, qey, p_price } = req.body;

    if (!id) return res.status(400).json({ message: "ID is required" });

    const [existing] = await db.query("SELECT * FROM qeys WHERE QID = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Key not found" });
    }

    const [result] = await db.query(
      `UPDATE qeys 
       SET pname=?, distributer=?, invoice=?, validity=?, qey=?, p_price=? 
       WHERE QID=?`,
      [pname, distributer, invoice, validity, qey, p_price, id]
    );

    res.status(200).json({ message: "Key updated", updatedId: id });
  } catch (err) {
    console.error("❌ Error updating key:", err.message);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

// Delete key from qeys
export const deleteKey = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "ID is required" });

    const [result] = await db.query("DELETE FROM qeys WHERE QID = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Key not found" });
    }

    res.status(200).json({ message: "Key deleted", deletedId: id });
  } catch (err) {
    console.error("❌ Error deleting key:", err.message);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};