import express from "express";
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";

const router = express.Router();


// 📚 GET all books (+ search)
router.get("/", getBooks);


// 📖 GET single book
router.get("/:id", getBookById);


// ➕ CREATE book
router.post("/", createBook);


// ✏️ UPDATE book
router.put("/:id", updateBook);


// ❌ DELETE book
router.delete("/:id", deleteBook);


export default router;