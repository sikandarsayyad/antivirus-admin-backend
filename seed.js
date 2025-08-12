import bcrypt from "bcryptjs";
import { connectToDatabase, getDB } from "./src/config/db.js";

async function seed() {
  await connectToDatabase();
  const db = getDB();

  // Clear existing data
  // await db.execute("DELETE FROM users");

  // Get role IDs
  const [roleRows] = await db.execute("SELECT id, name FROM roles");
  const roleMap = {};
  roleRows.forEach((r) => (roleMap[r.name] = r.id));

  // Seed users
  const users = [
    {
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      role: "Admin",
    },
    {
      name: "Instructor User",
      email: "instructor@example.com",
      password: "instructor123",
      role: "Instructor",
    },
    {
      name: "Center User",
      email: "center@example.com",
      password: "center123",
      role: "Center",
    },
    {
      name: "Admin User",
      email: "sayyadsikandar476@gmail.com",
      password: "new123",
      role: "Admin",
    },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await db.execute(
      "INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)",
      [user.name, user.email, hashedPassword, roleMap[user.role]]
    );
  }

  console.log("Users inserted");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
