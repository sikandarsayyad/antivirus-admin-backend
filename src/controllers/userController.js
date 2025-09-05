import db from '../config/db.js'

// CREATE USER
export const createUser = async (req, res) => {
  try {
    const { ur_name, ur_mail, ur_pass, ur_role, status } = req.body;

    const [result] = await db.query(
      "INSERT INTO cuser_main (ur_name, ur_mail, ur_pass, ur_role, status) VALUES (?, ?, ?, ?, ?)",
      [ur_name, ur_mail, ur_pass, ur_role, status]
    );

    res.status(201).json({ message: "User created successfully", id: result.insertId });
  } catch (error) {
    console.error("Create User Error:", error);
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { ur_name, ur_mail, ur_pass, ur_role, status } = req.body;

    const [result] = await db.query(
      "UPDATE cuser_main SET ur_name=?, ur_mail=?, ur_pass=?, ur_role=?, status=? WHERE ur_id=?",
      [ur_name, ur_mail, ur_pass, ur_role, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("DELETE FROM cuser_main WHERE ur_id=?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};

// GET ALL USERS
export const getUsers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM cuser_main ORDER BY ur_id ASC");
    res.json(rows);
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// GET SINGLE USER
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query("SELECT * FROM cuser_main WHERE ur_id=?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};
