import express from "express";
import {
  getDiscussions,
  getDiscussionById,
  createDiscussion,
  replyToDiscussion,
} from "../controllers/discussionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getDiscussions);
router.get("/:id", getDiscussionById);
router.post("/", protect, createDiscussion);
router.post("/:id/reply", protect, replyToDiscussion);

export default router;
