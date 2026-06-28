import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

// Order creation endpoint
router.post("/order", protect, createOrder);

// Payment verification endpoint
router.post("/verify", protect, verifyPayment);

export default router;
