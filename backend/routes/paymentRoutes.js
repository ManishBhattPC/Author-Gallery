import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  requestDirectPayment,
  getAuthorRequests,
  approveRequest,
  declineRequest,
  createOrder,
  verifyPayment,
  getBuyerOrders,
} from "../controllers/paymentController.js";

const router = express.Router();

// --- Direct Offline Payments (Primary Options) ---
router.post("/request", protect, requestDirectPayment);
router.get("/requests/author", protect, getAuthorRequests);
router.get("/orders/buyer", protect, getBuyerOrders);
router.post("/requests/:id/approve", protect, approveRequest);
router.post("/requests/:id/decline", protect, declineRequest);

// --- Online Payments (Razorpay - Kept for modularity / future use) ---
router.post("/order", protect, createOrder);
router.post("/verify", protect, verifyPayment);

export default router;
