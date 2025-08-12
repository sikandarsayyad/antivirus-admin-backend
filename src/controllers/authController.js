import UserModel from "../models/userModel.js";
import { registerUser, sendResetLinkService } from "../services/authServices.js";
import { signInUser } from "../services/authServices.js";
import { getUserDataFromToken } from "../services/authServices.js";
import { resetPasswordService } from "../services/authServices.js";
import { sendResetLink } from "../services/authServices.js";
import { getDB } from "../config/db.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const RESET_TOKEN = process.env.RESET_TOKEN;


export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Input validation
  if (!name || !email || !password || !role) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required"});
  }

  // Create user instance
  const user = new UserModel({ name, email, password, role });

  try {
    // Await async call
    const response = await registerUser(user);

    return res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error(" Registration error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Server error: Registration failed" });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  // Create user instance
  const user = new UserModel({ email, password });

  try {
    // Await async call
    const response = await signInUser(user);
    const { success, token } = response;

    if (success) {
      res.cookie("AuthToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000,
      });
    }

    return res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error(" Signin error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Server error: Signin failed" });
  }
};

export const getUserFromToken = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    // Await async call
    const response = await getUserDataFromToken(token);

    return res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error(" Signin error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Server error: Signin failed" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
  
    const response = await sendResetLinkService(email);
    // const response = await sendResetLinkService(email);
    // const response = await newSendResetLink(email);

    return res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error(" Signin error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Server error: Link send failed" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token, !password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required" });
    }
  
    const response = await resetPasswordService(token, password);

    return res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error("Token or Password error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Server error: Password reset failed" });
  }
};



export const updateEmailSetting = async (req, res) => {
  const { protocol, smtpHost, smtpPort, smtpUser, smtpPassword, fromEmail } = req.body;

  if (!protocol || !smtpHost || !smtpPort || !smtpUser || !smtpPassword || !fromEmail) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const db = getDB();
    const values = [protocol, smtpHost, smtpPort, smtpUser, smtpPassword, fromEmail];

    const [result] = await db.execute(
      "INSERT INTO email_settings (protocol, smtpHost, smtpPort, smtpUser, smtpPassword, fromEmail) VALUES (?, ?, ?, ?, ?, ?)",
      values
    );

    if (result.affectedRows === 0) {
      return res.status(500).json({ success: false, message: "Failed to update email settings" });
    }

    return res.status(200).json({ success: true, message: "Email settings updated successfully" });
  } catch (error) {
    console.error("Error updating email settings:", error.message);
    return res.status(500).json({ success: false, message: "Failed to update email settings" });
  }
};

export const sendTestLink = async (req, res) => {
  const db = getDB();
  const { formData, toEmail } = req.body;

  // Basic validation
  if (!formData?.smtpHost || !formData?.smtpPort || !formData?.smtpUser || !formData?.smtpPassword || !formData?.fromEmail) {
    return res.status(400).json({ success: false, message: "All SMTP settings and fromEmail are required" });
  }
  if (!toEmail || !toEmail.includes("@")) {
    return res.status(400).json({ success: false, message: "Valid recipient email is required" });
  }

  try {
    // Check if user exists
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [toEmail]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate reset token & link
    const resetToken = jwt.sign(
      { id: rows[0].id, email: rows[0].email },
      RESET_TOKEN,
      { expiresIn: "10m" }
    );
    const resetLink = `https://whizfortune-frontend-1oca.vercel.app/reset-password?token=${resetToken}`;

    // Setup transporter & send
    const transporter = nodemailer.createTransport({
      host: formData.smtpHost,
      port: formData.smtpPort,
      secure: true,
      auth: { user: formData.smtpUser, pass: formData.smtpPassword },
    });

    await transporter.sendMail({
      from: `"Support" <${formData.fromEmail}>`,
      to: toEmail,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>Click the button below to reset your password. This link will expire in 10 minutes.</p>
          <a href="${resetLink}" style="background:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Reset Password</a>
        </div>
      `,
    });

    res.status(200).json({ success: true, message: "Reset password email sent", resetLink });

  } catch (error) {
    console.error("Reset link error:", error);
    res.status(500).json({ success: false, message: "Email sending failed" });
  }
};


