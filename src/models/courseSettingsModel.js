import { getDB } from "../config/db.js";

// Create new setting
export const createSetting = async (setting_type, name) => {
  if (!setting_type?.trim() || !name?.trim()) {
    throw new Error("Both 'setting_type' and 'name' are required.");
  }

  const db = getDB();

  // Check for duplicate
  const [existing] = await db.execute(
    "SELECT id FROM course_settings WHERE setting_type = ? AND name = ?",
    [setting_type.trim(), name.trim()]
  );

  if (existing.length > 0) {
    throw new Error(`Setting '${name}' already exists for type '${setting_type}'.`);
  }

  // Insert
  const [result] = await db.execute(
    "INSERT INTO course_settings (setting_type, name) VALUES (?, ?)",
    [setting_type.trim(), name.trim()]
  );

  return { success: true, insertId: result.insertId };
};

// Get all settings by type
export const getSettingsByType = async (type) => {
  if (!type?.trim()) {
    throw new Error("'type' parameter is required.");
  }

  const db = getDB();
  const [rows] = await db.execute(
    "SELECT * FROM course_settings WHERE setting_type = ? ORDER BY id DESC",
    [type.trim()]
  );

  return rows;
};