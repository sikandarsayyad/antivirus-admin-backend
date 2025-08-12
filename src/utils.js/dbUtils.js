import { getDB } from "../config/db.js";
import bcrypt from "bcryptjs";

export const createTables = async () => {
  const db = getDB();

  try {
    // Drop tables (users first because it depends on roles)
    // await db.execute(`DROP TABLE IF EXISTS users`);
    // await db.execute(`DROP TABLE IF EXISTS roles`);

    // Create roles table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS company_logo (
          id INT PRIMARY KEY AUTO_INCREMENT,
          file_path VARCHAR(255) NOT NULL,
          uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
      `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS company_logo (
          id INT PRIMARY KEY AUTO_INCREMENT,
          file_path VARCHAR(255) NOT NULL,
          uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
      `);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS company_settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        company_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone_number VARCHAR(20),
        address VARCHAR(255),
        city VARCHAR(100),
        pincode VARCHAR(20),
        country VARCHAR(100),
        file_path VARCHAR(255) NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS email_settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        protocol VARCHAR(100) NOT NULL,
        smtpHost VARCHAR(100) NOT NULL,
        smtpPort VARCHAR(100),
        smtpUser VARCHAR(255),
        smtpPassword VARCHAR(255),
        fromEmail VARCHAR(255),
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

    const roles = [
      [
        1, "Admin"
      ],
      [
        2, "Center"
      ],
      [
        3, "Instructor"
      ],
    ];

    // Insert roles only if they don't exist
    await db.query(`
      INSERT INTO roles (id, name) VALUES ?
      ON DUPLICATE KEY UPDATE name = VALUES(name)
    `, [roles]);

    // Create users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(100),
        role_id INT,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
        CREATE TABLE IF NOT EXISTS course_settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      setting_type ENUM('location','category','type') NOT NULL,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
    `);

    // Reset users table auto increment too
    await db.execute(`ALTER TABLE users AUTO_INCREMENT = 1`);

    console.log("Table is created or already exists");
  } catch (err) {
    console.error("Error creating tables:", err.message);
    process.exit(1);
  }
};
