import express from "express"
import { getAuthorDashboardStats } from "../controllers/dashboardController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

// Get dashboard stats (protected - author only)
router.get("/stats", protect, getAuthorDashboardStats)

export default router