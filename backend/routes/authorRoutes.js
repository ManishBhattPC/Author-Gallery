import express from "express"
import { 
  getAuthors, 
  getAuthorById,
  getAuthorDashboardStats,
  getAuthorActivity,
  followAuthor,
  unfollowAuthor,
  checkFollowStatus,
  getMyFollowers,
  getMyFollowing
} from "../controllers/authorController.js"
import { protect } from "../middleware/authMiddleware.js" // Auth middleware to verify logged-in user

const router = express.Router()

// Dashboard & Network routes (Protected, define first to prevent routing conflicts)
router.get("/dashboard/followers", protect, getMyFollowers)
router.get("/dashboard/following", protect, getMyFollowing)
router.get("/dashboard/stats", protect, getAuthorDashboardStats)
router.get("/dashboard/activity", protect, getAuthorActivity)

// Public routes (no authentication needed)
router.get("/", getAuthors) // Get all authors with optional featured filter
router.get("/:id", getAuthorById) // Get specific author by ID with their books

// Follow actions (Protected)
router.post("/:id/follow", protect, followAuthor)
router.post("/:id/unfollow", protect, unfollowAuthor)
router.get("/:id/is-following", protect, checkFollowStatus)

export default router