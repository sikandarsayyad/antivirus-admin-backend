import bcrypt from "bcryptjs";
import { getDB } from "../config/db.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const RESET_TOKEN = process.env.RESET_TOKEN;

export const registerUser = async (user) => {
  const db = getDB();

  try {
    // Check if email is already registered
    const [existing] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [user.email]
    );
    if (existing.length > 0) {
      return { success: false, message: "Email already registered" };
    }

    // Lookup role_id by role name
    const [roles] = await db.execute("SELECT id FROM roles WHERE name = ?", [
      user.role,
    ]);
    if (roles.length === 0) {
      return { success: false, message: "Invalid role specified" };
    }
    const roleId = roles[0].id;

    // Hash password
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Insert user with fetched role_id
    const query = `INSERT INTO users (name, email, password, role, role_id) VALUES (?, ?, ?, ?, ?)`;
    const values = [user.name, user.email, hashedPassword, user.role, roleId];

    await db.execute(query, values);

    return { success: true, message: "User registration successful!" };
  } catch (error) {
    console.error("registerUser error:", error.message);
    return { success: false, message: "User registration failed" };
  }
};

export const signInUser = async (user) => {
  const db = getDB();

  try {
    // Fetch user by email
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      user.email,
    ]);

    if (rows.length === 0) {
      console.log("No user found with email:", user.email);
      return { success: false, message: "Email not found" };
    }

    const foundUser = rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(user.password, foundUser.password);

    if (!isMatch) {
      console.log("Password mismatch for user:", user.email);
      return { success: false, message: "Incorrect password" };
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Remove password before sending to client
    delete foundUser.password;

    return { success: true, message: "Signin successful!", token: token };
  } catch (error) {
    console.error("Signin error:", error.message);
    return { success: false, message: "User Signin failed" };
  }
};

export const getUserDataFromToken = async (token) => {
  try {
    const decodedToken = jwt.verify(token.trim(), JWT_SECRET);

    const db = getDB(); 

    const [rows] = await db.execute(
      "SELECT id, name, email, role FROM users WHERE email = ?",
      [decodedToken.email]
    );

    if (rows.length === 0) {
      return { success: false, message: "User not found" };
    }

    return { success: true, data: rows[0] };

  } catch (error) {
    console.error("getUserDataFromToken error:", error.message);
    return { success: false, message: "Invalid Token" };
  }
};

export const sendResetLinkService = async (email) => {
  const db = getDB();

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return { success: false, message: "User not found" };
    }

    const user = rows[0];

    const resetToken = jwt.sign(
      { id: user.id, email: user.email },
      RESET_TOKEN,
      { expiresIn: "10m" }
    );

    const resetLink = `https://whizfortune-frontend-1oca.vercel.app/reset-password?token=${resetToken}`;

    // Setup SMTP transporter
    const transporter = nodemailer.createTransport({
      host: "mail.whizfortune.com",
      port: 465,
      secure: true,
      auth: {
        user: "sikandar.sayyad@whizfortune.com",
        pass: "Sikandar1998",
      },
    });

    // Email HTML Template
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>We received a request to reset your password.</p>
        <p>
          Click the button below to reset your password. This link will expire in 10 minutes.
        </p>
        <a href="${resetLink}" 
           style="background-color: #4CAF50; color: white; padding: 10px 20px; 
           text-decoration: none; display: inline-block; border-radius: 5px;">
          Reset Password
        </a>
        <p>If you did not request this, you can safely ignore this email.</p>
      </div>
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"Support" <sikandar.sayyad@whizfortune.com>`,
      to: email,
      subject: "Reset Your Password",
      html: htmlBody,
    });

    return {
      success: true,
      message: "Reset password email sent successfully",
      resetLink,
      emailResponse: info.response,
    };
  } catch (error) {
    console.error("Reset link error:", error);
    return {
      success: false,
      message: "Reset link sending failed. Please try again later.",
    };
  }
};

export const resetPasswordService = async (token, password) => {
  const db = getDB();

  try {
    const decoded = jwt.verify(token, RESET_TOKEN);

    const hashedPassword = await bcrypt.hash(password, 10);

    const values = [hashedPassword, decoded.id];

    await db.query("UPDATE users SET password=? WHERE id=?", values);

    return { success: true, message: "Password reset successfully" };
  } catch (error) {
    console.error("Reset link generation error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
};
