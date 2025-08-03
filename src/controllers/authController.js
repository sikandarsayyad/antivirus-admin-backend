import UserModel from "../models/userModel.js";
import { registerUser, sendResetLinkService } from "../services/authServices.js";
import { signInUser } from "../services/authServices.js";
import { getUserDataFromToken } from "../services/authServices.js";
import { resetPasswordService } from "../services/authServices.js";


export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Input validation
  if (!name || !email || !password || !role) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
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
  const token = req.headers.authorization?.split(" ")[1];

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
  
    // const response = await sendResetEmailService(email);
    const response = await sendResetLinkService(email);

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
