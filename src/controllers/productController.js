import db from "../config/db.js";

// Create Product
export const createProduct = async (req, res) => {
  try {
    const {
      pname,
      cat_id,
      br_id,
      mrp,
      sell_price,
      e_price,
      status,
      sku,
      d_link,
      features,
      m_des,
      ins_inst,
      platform,
      meta_key,
      meta_des,
    } = req.body;

    // Save full path (relative to backend root)
    const imagePath = req.file ? `model/pics/${req.file.filename}` : null;

    const sql = `
      INSERT INTO pro_main 
      (pname, up_img, cat_id, br_id, mrp, sell_price, e_price, status, sku, d_link, features, m_des, ins_inst, platform, meta_key, meta_des)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      pname,
      imagePath,
      cat_id,
      br_id,
      mrp,
      sell_price,
      e_price,
      status,
      sku,
      d_link,
      features,
      m_des,
      ins_inst,
      platform,
      meta_key,
      meta_des,
    ];

    const [result] = await db.query(sql, values);
    res.status(201).json({ message: "Product created", id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Products
export const getProducts = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM pro_main order by PID DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Product by ID
export const getProductById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM pro_main WHERE PID = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) return res.status(404).json({ message: "Not found" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      pname,
      cat_id,
      br_id,
      mrp,
      sell_price,
      e_price,
      status,
      sku,
      d_link,
      features,
      m_des,
      ins_inst,
      platform,
      meta_key,
      meta_des,
    } = req.body;

    const imagePath = req.file ? `model/pics/${req.file.filename}` : null;

    let sql = `
      UPDATE pro_main SET
      pname=?, cat_id=?, br_id=?, mrp=?, sell_price=?, e_price=?, status=?, sku=?, d_link=?, features=?, m_des=?, ins_inst=?, platform=?, meta_key=?, meta_des=?
    `;
    const values = [
      pname,
      cat_id,
      br_id,
      mrp,
      sell_price,
      e_price,
      status,
      sku,
      d_link,
      features,
      m_des,
      ins_inst,
      platform,
      meta_key,
      meta_des,
    ];

    if (imagePath) {
      sql += `, up_img=?`;
      values.push(imagePath);
    }

    sql += ` WHERE PID=?`;
    values.push(id);

    const [result] = await db.query(sql, values);
    res.json({ message: "Product updated", affected: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM pro_main WHERE PID = ?", [
      req.params.id,
    ]);
    res.json({ message: "Product deleted", affected: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
