import express from "express"
import { getAuthorDashboardStats, getPublicSummaryStats } from "../controllers/dashboardController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

// Get general public stats (unprotected)
router.get("/summary", getPublicSummaryStats)

// Get dashboard stats (protected - author only)
router.get("/stats", protect, getAuthorDashboardStats)

export default router