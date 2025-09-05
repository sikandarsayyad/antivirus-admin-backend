import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

let pool;

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // Test a connection immediately
  const connection = await pool.getConnection();
  console.log("✅ Database connection successful!");
  connection.release();
} catch (error) {
  console.error("❌ Database connection failed:", error.message);
  process.exit(1);
}

export default pool;
