import bcrypt from 'bcryptjs';
import { getDB } from './src/config/db.js';

const db = getDB();

// Clear existing data (optional)
await db.execute('DELETE FROM users');
await db.execute('DELETE FROM roles');

// Step 1: Seed roles
const roles = ['Admin', 'Instructor', 'Center'];
for (const role of roles) {
  await db.execute('INSERT INTO roles (name) VALUES (?)', [role]);
}
console.log('Roles inserted');

// Step 2: Get role IDs (to avoid hardcoding IDs)
const [roleRows] = await db.execute('SELECT id, name FROM roles');
const roleMap = {};
roleRows.forEach(r => roleMap[r.name] = r.id);

// Step 3: Seed users
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'Admin',
  },
  {
    name: 'Instructor User',
    email: 'instructor@example.com',
    password: 'instructor123',
    role: 'Instructor',
  },
  {
    name: 'Center User',
    email: 'center@example.com',
    password: 'center123',
    role: 'Center',
  },
  {
    name: 'Admin User',
    email: 'sayyadsikandar476@gmail.com',
    password: 'Sitcoe@1234',
    role: 'Admin',
  },
];

for (const user of users) {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  await db.execute(
    'INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)',
    [user.name, user.email, hashedPassword, roleMap[user.role]]
  );
}

console.log('Users inserted');
process.exit(0);
