import express from "express"
import { 
  getAuthors, 
  getAuthorById,
  getAuthorDashboardStats,  // New - for dashboard header/stats
  getAuthorActivity          // New - for recent activity
} from "../controllers/authorController.js"
import { protect } from "../middleware/authMiddleware.js" // Auth middleware to verify logged-in user

const router = express.Router()

// Public routes (no authentication needed)
router.get("/", getAuthors) // Get all authors with optional featured filter

router.get("/:id", getAuthorById) // Get specific author by ID with their books

// Protected routes (authentication required)
router.get("/dashboard/stats", protect, getAuthorDashboardStats) // Get logged-in author's statistics

router.get("/dashboard/activity", protect, getAuthorActivity) // Get logged-in author's recent activity

export default router

/*
Future Roadmap

1. Follow/Unfollow Routes
--------------------------------
POST   /api/authors/:id/follow      - Follow an author
DELETE /api/authors/:id/follow      - Unfollow author
GET    /api/authors/:id/followers   - Get followers list
GET    /api/authors/me/following    - Get following list

2. Author Profile Update Routes
--------------------------------
PUT    /api/authors/me/profile      - Update author bio, name
PUT    /api/authors/me/profile-image - Upload profile image

3. Author Search Routes
--------------------------------
GET    /api/authors/search          - Search authors by name/bio
GET    /api/authors/trending        - Get trending authors
GET    /api/authors/top-rated       - Get top rated authors

4. Author Analytics Routes
--------------------------------
GET    /api/authors/me/analytics    - Get detailed analytics
GET    /api/authors/me/books/stats  - Stats per book

5. Admin Routes
--------------------------------
GET    /api/admin/authors           - View all authors (admin only)
DELETE /api/admin/authors/:id       - Delete author (admin only)
*/