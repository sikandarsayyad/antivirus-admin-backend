// controllers/authController.js
import db from "../config/db.js";
import jwt from "jsonwebtoken";
import axios from "axios";

export const LogIn = async (req, res) => {
  try {
    const { email, password, captchaToken } = req.body;

    // 1️⃣ Verify reCAPTCHA with Google
    if (!captchaToken) {
      return res.status(400).json({ message: "Captcha is required" });
    }

    const captchaVerifyURL = `https://www.google.com/recaptcha/api/siteverify`;
    const captchaResponse = await axios.post(
      captchaVerifyURL,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY, // from Google
          response: captchaToken,
        },
      }
    );

    if (!captchaResponse.data.success) {
      return res.status(400).json({ message: "Captcha verification failed" });
    }

    // 2️⃣ Find user by email
    const [rows] = await db.query(
      "SELECT * FROM admin_cms WHERE email = ?",
      [email]
    );
    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = rows[0];

    // 3️⃣ Compare plain password (⚠️ not secure — use bcrypt later)
    if (user.pwd !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 4️⃣ Generate JWT
    const token = jwt.sign(
      { uid: user.uid, email: user.email, status: user.status },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 5️⃣ Send response without password
    const { pwd, ...userData } = user;
    res.json({ user: userData, token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: error.message });
  }
};
