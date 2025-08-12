import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDatabase } from "./src/config/db.js";
import cookieParser from "cookie-parser";
import { createTables } from "./src/utils.js/dbUtils.js";
import { authRouter } from "./src/routes/authRoutes.js";
dotenv.config();
import multer from "multer";
import { getDB } from "./src/config/db.js";
import courseSettingsRoutes from './src/routes/courseSettingsRoutes.js'

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

app.use("/uploads", express.static("uploads"));

app.post(
  "/upload-company-settings",
  upload.single("logo"),
  async (req, res) => {
    try {
      const db = getDB();

      const {
        companyName,
        email,
        phoneNumber,
        address,
        city,
        pincode,
        country,
      } = req.body;

      // Basic validation
      if (
        !companyName ||
        !email ||
        !phoneNumber ||
        !address ||
        !city ||
        !pincode ||
        !country
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Logo file is required" });
      }

      const filePath = req.file.path; // relative file path (e.g. uploads/12345.png)

      // Example: Insert into your DB (adjust your table/column names)
      await db.execute(
        `INSERT INTO company_settings 
    (company_name, email, phone_number, address, city, pincode, country, file_path) 
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          companyName,
          email,
          phoneNumber,
          address,
          city,
          pincode,
          country,
          filePath,
        ]
      );

      res.status(200).json({
        message: "Company settings saved successfully",
        fileUrl: `/${filePath}`,
      });
    } catch (error) {
      console.error("Error in /upload-company-settings:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.post("/upload-single", upload.single("logo"), async (req, res) => {
  const db = getDB();

  const filePath = req.file?.path;
  const fileName = req.file?.filename;

  if (!filePath || !fileName) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    await db.execute(`INSERT INTO company_logo (file_path) VALUES (?)`, [
      filePath,
    ]);

    console.log("File uploaded successfully:", fileName);

    res.status(200).json({
      message: "Logo uploaded successfully",
      fileName,
      fileUrl: `/uploads/${fileName}`, // Relative URL to access the image
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/get-logo", async (req, res) => {
  const db = getDB();
  try {
    const [rows] = await db.execute(
      "SELECT * FROM company_settings ORDER BY uploaded_at DESC LIMIT 1"
    );
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: "No logo found" });
    }
  } catch (error) {
    console.error("Error fetching logo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



app.use("/api/auth", authRouter);
app.use("/api/course-settings", courseSettingsRoutes);

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectToDatabase();
    await createTables();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error creating tables:", error.message);
    process.exit(1);
  }
};

startServer();
