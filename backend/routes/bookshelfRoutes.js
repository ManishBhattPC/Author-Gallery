import express from "express";
import {
  getUserBookshelves,
  addBookToShelf,
  removeBookFromShelf,
} from "../controllers/bookshelfController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getUserBookshelves);
router.post("/", addBookToShelf);
router.delete("/:id/books/:bookId", removeBookFromShelf);

export default router;
