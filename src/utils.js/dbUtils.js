import { getDB } from '../config/db.js';
import bcrypt from 'bcryptjs';

export const createTables = async () => {
  const db = getDB();

  try {
    // Drop tables (users first because it depends on roles)
    // await db.execute(`DROP TABLE IF EXISTS users`);
    // await db.execute(`DROP TABLE IF EXISTS roles`);

    //  Create roles table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE
      )
    `);

    const roles = [
      [1, 'Admin'],
      [2, 'Center'],
      [3, 'Instructor']
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

    // Reset users table auto increment too
    await db.execute(`ALTER TABLE users AUTO_INCREMENT = 1`);

    console.log('Table is created or already exists');

  } catch (err) {
    console.error('Error creating tables:', err.message);
    process.exit(1);
  }
};
