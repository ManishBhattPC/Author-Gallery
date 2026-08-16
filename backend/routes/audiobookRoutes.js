import express from "express";
import {
  getAudiobooks,
  getAudiobookById,
  createAudiobook,
} from "../controllers/audiobookController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAudiobooks);
router.get("/:id", getAudiobookById);

// Protected author routes
router.post("/", protect, createAudiobook);

export default router;
