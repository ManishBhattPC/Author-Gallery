import express from "express";
import {
  getCommentsByBook,
  postComment,
  toggleLikeComment,
} from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/book/:bookId", getCommentsByBook);
router.post("/", protect, postComment);
router.post("/:id/like", protect, toggleLikeComment);

export default router;
