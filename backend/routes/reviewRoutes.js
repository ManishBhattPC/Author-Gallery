import express from "express";
import { 
  addReview, 
  getBookReviews, 
  getAuthorReviews 
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes for reading reviews
router.get("/book/:bookId", getBookReviews);
router.get("/author/:authorId", getAuthorReviews);

// Protected routes for writing reviews
router.post("/", protect, addReview);

export default router;
