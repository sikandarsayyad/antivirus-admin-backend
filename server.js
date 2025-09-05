import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import db from "./src/config/db.js";   // auto-connect
import { authRouter } from "./src/routes/authRoutes.js";
import helmet from "helmet"; 
import { reviewRouter } from "./src/routes/reviewRoutes.js";
import { categoryRouter } from "./src/routes/categoryRoutes.js";
import { productRouter } from "./src/routes/productRoutes.js";
import { brandRouter } from "./src/routes/brandRoutes.js";
import { newArrivalRouter } from "./src/routes/newArrivalRoutes.js";
import { buyCustRouter } from "./src/routes/buyCustRoutes.js";
import { salesRouter } from "./src/routes/salesRoutes.js";
import { inventoryRouter } from "./src/routes/inventoryRoutes.js";
import { couponRouter } from "./src/routes/couponRoutes.js";
import { userRouter } from "./src/routes/userRoutes.js";
import { keyRouter } from "./src/routes/keyRoutes.js";


dotenv.config();
const app = express();

// -------------------- Middleware --------------------
app.use(cors({
  origin: "http://localhost:5173",  // React frontend
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/model/pics', express.static('model/pics'));

const testDB = async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ Database connection successful!");
    connection.release();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

await testDB();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://www.google.com",
          "https://www.gstatic.com"
        ],
        frameSrc: [
          "'self'",
          "https://www.google.com",
          "https://www.gstatic.com"
        ],
        connectSrc: [
          "'self'",
          "https://www.google.com",
          "https://www.gstatic.com"
        ]
      }
    }
  })
);

// -------------------- Routes --------------------
app.use("/api/auth", authRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/category", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/brands", brandRouter);
app.use("/api/newArrival", newArrivalRouter);
app.use("/api/buyingcust", buyCustRouter);
app.use("/api/sales", salesRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/coupons", couponRouter);
app.use("/api/keys", keyRouter);
app.use("/api/users", userRouter);



// -------------------- Start Server --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, async() => {
  console.log(`🚀 Server running on port ${PORT}`);
  
});
