import express from "express";
import { 
  getDashboardData, 
  deleteBook, 
  deleteAuthor, 
  dismissReport, 
  deleteReview,
  getTransactions,
  getContactMessages,
  deleteContactMessage
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth protection & admin role check to all admin routes
router.use(protect);
router.use(admin);

router.get("/dashboard", getDashboardData);
router.get("/transactions", getTransactions);
router.get("/contacts", getContactMessages);
router.delete("/books/:id", deleteBook);
router.delete("/authors/:id", deleteAuthor);
router.delete("/reports/:id", dismissReport);
router.delete("/reviews/:id", deleteReview);
router.delete("/contacts/:id", deleteContactMessage);

export default router;
