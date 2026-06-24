import express from "express";
import { 
  getDashboardData, 
  deleteBook, 
  deleteAuthor, 
  dismissReport, 
  deleteReview 
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth protection & admin role check to all admin routes
router.use(protect);
router.use(admin);

router.get("/dashboard", getDashboardData);
router.delete("/books/:id", deleteBook);
router.delete("/authors/:id", deleteAuthor);
router.delete("/reports/:id", dismissReport);
router.delete("/reviews/:id", deleteReview);

export default router;
