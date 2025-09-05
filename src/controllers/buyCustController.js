import db from "../config/db.js";

// Create Customer
export const createCustomer = async (req, res) => {
  try {
    const { txnid, products, amount, name, email, mobile, city } = req.body;

    if (!txnid || !products || !amount || !name || !email || !mobile || !city) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const sql = `
      INSERT INTO tempcust
      (txnid, products, amount, name, email, mobile, city, date)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    const values = [txnid, products, amount, name, email, mobile, city];

    const [result] = await db.query(sql, values);

    res.status(201).json({ message: "Customer created", id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Customers
export const getCustomers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM tempcust ORDER BY TID DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Customer by ID
export const getCustomerById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM tempcust WHERE TID = ?", [
      req.params.id,
    ]);

    if (rows.length === 0) return res.status(404).json({ message: "Not found" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Customer
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { txnid, products, amount, name, email, mobile, city } = req.body;

    const sql = `
      UPDATE tempcust SET
      txnid=?, products=?, amount=?, name=?, email=?, mobile=?, city=?
      WHERE id=?
    `;
    const values = [txnid, products, amount, name, email, mobile, city, id];

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Customer updated", affected: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Customer
export const deleteCustomer = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM tempcust WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Customer deleted", affected: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
