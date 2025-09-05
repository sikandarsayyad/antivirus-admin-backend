import db from "../config/db.js";

// ✅ Get all coupons (with latest pname from products)
export const getCoupons = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.cc_id, c.PID, p.pname, c.cou_code, c.dis_amt, c.status, c.dt1
       FROM addcode_main c
       LEFT JOIN product p ON c.PID = p.PID
       ORDER BY c.cc_id DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Create new coupon
export const createCoupon = async (req, res) => {
  try {
    const { PID, cou_code, dis_amt, status } = req.body;

    // Insert only PID
    const sql =
      "INSERT INTO addcode_main (PID, cou_code, dis_amt, status, dt1) VALUES (?, ?, ?, ?, NOW())";
    const [result] = await db.query(sql, [PID, cou_code, dis_amt, status]);

    // Fetch pname fresh from product table
    const [[product]] = await db.query("SELECT pname FROM product WHERE PID = ?", [PID]);

    res.json({
      cc_id: result.insertId,
      PID,
      pname: product ? product.pname : null,
      cou_code,
      dis_amt,
      status,
      dt1: new Date(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update coupon
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { PID, cou_code, dis_amt, status } = req.body;

    const sql =
      "UPDATE addcode_main SET PID=?, cou_code=?, dis_amt=?, status=? WHERE cc_id=?";
    await db.query(sql, [PID, cou_code, dis_amt, status, id]);

    // Fetch pname fresh from product table
    const [[product]] = await db.query("SELECT pname FROM product WHERE PID = ?", [PID]);

    res.json({
      cc_id: id,
      PID,
      pname: product ? product.pname : null,
      cou_code,
      dis_amt,
      status,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete coupon
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM addcode_main WHERE cc_id=?", [id]);
    res.json({ message: "Coupon deleted", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};