import express from "express";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controllers/buyCustController.js";

const router = express.Router();

// Create Customer
router.post("/", createCustomer);

// Get All Customers
router.get("/", getCustomers);

// Get Customer by ID
router.get("/:id", getCustomerById);

// Update Customer
router.put("/:id", updateCustomer);

// Delete Customer
router.delete("/:id", deleteCustomer);

export { router as buyCustRouter };
