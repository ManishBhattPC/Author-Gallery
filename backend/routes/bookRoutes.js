import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  getBooks,
  getBookById,
  createBook,
  getMyBooks,
  updateBook,
  deleteBook,
  incrementDownloads,
} from "../controllers/bookController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getBooks); // Public: Explore all books

router.get("/my-books", protect, getMyBooks); // Logged-in author's books

router.get("/:id", getBookById); // Public: Single book details

router.post("/:id/download", incrementDownloads); // Increment downloads count

router.post(
  "/",
  protect, // User must be logged in
  upload.fields([
    { name: "coverImage", maxCount: 1 }, // Cover image file
    { name: "pdfFile", maxCount: 1 }, // PDF file
  ]),
  createBook
);

router.put("/:id", protect, updateBook); // Update own book

router.delete("/:id", protect, deleteBook); // Delete own book

export default router;

/*
Future Roadmap

1. Add Admin Routes
--------------------------------
- Admin can update any book
- Admin can delete any book

2. Advanced Search
--------------------------------
- Search by author name
- Multiple genre filtering

3. Book Moderation
--------------------------------
- Hide inappropriate books
- Flag reported books

4. Analytics Routes
--------------------------------
- Most viewed books
- Most downloaded books

Current Version:
- Public read access
- Author-owned CRUD
*/