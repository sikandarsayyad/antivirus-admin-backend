import db from "../config/db.js";

// Format JS Date to d-m-Y
const formatDate = (date) => {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
};

// Sales summary controller
export const getSalesSummary = async (req, res) => {
  try {
    const today = formatDate(new Date());
    const yesterday = formatDate(new Date(Date.now() - 86400000)); // 1 day in ms
    const firstDayOfMonth = formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const lastDay = today;

    const [result] = await db.query(`
      SELECT
        -- Today's Sale
        (SELECT COUNT(*) FROM soldq WHERE STR_TO_DATE(sdate, '%d-%m-%Y') = CURDATE()) AS today_count,
        (SELECT IFNULL(SUM(tprice),0) FROM soldq WHERE STR_TO_DATE(sdate, '%d-%m-%Y') = CURDATE()) AS today_amount,
        
        -- Yesterday's Sale
        (SELECT COUNT(*) FROM soldq WHERE STR_TO_DATE(sdate, '%d-%m-%Y') = CURDATE() - INTERVAL 1 DAY) AS yesterday_count,
        (SELECT IFNULL(SUM(tprice),0) FROM soldq WHERE STR_TO_DATE(sdate, '%d-%m-%Y') = CURDATE() - INTERVAL 1 DAY) AS yesterday_amount,
        
        -- Monthly Sale
        (SELECT COUNT(*) FROM soldq WHERE STR_TO_DATE(sdate, '%d-%m-%Y') BETWEEN STR_TO_DATE(?, '%d-%m-%Y') AND STR_TO_DATE(?, '%d-%m-%Y')) AS monthly_count,
        (SELECT IFNULL(SUM(tprice),0) FROM soldq WHERE STR_TO_DATE(sdate, '%d-%m-%Y') BETWEEN STR_TO_DATE(?, '%d-%m-%Y') AND STR_TO_DATE(?, '%d-%m-%Y')) AS monthly_amount,
        
        -- Total Sale
        (SELECT COUNT(*) FROM soldq) AS total_count,
        (SELECT IFNULL(ROUND(SUM(tprice)),0) FROM soldq) AS total_amount
    `, [firstDayOfMonth, lastDay, firstDayOfMonth, lastDay]);

    res.json({
      today: { count: result[0].today_count, amount: result[0].today_amount },
      yesterday: { count: result[0].yesterday_count, amount: result[0].yesterday_amount },
      monthly: { count: result[0].monthly_count, amount: result[0].monthly_amount },
      total: { count: result[0].total_count, amount: result[0].total_amount }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
