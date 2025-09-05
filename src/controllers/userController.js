// // src/controllers/registerUserController.js
// import db from "../config/db.js";

// export const registerUser = async (req, res) => {
//   try {
//     const [rows] = await db.query(
//       "SELECT CID, name, email, mobile, state_n, cdate FROM regusers ORDER BY CID DESC"
//     );
//     res.json(rows);
//   } catch (err) {
//     console.error("Error fetching users:", err);
//     res.status(500).json({ error: "Database error" });
//   }
// };



import db from "../config/db.js";

// GET all users
export const getUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT CID, name, email, mobile, state_n, cdate FROM regusers ORDER BY CID DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// CREATE new user
export const createUser = async (req, res) => {
  try {
    const { name, mobile, email, state_n } = req.body;
    
    // Validation
    if (!name || !mobile || !email || !state_n) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if email already exists
    const [existingUser] = await db.query(
      "SELECT CID FROM regusers WHERE email = ?",
      [email]
    );
    
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Insert new user
    const [result] = await db.query(
      "INSERT INTO regusers (name, mobile, email, state_n) VALUES (?, ?, ?, ?)",
      [name, mobile, email, state_n]
    );

    res.status(201).json({ 
      message: "User created successfully", 
      id: result.insertId 
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// UPDATE user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobile, email, state_n } = req.body;
    
    // Validation
    if (!name || !mobile || !email || !state_n) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user exists
    const [existingUser] = await db.query(
      "SELECT CID FROM regusers WHERE CID = ?",
      [id]
    );
    
    if (existingUser.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if email already exists for another user
    const [emailCheck] = await db.query(
      "SELECT CID FROM regusers WHERE email = ? AND CID != ?",
      [email, id]
    );
    
    if (emailCheck.length > 0) {
      return res.status(400).json({ error: "Email already exists for another user" });
    }

    // Update user
    await db.query(
      "UPDATE regusers SET name = ?, mobile = ?, email = ?, state_n = ? WHERE CID = ?",
      [name, mobile, email, state_n, id]
    );

    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// DELETE user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const [existingUser] = await db.query(
      "SELECT CID FROM regusers WHERE CID = ?",
      [id]
    );
    
    if (existingUser.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete user
    await db.query("DELETE FROM regusers WHERE CID = ?", [id]);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// GET single user by ID (for edit page)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await db.query(
      "SELECT CID, name, email, mobile, state_n FROM regusers WHERE CID = ?",
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Database error" });
  }
};