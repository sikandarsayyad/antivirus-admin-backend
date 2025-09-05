import db from "../config/db.js";

export const getReviews = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM reviews ORDER BY dt1 DESC");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


export const addReview = async (req, res) => {
  try {
    const { name, rating, review, PID, email, mobile } = req.body;

    if (!name || !rating || !review || !PID) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const sql = `
      INSERT INTO reviews 
      (name, rating, review, PID, email, mobile, status, dt1) 
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const values = [name, rating, review, PID, email || "", mobile || "", 0];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error inserting review:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(201).json({ 
        message: "Review added successfully", 
        reviewId: result.insertId 
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM reviews WHERE review_id = ?", [
      req.params.id,
    ]);
    res.json({ message: "Review deleted", affected: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
