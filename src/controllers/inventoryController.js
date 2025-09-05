import db from '../config/db.js'; // promise pool

// =================== Inventory =================== //

// 1️⃣ Get all brands (without products)
export const getBrands = async (req, res) => {
  try {
    const [brands] = await db.query(
      `SELECT BID, bname FROM brand ORDER BY BID ASC`
    );
    res.json(brands);
  } catch (err) {
    res.status(500).json(err);
  }
};

// 2️⃣ Get products for a specific brand with optional pagination
export const getBrandProducts = async (req, res) => {
  try {
    const { br_id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const query = `
      SELECT p.PID, p.pname, p.sell_price AS price,
             (SELECT COUNT(*) FROM qeys WHERE PID=p.PID) AS stock,
             (SELECT COUNT(*) FROM soldq WHERE pname=p.pname) AS sold
      FROM pro_main p
      WHERE p.BID = ?
      ORDER BY p.PID ASC
      LIMIT ? OFFSET ?
    `;

    const [products] = await db.query(query, [br_id, limit, offset]);
    res.json({ products });
  } catch (err) {
    res.status(500).json(err);
  }
};
